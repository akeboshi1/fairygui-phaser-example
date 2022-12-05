import { ExtendedObject3D, Scene3D, THREE } from '@enable3d/phaser-extension'

export class Test3DScene extends Scene3D {

    constructor() {
        super({ key: 'DemoMainScene' })
    }

    preload() {
        this.third.load.preload('sky', '/assets/images/sky.png')
        this.load.html('star', '/assets/svg/star.svg')
    }

    init() {
        this.accessThirdDimension({ gravity: { x: 0, y: -20, z: 0 } })
        this.stars = [];
        this.score = 0;
    }

    async create() {
        const zoom = 70;
        const w = this.cameras.main.width / zoom;
        const h = this.cameras.main.height / zoom;
        this.cams = {
            ortho: this.third.cameras.orthographicCamera({
                left: w / -2,
                right: w / 2,
                top: h / 2,
                bottom: h / -2
            }),
            perspective: this.third.camera,
            active: 'perspective',
            inTransition: false,
            offset: null
        }

        const { lights } = await this.third.warpSpeed('-ground', '-sky', '-orbitControls');
        const hemisphereLight = lights?.hemisphereLight;
        const ambientLight = lights?.ambientLight;
        const directionalLight = lights?.directionalLight;
        //const { hemisphereLight, ambientLight, directionalLight } = lights;
        // adjust lights
        hemisphereLight.intensity = 0.5;
        ambientLight.intensity = 0.5;
        directionalLight.intensity = 0.5;
        this.cams.offset = new THREE.Vector3()

        const flash = delay => {
            this.time.addEvent({
                delay: delay,
                callback: () => {
                    this.cameras.main.flash(250, 0, 0, 0, true)
                }
            })
        }

        this.input.keyboard.on('keydown-F', () => {
            if (this.cams.active === 'perspective') {
                this.cams.inTransition = true
                this.time.addEvent({
                    delay: 300,
                    callback: () => {
                        this.third.camera = this.cams.ortho
                        this.cams.inTransition = false
                    }
                })
                this.cams.active = 'ortho'
                flash(250)
                // restrict linear factor on z-axis
                this.robot.body.setLinearFactor(1, 1, 0)
                // set zero velocity on x-axis
                this.robot.body.setVelocityZ(0)
            } else {
                this.third.camera = this.cams.perspective
                this.cams.active = 'perspective'
                flash(10)
                this.robot.body.setLinearFactor(1, 1, 0)
            }
        })

        // adjust the camera
        this.third.camera.position.set(0, 5, 20)
        this.third.camera.lookAt(0, 0, 0)

        // add background image
        this.third.load.texture('sky').then(sky => {
            // change encoding to LinearEncoding
            sky.encoding = THREE.LinearEncoding
            sky.needUpdate = true
            this.third.scene.background = sky
        });

        // add platforms
        const platformMaterial = { phong: { transparent: true, color: 0x21572f } }
        const platforms = [
            this.third.physics.add.box(
                { name: 'platform-ground', y: -2, width: 30, depth: 10, height: 2, mass: 0 },
                platformMaterial
            ),
            this.third.physics.add.box(
                { name: 'platform-right1', x: 7, y: 4, width: 15, depth: 10, mass: 0 },
                platformMaterial
            ),
            // this.third.physics.add.box({ name: 'platform-left', x: -10, y: 7, width: 10, depth: 5, mass: 0 }, platformMaterial),
            this.third.physics.add.box(
                { name: 'platform-right2', x: 10, y: 10, width: 10, depth: 10, mass: 0 },
                platformMaterial
            )
        ];

        // add robot
        this.third.load.gltf('/assets/glb/Boy.glb').then(gltf => {
            this.robot = new ExtendedObject3D();
            this.robot.add(gltf.scene);
            const scale = 3;
            this.robot.scale.set(scale, scale, scale);
            this.robot.position.setY(0);

            this.robot.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = child.receiveShadow = true;
                }
            });

            // animations
            this.third.animationMixers.add(this.robot.animation.mixer);
            gltf.animations.forEach(animation => {
                this.robot.anims.add(animation.name, animation);
            })
            this.robot.anims.play('Idle');

            this.third.add.existing(this.robot);

            this.third.physics.add.existing(this.robot, {
                shape: 'box',
                ignoreScale: true,
                width: 0.5,
                height: 1.25,
                depth: 0.5,
                offset: { y: -0.625 }
            })
            this.robot.body.setLinearFactor(1, 1, 1)
            this.robot.body.setAngularFactor(0, 0, 0)
            this.robot.body.setFriction(0)

            this.third.camera.lookAt(this.robot.position);

            // add a sensor
            const sensor = new ExtendedObject3D();
            // @ts-ignore
            sensor.position.setY(-0.625)
            this.third.physics.add.existing(sensor, { mass: 1e-8, shape: 'box', width: 0.2, height: 0.2, depth: 0.2 })
            sensor.body.setCollisionFlags(4)

            // connect sensor to robot
            this.third.physics.add.constraints.lock(this.robot.body, sensor.body)

            // detect if sensor is on the ground
            sensor.body.on.collision((otherObject, event) => {
                if (/platform/.test(otherObject.name)) {
                    if (event !== 'end') this.robot.userData.onGround = true
                    else this.robot.userData.onGround = false
                }
            })

            // check robot overlap with star
            this.robot.body.on.collision((otherObject, event) => {
                if (/star/.test(otherObject.name)) {
                    if (!otherObject.userData.dead) {
                        otherObject.userData.dead = true
                        otherObject.visible = false
                        this.score += 10
                        // this.scoreText.setText(`score: ${this.score}`)
                    }
                }
            })
        });
        // add keys
        this.keys = {
            w: this.input.keyboard.addKey('w'),
            a: this.input.keyboard.addKey('a'),
            s: this.input.keyboard.addKey('s'),
            d: this.input.keyboard.addKey('d'),
            space: this.input.keyboard.addKey('space')
        }

    }

    walkAnimation() {
        if (this.robot.anims.current !== 'Run') this.robot.anims.play('Run')
    }

    idleAnimation() {
        if (this.robot.anims.current !== 'Idle') this.robot.anims.play('Idle')
    }

    update(time, delta) {
        // rotate the starts
        // (this looks strange I know, I will try to improve this in a future update)
        this.stars.forEach(star => {
            star.rotation.y += 0.03
            star.body.needUpdate = true
        })

        if (this.robot && this.robot.body) {
            // add just the camera position
            const withPerspective = this.cams.active === 'perspective'
            const inTransition = this.cams.inTransition

            const cameraOffset = {
                x: withPerspective ? -16 : 0,
                y: withPerspective ? 4 : 2,
                z: withPerspective ? 0 : 16
            }

            this.cams.offset.lerp(cameraOffset, 0.2)

            this.third.camera.position
                .copy(this.robot.position)
                .add(new THREE.Vector3(this.cams.offset.x, this.cams.offset.y, this.cams.offset.z))

            if (withPerspective || inTransition)
                this.third.camera.lookAt(this.robot.position.clone().add(new THREE.Vector3(0, 2, 0)))
            else this.third.camera.lookAt(this.third.camera.position.clone())

            // get rotation of robot
            const theta = this.robot.world.theta
            this.robot.body.setAngularVelocityY(0)

            // set the speed variable
            const speed = 7

            if (!withPerspective) {
                // A key
                if (this.keys.a.isDown) {
                    this.robot.body.setVelocityX(-speed)
                    if (theta > -(Math.PI / 2)) this.robot.body.setAngularVelocityY(-10)
                    this.walkAnimation()
                }
                // D key
                else if (this.keys.d.isDown) {
                    this.robot.body.setVelocityX(speed)
                    if (theta < Math.PI / 2) this.robot.body.setAngularVelocityY(10)
                    this.walkAnimation()
                }
                // do not move
                else {
                    this.robot.body.setVelocityX(0)
                    this.idleAnimation()
                }
            } else {
                const walkDirection = { x: 0, z: 0 }

                // A key
                if (this.keys.a.isDown) {
                    walkDirection.z = -speed
                    // this.walkAnimation()
                }
                // D key
                else if (this.keys.d.isDown) {
                    walkDirection.z = speed
                    // this.walkAnimation()
                } else {
                    walkDirection.z = 0
                    // this.idleAnimation()
                }
                // W Key
                if (this.keys.w.isDown) {
                    walkDirection.x = speed
                    // this.walkAnimation()
                }
                // S key
                else if (this.keys.s.isDown) {
                    walkDirection.x = -speed
                    // this.walkAnimation()
                } else {
                    walkDirection.x = 0
                    // this.idleAnimation()
                }

                // walk
                this.robot.body.setVelocityX(walkDirection.x)
                this.robot.body.setVelocityZ(walkDirection.z)

                // is idle?
                const isIdle = walkDirection.x === 0 && walkDirection.z === 0

                if (isIdle) this.idleAnimation()
                else this.walkAnimation()

                // turn player
                if (!isIdle) {
                    const directionTheta = Math.atan2(walkDirection.x, walkDirection.z) + Math.PI
                    const playerTheta = this.robot.world.theta + Math.PI
                    const diff = directionTheta - playerTheta
                    if (diff > 0.25) this.robot.body.setAngularVelocityY(10)
                    if (diff < -0.25) this.robot.body.setAngularVelocityY(-10)
                }
            }

            // jump
            if (this.keys.space.isDown && this.robot.userData.onGround && Math.abs(this.robot.body.velocity.y) < 1e-1) {
                // this.robot.animation.play('WalkJump')
                this.robot.body.applyForceY(16)
            }
        }
    }

}