import { DisplayObjectEvent, GComponent, GList, GObject, GRoot, Handler, UIPackage } from "fairygui-phaser";
import ScrollPaneHeader from "./ScrollPaneHeader";

export class PullToRefreshScene extends Phaser.Scene {
    private _view: GComponent;
    private _list1: GList;
    private _list2: GList;
    constructor(config) {
        super(config);
    }

    preload() {
        this.load.binary("Basic", "assets/Basic.fui");
    }


    create(data) {
        // 初始化ui
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: 1, designWidth: 2000, designHeight: 2000
        });
        UIPackage.loadPackage("PullToRefresh").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============= PullToRefresh
            UIPackage.createObject("PullToRefresh", "Main").then((obj) => {
                this._view = obj.asCom;
                this._view.makeFullScreen();
                GRoot.inst.addChild(this._view);

                this._list1 = this._view.getChild("list1").asList;
                this._list1.itemRenderer = Handler.create(this, this.renderListItem1, null, false);
                //this._list1.setVirtual();
                // this._list1.numItems = 1;
                this._list1.on(DisplayObjectEvent.PULL_DOWN_RELEASE, this.onPullDownToRefresh, this);

                this._list2 = this._view.getChild("list2").asList;
                this._list2.itemRenderer = Handler.create(this, this.renderListItem2, null, false);
                // this._list2.setVirtual();
                // this._list2.numItems = 1;
               // this._list2.on(DisplayObjectEvent.PULL_UP_RELEASE, this.onPullUpToRefresh, this);
            });
        });

    }

    // =========================== pulltorefresh
    private renderListItem1(index: number, item: GObject): void {
        item.text = "Item " + (this._list1.numItems - index - 1);
    }

    private renderListItem2(index: number, item: GObject): void {
        item.text = "Item " + index;
    }

    private onPullDownToRefresh(evt: DisplayObjectEvent): void {
        var header: ScrollPaneHeader = <ScrollPaneHeader>(this._list1.scrollPane.header);
        if (header.readyToRefresh) {
            header.setRefreshStatus(2);
            this._list1.scrollPane.lockHeader(header.sourceHeight);

            //Simulate a async resquest
            setInterval(function (): void {
                if (this._view.isDisposed)
                    return;
                this._list1.numItems += 5;

                //Refresh completed
                header.setRefreshStatus(3);
                this._list1.scrollPane.lockHeader(35);

                setInterval(function (): void {
                    header.setRefreshStatus(0);
                    this._list1.scrollPane.lockHeader(0);
                }, 2000);
            }, 2000);
        }
    }

    private onPullUpToRefresh(evt: DisplayObjectEvent): void {
        var footer: GComponent = this._list2.scrollPane.footer.asCom;

        footer.getController("c1").selectedIndex = 1;
        this._list2.scrollPane.lockFooter(footer.sourceHeight);

        //Simulate a async resquest
        setInterval(function (): void {
            // if (this._view.isDisposed)
            //     return;
            this._list2.numItems += 5;

            //Refresh completed
            footer.getController("c1").selectedIndex = 0;
            this._list2.scrollPane.lockFooter(0);
        }, 2000);
    }
}
