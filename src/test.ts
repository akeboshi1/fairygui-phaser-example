export class Test extends Phaser.Scene {
    constructor() {
        super({});
        console.log("test!");
    }
    create(){
        this.add.graphics(undefined);
        
    }
}