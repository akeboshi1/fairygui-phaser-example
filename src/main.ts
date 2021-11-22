import { GrayScaleScene } from "./ColorFilter/GrayScaleScene";
import "phaser3";
import { GraphScene } from "./Graph/GraphScene";
import { BasicsScene } from "./Basics/BasicsScene";
import { ButtonScene } from "./Button/ButtonScene";
import { TextScene } from "./Text/TextScene";
var config = {
    type: Phaser.WEBGL,
    parent: "phaser-example",
    width: 2000,
    height: 2000,
    scale: {
        mode: Phaser.Scale.NONE,
    },
    dom: {
        createContainer: true
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    }
    //pipeline: { "Color": ColorShaderPipeline }
};
// @ts-ignore
var game = new Phaser.Game(config);

// 切换不同的scene演示不同的ui组件 
game.scene.add("uiScene", TextScene, true, { x: 0, y: 0 });
