import Phaser   from 'phaser';
import Phaser3D from './../../plugins/Phaser3D';

import BoardPlugin    from 'phaser3-rex-plugins/plugins/board-plugin.js';
import { HexagonMap } from 'phaser3-rex-plugins/plugins/board-components.js';

class Game extends Phaser.Game {

    constructor() {

        super({
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scale: {
                mode       : Phaser.Scale.FIT,
                autoCenter : Phaser.Scale.CENTER_BOTH,
            },
            scene: Scene,
            plugins: {
                scene: [{
                    key: 'rexBoard',
                    plugin: BoardPlugin,
                    mapping: 'rexBoard'
                }]
            }
        });
    }
}

class Scene extends Phaser.Scene {

    constructor() {
        
        super({
            key: 'main-scene'
        })
    }

    create() {
        // this.buildHexagon();

        this.buildSphere();
    }

    buildSphere() {

        this.phaser3d = new Phaser3D(this, {
            fov: 45,
            near: 1,
            far: 1000,
            x: 0,
            y: 95,
            z: 0
        });

        this.phaser3d.camera.lookAt(0, 0, 0);
 
        this.phaser3d.enableShadows();
        this.phaser3d.enableGamma();

        this.phaser3d.add.ambientLight({
            color: 0xffffff,
            intensity: 0.1
        });

        const spotlight = this.phaser3d.add.spotLight({
            intensity: 0.5,
            angle: 0.4,
            decay: 0.1,
            distance: 250,
            x: 0,
            y: 220,
            z: 0
        });

        this.addThreeBound(10, game.config.height + 20, game.config.width / 2 + 5, 0);
        this.addThreeBound(10, game.config.height + 20, - game.config.width / 2 - 5, 0);
        this.addThreeBound(game.config.width, 10, 0, game.config.height / 2 + 5);
        this.addThreeBound(game.config.width, 10, 0, - game.config.height / 2 - 5);
    }

    buildHexagon() {
        
        const board = this.rexBoard.add.board({
            grid: {
                gridType: 'hexagonGrid',
                x: 60,
                y: 60,
                size: 30,
                staggeraxis: 'y',
                staggerindex: 'odd'
            }
        })
        .setInteractive();

        const tileXYArray = board.fit(this.rexBoard.hexagonMap.hexagon(board, 4));

        const graphics = this.add.graphics({
            lineStyle: {
                width: 1,
                color: 0xffffff,
                alpha: 1
            }
        });

        let tileXY, worldXY;
        
        for (let i in tileXYArray) {
            
            tileXY = tileXYArray[i];
            
            graphics.strokePoints(board.getGridPoints(tileXY.x, tileXY.y, true), true);

            worldXY = board.tileXYToWorldXY(tileXY.x, tileXY.y);
            
            this.add.text(worldXY.x, worldXY.y, `${tileXY.x},${tileXY.y}`).setOrigin(0.5);
        }
    }
}

window.game = new Game;