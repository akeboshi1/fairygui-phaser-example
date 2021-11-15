import { GComponent, GObject, GRoot, GTree, GTreeNode, Handler, UIPackage } from "fairygui-phaser";

export class TreeNodeScene extends Phaser.Scene {
    private _view: GComponent;

    private _tree1: GTree;
    private _tree2: GTree;
    private _fileURL: string;

    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("TreeView", "assets/TreeView.fui");
    }

    create(data) {
        const width = 2000;
        const height = 2000;
        const con = this.add.container(0, 0);
        con.setSize(width, height);
        con.setInteractive();
        // 初始化ui,为了不影响外部ui的逻辑，直接将container传入ui库中，不影响
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, width, height,
            container: con
        });
        UIPackage.loadPackage("TreeView").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);
            // ============ TreeNode
            UIPackage.createObject("TreeView", "Main").then((obj) => {
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);

                this._fileURL = "ui://TreeView/file";

                this._tree1 = this._view.getChild("tree").asTree;
                this._tree1.on("pointerdown", this.__clickNode, this);
                this._tree2 = this._view.getChild("tree2").asTree;
                this._tree2.on("pointerdown", this.__clickNode, this);
                this._tree2.treeNodeRender = Handler.create(this, this.renderTreeNode, null, false);

                var topNode: GTreeNode = new GTreeNode(true);
                topNode.data = "I'm a top node";
                this._tree2.rootNode.addChild(topNode);
                for (var i: number = 0; i < 5; i++) {
                    var node: GTreeNode = new GTreeNode(false);
                    node.data = "Hello " + i;
                    topNode.addChild(node);
                }

                var aFolderNode: GTreeNode = new GTreeNode(true);
                aFolderNode.data = "A folder node";
                topNode.addChild(aFolderNode);
                for (var i: number = 0; i < 5; i++) {
                    var node: GTreeNode = new GTreeNode(false);
                    node.data = "Good " + i;
                    aFolderNode.addChild(node);
                }

                for (var i: number = 0; i < 3; i++) {
                    var node: GTreeNode = new GTreeNode(false);
                    node.data = "World " + i;
                    topNode.addChild(node);
                }

                var anotherTopNode: GTreeNode = new GTreeNode(false);
                anotherTopNode.data = ["I'm a top node too", "ui://TreeView/heart"];
                this._tree2.rootNode.addChild(anotherTopNode);
            });
        });

    }

    private renderTreeNode(node: GTreeNode, obj: GComponent) {
        if (node.isFolder) {
            obj.text = node.data;
        }
        else if (node.data instanceof Array) {
            obj.icon = (<any>node.data)[1];
            obj.text = (<any>node.data)[0];
        }
        else {
            obj.icon = this._fileURL;
            obj.text = node.data;
        }
    }

    private __clickNode(pointer: Phaser.Input.Pointer, itemObject: GObject) {
        if (!itemObject) return;
        var node: GTreeNode = itemObject["$owner"].treeNode;
        console.log(node.text);
    }
}