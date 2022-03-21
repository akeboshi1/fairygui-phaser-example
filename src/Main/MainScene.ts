import { GRoot, UIPackage, ObjectType, GList, Handler, GComponent, GButton, GObject, GTextInput, GGroup } from "fairygui-phaser";
import { GBasicTextField } from "fairygui-phaser/build/types/GBasicTextField";
import { i18n, initLocales, translate } from "../i18n/i18n";

export class MainScene extends Phaser.Scene {
    private _showList: any[];
    private _showGroup0: GGroup;
    private _showGroup1: GGroup;
    private _backBtn: GButton;
    private _loadBtn: GButton;
    private _sizeBtn: GButton;
    private _langBtn: GButton;
    private _list: GList;
    private _moduleNameInput: GTextInput;
    private _pathInput: GTextInput;
    private _widthIntput: GTextInput;
    private _heightInput: GTextInput;
    private _langInput: GTextInput;

    private n8: GBasicTextField;
    // 当前显示ui
    private _stage: GComponent;
    private _curView: GObject;
    private _moduleName: string;
    private _path: string;
    private _width: string;
    private _height: string;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("MainPanel", "assets/MainPanel.fui");
    }

    create(data) {
        const width = this.game.config.width;
        const height = this.game.config.height;
        // initLocales("../../assets/locales/zh-CN.json");
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height, designWidth: 800, designHeight: 640
        });
        UIPackage.loadPackage("MainPanel").then((pkg) => {
            console.log(pkg);
            // const itemList = pkg["_items"];
            // this._showList = [];
            // itemList.forEach((obj) => {
            //     if (obj.objectType === ObjectType.Component) {
            //         this._showList.push(obj);
            //     }
            // })
            UIPackage.createObject("MainPanel", "mainPanel").then((obj) => {
                this._stage = obj.asCom;
                GRoot.inst.addChild(this._stage);

                this._showGroup0 = this._stage.getChild("showGroup0") as GGroup;
                this._showGroup1 = this._stage.getChild("showGroup1") as GGroup;

                this._moduleNameInput = this._stage.getChild("inputTF0") as GTextInput;
                this._pathInput = this._stage.getChild("inputTF1") as GTextInput;

                this._widthIntput = this._stage.getChild("inputTF2") as GTextInput;
                this._heightInput = this._stage.getChild("inputTF3") as GTextInput;
                this._widthIntput.text = width + "";
                this._heightInput.text = height + "";
                this.n8 = this._stage.getChild("n8") as GBasicTextField;
                this._langInput = this._stage.getChild("inputTF4") as GTextInput;
                this._langInput.text = "en";
                this.langHandler();
                this.n8.text = "common.confirm";
                //initLocales("../../assets/locales/zh-CN.json");
                this._backBtn = this._stage.getChild("backBtn") as GButton;
                this._loadBtn = this._stage.getChild("inputBtn") as GButton;
                this._sizeBtn = this._stage.getChild("sizeBtn") as GButton;
                this._langBtn = this._stage.getChild("langBtn") as GButton;

                this._list = this._stage.getChild("componentList") as GList;
                // this._list.itemRenderer = Handler.create(this, this.renderListItem, null, false);
                // this._list.setVirtual().then(() => {
                //     this._list.numItems = this._showList.length;
                //     this._list.on("pointerdown", this.onClickList, this);
                // });


                this._loadBtn.onClick(this.loadHandler, this);
                this._backBtn.onClick(this.backHandler, this);
                this._sizeBtn.onClick(this.sizeHandler, this);
                this._langBtn.onClick(this.langHandler, this);
                this.checkViewVisible(true);
            });
        });
    }

    public i18nStr(val): string {
        return i18n.t(val);
    }

    private loadHandler(pointer, gameObject) {
        this._moduleName = this._moduleNameInput.text;
        this._path = "assets/" + this._pathInput.text;
        this.load.once(Phaser.Loader.Events.COMPLETE, this.loadComplete, this);
        this.load.binary(this._moduleName, this._path);
        this.load.start();
    }

    private sizeHandler(pointer, gameObject) {
        this._width = this._widthIntput.text;
        this._height = this._heightInput.text;
        this._stage.setSize(Number(this._width), Number(this._height));
    }

    private backHandler(pointer, gameObject) {
        if (this._curView) {
            this._curView.dispose();
            this._curView = null;
        }
        this.checkViewVisible(true);
    }

    private langHandler() {
        const lang = "../../assets/locales/" + this._langInput.text + ".json";
        initLocales(lang).then((key) => {
            GRoot.inst.i18n = translate;
        });
    }

    private loadComplete() {
        UIPackage.loadPackage(this._moduleName).then((pkg) => {
            console.log(pkg);
            const itemList = pkg["_items"];
            this._showList = [];
            itemList.forEach((obj) => {
                if (obj.objectType === ObjectType.Component) {
                    this._showList.push(obj);
                }
            });
            this._list.itemRenderer = Handler.create(this, this.renderListItem, null, false);
            this._list.setVirtual().then(() => {
                this._list.numItems = this._showList.length;
                this._list.on("pointerdown", this.onClickList, this);
            });
        });
    }

    private renderListItem(index: number, item: GComponent) {
        item["showData"] = this._showList[index];
        item.getChild("title").text = item["showData"]["name"];
        //item.scrollPane.posX = 0; //reset scroll pos

        item.getChild("selectBtn").onClick(this.onSelectClick, this);
    }

    private onClickList(pointer, gameObject) {
        console.log("onClickList");
    }

    private onSelectClick(pointer, gameObject) {
        const target = gameObject["$owner"];
        const item = target["_parent"];
        const name = item.showData.name;
        UIPackage.createObject(this._moduleName, name).then((obj) => {
            this.checkViewVisible(false);
            this._curView = obj.asCom;
            GRoot.inst.addChild(this._curView);
        });
        console.log("onSelectClick");
    }

    private checkViewVisible(visible: boolean) {
        if (this._showGroup0) this._showGroup0.visible = visible;
        if (this._backBtn) this._backBtn.visible = !visible;
    }
}
