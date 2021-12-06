import { EaseType, GButton, GList, GTween, UIPackage, Window } from "fairygui-phaser";

export class TestWin extends Window {

    public constructor() {
        super();
    }

    protected onInit(): void {
        UIPackage.createObject("ModalWaiting", "TestWin").then((obj) => {
            this.contentPane = obj.asCom;
            this.contentPane.getChild("n1").onClick(this.onClickStart, this);
            this.center();
        });
    }

    private onClickStart(): void {
        //这里模拟一个要锁住当前窗口的过程，在锁定过程中，窗口仍然是可以移动和关闭的
        this.showModalWait();
        GTween.delayedCall(3).onComplete(function (): void { this.closeModalWait(); }, this);
    }
}


export class WindowA extends Window {
    public constructor() {
        super();
    }

    protected onInit(): void {
        UIPackage.createObject("Basics", "WindowA").then((obj) => {
            this.contentPane = obj.asCom;
            this.center();
        })
    }

    protected onShown(): void {
        var list: GList = this.contentPane.getChild("n6").asList;
        list.removeChildrenToPool();

        const fun = (index: number) => {
            if (index > 6) return;
            list.addItemFromPool().then((obj) => {
                var item: GButton = obj.asButton;
                item.title = "" + index;
                item.icon = UIPackage.getItemURL("Basics", "r4");
                fun(++index);
            });
        }
        fun(0);
        // for (var i: number = 0; i < 6; i++) {
        //     var item: GButton = list.addItemFromPool().asButton;
        //     item.title = "" + i;
        //     item.icon = UIPackage.getItemURL("Basics", "r4");
        // }
    }
}

export class WindowB extends Window {
    public constructor() {
        super();
    }

    protected onInit(): void {
        UIPackage.createObject("Basics", "WindowB").then((obj) => {
            this.contentPane = obj.asCom;
            this.center();
            //弹出窗口的动效已中心为轴心
            this.setPivot(0.5, 0.5);
        });
    }

    protected doShowAnimation(): void {
        this.setScale(0.1, 0.1);
        GTween.to2(0.1, 0.1, 1, 1, 0.3)
            .setTarget(this, this.setScale)
            .setEase(EaseType.QuadOut)
            .onComplete(this.onShown, this);
    }

    protected doHideAnimation(): void {
        GTween.to2(1, 1, 0.1, 0.1, 0.3)
            .setTarget(this, this.setScale)
            .setEase(EaseType.QuadOut)
            .onComplete(this.hideImmediately, this);
    }

    protected onShown(): void {
        this.contentPane.getTransition("t1").play();
    }

    protected onHide(): void {
        this.contentPane.getTransition("t1").stop();
    }
}