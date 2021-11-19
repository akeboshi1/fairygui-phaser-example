import { GComponent, GObject, GRoot, UIPackage } from "fairygui-phaser";

export class BaseScene extends Phaser.Scene {
    protected pkgName: string;
    protected resName: string;

    protected _view: GComponent;

    constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    protected preload() {
        if (this.pkgName) {
            this.load.binary(this.pkgName, `assets/${this.pkgName}.fui`);
        }
    }

    protected create(data) {
        this.cameras.main.setBackgroundColor(0xbababa);

        GRoot.inst.attachTo(this, { osd: "", res: "assets/", resUI: "assets/" });

        if (!this.pkgName || !this.resName) {
            return;
        }

        UIPackage.loadPackage(this.pkgName).then((pkg) => {
            console.log("loaded package: ", this.pkgName, pkg);

            UIPackage.createObject(this.pkgName, this.resName).then(this.createObject.bind(this));
        });
    }

    protected createObject(obj: GObject) {
        this._view = obj.asCom;
        GRoot.inst.addChild(this._view);
    }
}