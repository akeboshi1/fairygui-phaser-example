import { GComponent, GProgressBar, GRoot, UIPackage } from "fairygui-phaser";

export class TooqingScene extends Phaser.Scene {
    private _view: GComponent;

    private _timeDelta: number = 1000;
    private _progressTimeEvent: any;
    private _progressTime: Phaser.Time.TimerEvent;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Tooqing", "assets/Tooqing.fui");
    }

    create(data) {
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, designWidth: 800, designHeight: 640
        });
        UIPackage.loadPackage("Tooqing").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);
            // ============ tooqing ui test
            UIPackage.createObject("Tooqing", "Main").then((obj) => {
                if (!this._progressTimeEvent) this._progressTimeEvent = { delay: this._timeDelta, callback: this.__playProgress, callbackScope: this, loop: true };
                this._view = obj.asCom;
                // this._view.setXY(200, 640 - this._view.height >> 1);
                GRoot.inst.addChild(this._view);

                // this.playProgressBar();
            });
        });

    }

    private playProgressBar(): void {
        if (!this._progressTime) this._progressTime = this.time.addEvent(this._progressTimeEvent);
        // obj.on(Event.UNDISPLAY, this.__removeTimer, this);
    }

    private __removeTimer(): void {
        // timer.clear(this, this.__playProgress);
        if (this._progressTime) {
            this._progressTime.remove(false);
            this._progressTime = null;
            //console.log("remove tweenupdate");
        }
    }

    private __playProgress(): void {
        var obj: GComponent = this._view;
        var cnt: number = obj.numChildren;
        for (var i: number = 0; i < cnt; i++) {
            // if (i != 3 && i != 0) continue;
            var child: GProgressBar = obj.getChildAt(i) as GProgressBar;
            if (child != null) {
                child.value += 1;
                if (child.value > child.max)
                    child.value = 0;
            }
        }
    }
}