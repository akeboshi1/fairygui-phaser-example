import { MovieClipScene } from './MovieClip/MovieClipScene';
import "phaser3";
import { ImageScene } from "./Image/ImageScene";
import { BagPanelScene } from "./TooqingUI/BagPanel/BagPanelScene";
import { TreeNodeScene } from "./TreeNode/TreeNodeScene";
import { PullToRefreshScene } from './PullToRefresh/PullToRefreshScene';
import { BasicsScene } from './Basics/BasicsScene';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 2000,
    height: 2000,
    scale: {
        mode: Phaser.Scale.NONE,
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
};

var game = new Phaser.Game(config);

// 切换不同的scene演示不同的ui组件 
game.scene.add('uiScene', BasicsScene, true, { x: 0, y: 0 });
