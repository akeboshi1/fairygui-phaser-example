import { GRoot, UIPackage, ObjectType, GList, Handler, GComponent, GButton, GObject, GTextInput, GGroup, GRichTextField } from "fairygui-phaser";
import { i18n, initLocales, translate } from "../i18n/i18n";
export interface IHttpLoaderConfig {
    path: string;
    responseType: XMLHttpRequestResponseType;
    timeout?: number;
    loadTimes?: number;
}
export class MainScene extends Phaser.Scene {
    private _remoteUrl = "http://172.18.0.100/game/resource/5e719a0a68196e416ecf7aad/.config.json";
    private _remoteLngUrl = "http://172.18.0.100/game/resource/5e719a0a68196e416ecf7aad/0.17.83/client_resource/i18n_en.json"
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
    private _commonModuleInput: GTextInput;
    private _commonPathInput: GTextInput;
    private _langInput: GTextInput;
    private n8: GRichTextField;
    // 舞台
    private _stage: GComponent;
    // 当前fairygui
    private _curPkg: UIPackage;
    // 当前显示ui
    private _curView: GObject;
    // 当前json版本号
    private _version: string;
    private _moduleName: string;
    private _path: string;
    private _commonModule: string;
    private _commonPath: string;
    private _width: string;
    private _height: string;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("MainPanel", "assets/MainPanel.fui");
        this.load.json("versionJson", this._remoteUrl, "json");
    }

    create(data) {
        const width = this.game.config.width;
        const height = this.game.config.height;
        this._version = this.cache.json.get("versionJson").version;
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height, designWidth: 800, designHeight: 640
        });
        UIPackage.loadPackage("MainPanel").then((pkg) => {
            console.log(pkg);
            UIPackage.createObject("MainPanel", "mainPanel").then((obj) => {
                this._stage = obj.asCom;
                GRoot.inst.addChild(this._stage);

                this.n8 = this._stage.getChild("n8") as GRichTextField;
                this._showGroup0 = this._stage.getChild("showGroup0") as GGroup;
                this._showGroup1 = this._stage.getChild("showGroup1") as GGroup;

                this._moduleNameInput = this._stage.getChild("inputTF0") as GTextInput;
                this._pathInput = this._stage.getChild("inputTF1") as GTextInput;

                this._commonModuleInput = this._stage.getChild("inputTF2") as GTextInput;
                this._commonPathInput = this._stage.getChild("inputTF3") as GTextInput;

                this._langInput = this._stage.getChild("inputTF4") as GTextInput;
                this._langInput.text = "en";
                this.langHandler();

                this._backBtn = this._stage.getChild("backBtn") as GButton;
                this._loadBtn = this._stage.getChild("inputBtn") as GButton;
                this._sizeBtn = this._stage.getChild("sizeBtn") as GButton;
                this._sizeBtn.visible = false;
                this._langBtn = this._stage.getChild("langBtn") as GButton;

                this._list = this._stage.getChild("componentList") as GList;

                this._loadBtn.onClick(this.loadHandler, this);
                this._backBtn.onClick(this.backHandler, this);
                // this._sizeBtn.onClick(this.sizeHandler, this);
                this._langBtn.onClick(this.langHandler, this);
                this.checkViewVisible(true);
            });
        });
    }

    public i18nStr(val): string {
        return i18n.t(val);
    }

    private loadHandler() {
        this._commonModule = this._commonModuleInput.text;
        this._commonPath = this._commonPathInput.text;
        this._moduleName = this._moduleNameInput.text;
        this._path = "assets/" + this._pathInput.text;
        if (this._curPkg) this.clearModule();
        this.load.once(Phaser.Loader.Events.COMPLETE, this.loadComplete, this);
        if (this._commonModule) this.load.binary(this._commonModule, this._commonPath);
        this.load.binary(this._moduleName, this._path);
        this.load.start();
    }

    private sizeHandler() {
        
    }

    private clearModule() {
        if (this._list) {
            this._list.removeChildrenToPool();
            this._list.virtual = false
        }
        this.backHandler();
    }

    private backHandler() {
        if (this._curView) {
            this._curView.dispose();
            this._curView = null;
        }
        this.checkViewVisible(true);
    }

    private langHandler() {
        const lang = "http://172.18.0.100/game/resource/5e719a0a68196e416ecf7aad/" + this._version + "/client_resource/i18n_" + this._langInput.text + ".json";
        const jsonKey = this._version + this._langInput.text;
        if (!this.cache.json.get(jsonKey)) {
            this.load.once(Phaser.Loader.Events.COMPLETE, () => {
                initLocales(lang).then((key) => {
                    GRoot.inst.i18n = translate;
                    // this.n8.text = "PKT_FLOOR000021";
                });
            }, this);
            this.load.start();
        }
    }

    private loadComplete() {
        const fun = () => {
            this._loadComplete(this._moduleName).then((pkg) => {
                this.initList(pkg)
            });
        }
        if (this._commonModule) {
            this._loadComplete(this._commonModule).then(() => {
                fun();
            });
        } else {
            fun();
        }
    }

    private _loadComplete(name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            UIPackage.loadPackage(name).then((pkg) => {
                this._curPkg = pkg;
                console.log(pkg);
                resolve(pkg);
            });
        });
    }

    private initList(pkg) {
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
    }

    private renderListItem(index: number, item: GComponent) {
        item["showData"] = this._showList[index];
        item.getChild("title").text = item["showData"]["name"];
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
        if (this._showGroup1) this._showGroup1.visible = visible;
    }

    private loadJson(path: string, responseType: XMLHttpRequestResponseType, timeout: number = 20000) {
        return new Promise((resolve, reject) => {
            const url: IHttpLoaderConfig = { path, responseType, timeout };
            const http = new XMLHttpRequest();
            const retryTiems = 1;

            const startLoad = () => {
                http.onload = (response: ProgressEvent) => {
                    const currentTarget = response.currentTarget;
                    if (currentTarget && currentTarget["status"] === 200)
                        resolve(response.currentTarget);
                    else reject(`${url.path} load error ${currentTarget["status"]}`);
                };
                http.onerror = () => {
                    reload(`${url.path} load error!`);
                };
                http.ontimeout = (e) => {
                    reload(`${url.path} load ontimeout!!`);
                };
                http.open("GET", url.path, true);
                http.responseType = url.responseType || "";
                http.send();
            };

            const reload = (err) => {
                if (!url.loadTimes) {
                    url.loadTimes = 0;
                }
                url.loadTimes++;

                if (url.loadTimes > retryTiems) {
                    reject(err);
                    return;
                }

                startLoad();
            };
            startLoad();
        });
    }
}
