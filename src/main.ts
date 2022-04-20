import { LoaderScene } from './Loader/LoaderScene';
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
import { MainScene } from './Main/MainScene';
// var Stats = require('./Stat');
export const DPR = window.devicePixelRatio;
//Math.round(window.devicePixelRatio);
// const { width, height } = { width: 1200, height: 1000};
//const roundHalf = num => Math.round(num * 2) / 2
// Set width and height.
const WIDTH = Math.round(window.innerWidth * DPR)
const HEIGHT = Math.round(window.innerHeight * DPR)
// export const assetsDPR = roundHalf(Math.min(Math.max(HEIGHT / 360, 1), 4))
var config = {
    type: Phaser.WEBGL,
    parent: "phaser-example",
    scale: {
        mode: Phaser.Scale.NONE,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
        width: WIDTH,
        height: HEIGHT,
        zoom: 1 / DPR,
    },
    // autoCenter: Phaser.Scale.CENTER_BOTH,
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
game.scene.add("uiScene", LoaderScene, true, { x: 0, y: 0 });

// const len = 3;
// const statList = [];
// for (let i = 0; i < len; i++) {
//     const stats = new Stats();
//     stats.setMode(0);
//     stats.domElement.style.position = 'absolute';
//     stats.domElement.style.right = '0px';
//     stats.domElement.style.top = '0px';
//     document.body.appendChild(stats.domElement);
//     statList.push(stats);
// }

// function animate() {
//     for (let i = 0, tmpLen = statList.length; i < tmpLen; i++) {
//         const stats = statList[i];
//         stats.begin();
//         stats.end();
//     }
//     requestAnimationFrame(animate);
// }

// requestAnimationFrame(animate);

// function preloadImg(srcArr) {
//     if (srcArr instanceof Array) {
//         for (let i = 0; i < srcArr.length; i++) {
//             let oImg = new Image();
//             oImg.src = srcArr[i];
//         }
//     }
// }

// preloadImg([
//     '../assets/snow_(1).png',
//     '../assets/snow_(2).png',
//     '../assets/snow_(3).png',
//     '../assets/snow_(4).png',
//     '../assets/snow_(5).png',
//     '../assets/snow_(6).png',
//     '../assets/snow_(7).png',
//     '../assets/snow_(8).png',
//     '../assets/snow_(9).png',
//     '../assets/snow_(10).png'
// ]);


// let snowBox = function () {
//     let canvasEl = document.getElementById("game-layer");
//     // @ts-ignore
//     let ctx = canvasEl.getContext('2d');
//     // @ts-ignore
//     canvasEl.width = 1280;
//     // @ts-ignore
//     canvasEl.height = 720;
//     let lineList = []; // 雪的容器
//     let snow = function () {
//         let _this = this;
//         _this.cacheCanvas = document.createElement("canvas");
//         _this.cacheCtx = _this.cacheCanvas.getContext("2d");
//         _this.cacheCanvas.width = 10;
//         _this.cacheCanvas.height = 10;
//         _this.speed = [1, 1.5, 2][Math.floor(Math.random() * 3)];                // 雪花下落的三种速度，便于取整
//         // @ts-ignore
//         _this.posx = Math.round(Math.random() * canvasEl.width);               // 雪花x坐标
//         // @ts-ignore
//         _this.posy = Math.round(Math.random() * canvasEl.height);              // 雪花y坐标
//         _this.img = `../assets/snow_(${Math.ceil(Math.random() * 9)}).png`;        // img
//         _this.w = _this.getInt(5 + Math.random() * 6);
//         _this.h = _this.getInt(5 + Math.random() * 6);
//         _this.cacheSnow();
//     };

//     snow.prototype = {
//         cacheSnow: function () {
//             let _this = this;
//             // _this.cacheCtx.save();
//             let img = new Image();   // 创建img元素
//             img.src = _this.img;
//             _this.cacheCtx.drawImage(img, 0, 0, _this.w, _this.h);
//             // _this.cacheCtx.restore();
//         },
//         fall: function () {
//             let _this = this;
//             // @ts-ignore
//             if (_this.posy > canvasEl.height + 5) {
//                 _this.posy = _this.getInt(0 - _this.h);
//                 // @ts-ignore
//                 _this.posx = _this.getInt(canvasEl.width * Math.random());
//             }
//             // @ts-ignore
//             if (_this.posx > canvasEl.width + 5) {
//                 _this.posx = _this.getInt(0 - _this.w);
//                 // @ts-ignore
//                 _this.posy = _this.getInt(canvasEl.height * Math.random());
//             }
//             // 如果雪花在可视区域
//             // @ts-ignore
//             if (_this.posy <= canvasEl.height || _this.posx <= canvasEl.width) {
//                 _this.posy = _this.posy + _this.speed;
//                 _this.posx = _this.posx + _this.speed * .5;
//             }
//             _this.paint();
//         },
//         paint: function () {
//             ctx.drawImage(this.cacheCanvas, this.posx, this.posy)
//         },
//         getInt: function (num) {
//             let rounded;
//             rounded = (0.5 + num) | 0;
//             return rounded;
//         }
//     };

//     let control;
//     control = {
//         start: function (num) {
//             for (let i = 0; i < num; i++) {
//                 let s = new snow();
//                 lineList.push(s);
//             }
//             (function loop() {
//                 // @ts-ignore
//                 ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
//                 for (let i = 0; i < num; i++) {
//                     lineList[i].fall();
//                 }
//                 requestAnimationFrame(loop)
//             })();
//         }
//     };
//     return control;
// }();

// let snowBox1 = function () {
//     let canvasEl = document.getElementById("ui-layer");
//     // @ts-ignore
//     let ctx = canvasEl.getContext('2d');
//     // @ts-ignore
//     canvasEl.width = 1280;
//     // @ts-ignore
//     canvasEl.height = 720;
//     let lineList = []; // 雪的容器
//     let snow = function () {
//         let _this = this;
//         _this.cacheCanvas = document.createElement("canvas");
//         _this.cacheCtx = _this.cacheCanvas.getContext("2d");
//         _this.cacheCanvas.width = 10;
//         _this.cacheCanvas.height = 10;
//         _this.speed = [1, 1.5, 2][Math.floor(Math.random() * 3)];                // 雪花下落的三种速度，便于取整
//         // @ts-ignore
//         _this.posx = Math.round(Math.random() * canvasEl.width);               // 雪花x坐标
//         // @ts-ignore
//         _this.posy = Math.round(Math.random() * canvasEl.height);              // 雪花y坐标
//         _this.img = `../assets/snow_(${Math.ceil(Math.random() * 9)}).png`;        // img
//         _this.w = _this.getInt(5 + Math.random() * 6);
//         _this.h = _this.getInt(5 + Math.random() * 6);
//         _this.cacheSnow();
//     };

//     snow.prototype = {
//         cacheSnow: function () {
//             let _this = this;
//             // _this.cacheCtx.save();
//             let img = new Image();   // 创建img元素
//             img.src = _this.img;
//             _this.cacheCtx.drawImage(img, 0, 0, _this.w, _this.h);
//             // _this.cacheCtx.restore();
//         },
//         fall: function () {
//             let _this = this;
//             // @ts-ignore
//             if (_this.posy > canvasEl.height + 5) {
//                 _this.posy = _this.getInt(0 - _this.h);
//                 // @ts-ignore
//                 _this.posx = _this.getInt(canvasEl.width * Math.random());
//             }
//             // @ts-ignore
//             if (_this.posx > canvasEl.width + 5) {
//                 _this.posx = _this.getInt(0 - _this.w);
//                 // @ts-ignore
//                 _this.posy = _this.getInt(canvasEl.height * Math.random());
//             }
//             // 如果雪花在可视区域
//             // @ts-ignore
//             if (_this.posy <= canvasEl.height || _this.posx <= canvasEl.width) {
//                 _this.posy = _this.posy + _this.speed;
//                 _this.posx = _this.posx + _this.speed * .5;
//             }
//             _this.paint();
//         },
//         paint: function () {
//             ctx.drawImage(this.cacheCanvas, this.posx, this.posy)
//         },
//         getInt: function (num) {
//             let rounded;
//             rounded = (0.5 + num) | 0;
//             return rounded;
//         }
//     };

//     let control;
//     control = {
//         start: function (num) {
//             for (let i = 0; i < num; i++) {
//                 let s = new snow();
//                 lineList.push(s);
//             }
//             (function loop() {
//                 // @ts-ignore
//                 ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
//                 for (let i = 0; i < num; i++) {
//                     lineList[i].fall();
//                 }
//                 requestAnimationFrame(loop)
//             })();
//         }
//     };
//     return control;
// }();

// let snowBox2 = function () {
//     let canvasEl = document.getElementById("background-layer");
//     // @ts-ignore
//     let ctx = canvasEl.getContext('2d');
//     // @ts-ignore
//     canvasEl.width = 1280;
//     // @ts-ignore
//     canvasEl.height = 720;
//     let lineList = []; // 雪的容器
//     let snow = function () {
//         let _this = this;
//         _this.cacheCanvas = document.createElement("canvas");
//         _this.cacheCtx = _this.cacheCanvas.getContext("2d");
//         _this.cacheCanvas.width = 10;
//         _this.cacheCanvas.height = 10;
//         _this.speed = [1, 1.5, 2][Math.floor(Math.random() * 3)];                // 雪花下落的三种速度，便于取整
//         // @ts-ignore
//         _this.posx = Math.round(Math.random() * canvasEl.width);               // 雪花x坐标
//         // @ts-ignore
//         _this.posy = Math.round(Math.random() * canvasEl.height);              // 雪花y坐标
//         _this.img = `../assets/snow_(${Math.ceil(Math.random() * 9)}).png`;        // img
//         _this.w = _this.getInt(5 + Math.random() * 6);
//         _this.h = _this.getInt(5 + Math.random() * 6);
//         _this.cacheSnow();
//     };

//     snow.prototype = {
//         cacheSnow: function () {
//             let _this = this;
//             // _this.cacheCtx.save();
//             let img = new Image();   // 创建img元素
//             img.src = _this.img;
//             _this.cacheCtx.drawImage(img, 0, 0, _this.w, _this.h);
//             // _this.cacheCtx.restore();
//         },
//         fall: function () {
//             let _this = this;
//             // @ts-ignore
//             if (_this.posy > canvasEl.height + 5) {
//                 _this.posy = _this.getInt(0 - _this.h);
//                 // @ts-ignore
//                 _this.posx = _this.getInt(canvasEl.width * Math.random());
//             }
//             // @ts-ignore
//             if (_this.posx > canvasEl.width + 5) {
//                 _this.posx = _this.getInt(0 - _this.w);
//                 // @ts-ignore
//                 _this.posy = _this.getInt(canvasEl.height * Math.random());
//             }
//             // 如果雪花在可视区域
//             // @ts-ignore
//             if (_this.posy <= canvasEl.height || _this.posx <= canvasEl.width) {
//                 _this.posy = _this.posy + _this.speed;
//                 _this.posx = _this.posx + _this.speed * .5;
//             }
//             _this.paint();
//         },
//         paint: function () {
//             ctx.drawImage(this.cacheCanvas, this.posx, this.posy)
//         },
//         getInt: function (num) {
//             let rounded;
//             rounded = (0.5 + num) | 0;
//             return rounded;
//         }
//     };

//     let control;
//     control = {
//         start: function (num) {
//             for (let i = 0; i < num; i++) {
//                 let s = new snow();
//                 lineList.push(s);
//             }
//             (function loop() {
//                 // @ts-ignore
//                 ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
//                 for (let i = 0; i < num; i++) {
//                     lineList[i].fall();
//                 }
//                 requestAnimationFrame(loop)
//             })();
//         }
//     };
//     return control;
// }();

// window.onload = function () {
//     snowBox.start(2400);
//     // snowBox1.start(800);
//     // snowBox2.start(800);
// };

// window.requestAnimationFrame = (function () {
//     // @ts-ignore
//     return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
// })();