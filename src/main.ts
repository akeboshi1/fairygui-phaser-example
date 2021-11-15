import { GrayScaleScene } from "./ColorFilter/GrayScaleScene";
import { MovieClipScene } from "./MovieClip/MovieClipScene";
import "phaser";
import { ImageScene } from "./Image/ImageScene";
import { BagPanelScene } from "./TooqingUI/BagPanel/BagPanelScene";
import { TreeNodeScene } from "./TreeNode/TreeNodeScene";
import { PullToRefreshScene } from "./PullToRefresh/PullToRefreshScene";
import { BasicsScene } from "./Basics/BasicsScene";
import { ButtonScene } from "./Button/ButtonScene";
import { ComBoBoxScene } from "./Combobox/ComBoBoxScene";
import GrayScalePipeline from "../assets/GrayScale.js";
var config = {
    type: Phaser.WEBGL,
    parent: "phaser-example",
    width: 2000,
    height: 2000,
    scale: {
        mode: Phaser.Scale.NONE,
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    pipeline: { "Gray": GrayScalePipeline }
};
// @ts-ignore
var game = new Phaser.Game(config);

// 切换不同的scene演示不同的ui组件 
game.scene.add("uiScene", GrayScaleScene, true, { x: 0, y: 0 });
