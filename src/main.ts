import { MovieClipScene } from './MovieClip/MovieClipScene';
import { GrayScaleScene } from "./ColorFilter/GrayScaleScene";
import "phaser3";
import { GraphScene } from "./Graph/GraphScene";
import { BasicsScene } from "./Basics/BasicsScene";
import { ButtonScene } from "./Button/ButtonScene";
import { TextScene } from "./Text/TextScene";
import { BagPanelScene } from './TooqingUI/BagPanel/BagPanelScene';
import { TooqingScene } from './TooqingUI/TooqingView/TooqingScene';
import { ImageScene } from './Image/ImageScene';
import { ComBoBoxScene } from './Combobox/ComBoBoxScene';
import { DragScene } from './Drag&Drop/DragScene';
import { ScrollScene } from './Scroll/ScrollScene';
import { SliderScene } from './Slider/SliderScene';

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
    backgroundColor: '#4488aa',
    fps: {
        target: 60,
        forceSetTimeOut: true
    }
    //pipeline: { "Color": ColorShaderPipeline }
};
// @ts-ignore
var game = new Phaser.Game(config);

// 切换不同的scene演示不同的ui组件 
game.scene.add("uiScene", BasicsScene, true, { x: 0, y: 0 });
