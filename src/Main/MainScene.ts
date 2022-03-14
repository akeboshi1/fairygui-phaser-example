import { GRoot, UIPackage, ObjectType, GList, Handler, GComponent, GButton } from "fairygui-phaser";

export class MainScene extends Phaser.Scene {
    private _showList: any[];
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("MainPanel", "assets/MainPanel.fui");
    }

    create(data) {
        const width = this.game.config.width;
        const height = this.game.config.height;
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height, designWidth: 800, designHeight: 640
        });
        UIPackage.loadPackage("MainPanel").then((pkg) => {
            console.log(pkg);
            const itemList = pkg["_items"];
            this._showList = [];
            itemList.forEach((obj) => {
                if (obj.objectType === ObjectType.Component) {
                    this._showList.push(obj);
                }
            })
            UIPackage.createObject("MainPanel", "mainPanel").then((obj) => {
                const view = obj.asCom;
                GRoot.inst.addChild(view);
                const list = view.getChild("componentList") as GList;
                list.itemRenderer = Handler.create(this, this.renderListItem, null, false);
                list.setVirtual().then(() => {
                    list.numItems = this._showList.length;
                    list.on("pointerdown", this.onClickList, this);
                });
            });
        });
    }

    private renderListItem(index: number, item: GComponent) {
        item["showData"] = this._showList[index];
        item.getChild("title").text = item["showData"]["name"];
        //item.scrollPane.posX = 0; //reset scroll pos
       
        item.getChild("selectBtn").onClick(this.onSelectClick, this);
    }

    private onClickList(pointer,gameObject) {
        console.log("onClickList");
    }

    private onSelectClick(pointer,gameObject) {
        const target = gameObject["$owner"];
        const item = target["_parent"];
        const name = item.showData.name;
        UIPackage.createObject("MainPanel", name).then((obj) => {
            const view = obj.asCom;
            GRoot.inst.addChild(view);
        });
        console.log("onSelectClick");
    }
}
