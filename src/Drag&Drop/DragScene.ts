import { DragDropManager, GButton, GComponent, GObject, GRoot, UIPackage } from "fairygui-phaser";

export class DragScene extends Phaser.Scene {
    private _view: GComponent;
    private _btnB: GButton;
    private _btnC: GButton;
    private _btnD: GButton;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Basics", "assets/Basics.fui");
    }

    create(data) {
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, designWidth: 800, designHeight: 640
        });
        UIPackage.loadPackage("Basics").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============ tooqing ui test
            UIPackage.createObject("Basics", "Demo_Drag&Drop").then((obj) => {
                this._view = obj.asCom;
                GRoot.inst.addChild(this._view);

                var btnA: GButton = this._view.getChild("a").asButton;
                const iconA = btnA.getChild("icon");
                iconA.displayObject.removeInteractive();
                const titleA = btnA.getChild("title");
                titleA.displayObject.removeInteractive();
                this.input.setDraggable(btnA.displayObject);

                this._btnB = this._view.getChild("b").asButton;
                const icon = this._btnB.getChild("icon");
                this.input.setDraggable(icon.displayObject);


                this._btnC = this._view.getChild("c").asButton;
                this._btnC.displayObject.input.dropZone = true;
                this._btnC.icon = null;

                this.input.on("dragstart", this.__onDragStart, this);
                this.input.on("drag", this.__onDrag, this);
                this.input.on("drop", this.__onDrop, this);

                this._btnD = this._view.getChild("d").asButton;
                const iconD = this._btnD.getChild("icon");
                iconD.displayObject.removeInteractive();
                const titleD = this._btnD.getChild("title");
                titleD.displayObject.removeInteractive();
                this.input.setDraggable(this._btnD.displayObject);
                var bounds: GObject = this._view.getChild("bounds");
                const world = (<Phaser.GameObjects.Container>bounds.displayObject).getWorldTransformMatrix();
                var rect: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(world.tx, world.ty, bounds._width, bounds._height);
                // rect = GRoot.inst.globalToLocalRect(rect.x, rect.y, rect.width, rect.height, rect);

                this._btnD.dragBounds = rect;
                this._btnD.draggable = true;
            });
        });

    }

    private __onDragStart(pointer: Phaser.Input.Pointer, gameObject: any): void {
        const parent = gameObject.parentContainer.parentContainer;
        Phaser.Utils.Array.BringToTop(parent.list, gameObject.parentContainer);
    }

    private __onDrag(pointer, gameObject, dragX, dragY) {
        const obj = gameObject["$owner"];
        if (obj === this._btnD) return;
        gameObject.x = dragX;
        gameObject.y = dragY;

    }

    private __onDrop(pointer: Phaser.Input.Pointer, gameObject: any): void {
        const obj = gameObject.parentContainer["$owner"];
        var btn: GButton = obj;
        this._btnC.icon = btn.icon;
        btn.icon = null;
    }

}