import { GMovieClip, GRoot, UIPackage } from "fairygui-phaser";

export class ImageScene extends Phaser.Scene {
    constructor(config) {
        super(config);
    }

    init() {
        this.createFont();
    }

    private createFont() {
        const element = document.createElement("style");
        document.head.appendChild(element);
        const sheet: CSSStyleSheet = <CSSStyleSheet>element.sheet;
        // const styles = "@font-face { font-family: 'Source Han Sans'; src: this.render.url('./resources/fonts/otf/SourceHanSansTC-Regular.otf') format('opentype');font-display:swap; }\n";
        const styles2 = "@font-face { font-family: 'testFont'; src: url('assets/webfont/04B.ttf') format('truetype');font-display:swap }";
        const styles3 = "@font-face { font-family: 'tt0173m_'; src: url('assets/webfont/tt0173m_.ttf') format('truetype');font-display:swap }";
        sheet.insertRule(styles2, sheet.cssRules.length);
        sheet.insertRule(styles3, sheet.cssRules.length);
    }

    preload() {
        // this.load.script("webfont", "assets/webfont/webfont.js");
        this.load.binary("Package1", "assets/Package1.fui");
    }

    create(data) {
        const width = this.game.config.width;
        const height = this.game.config.height;
        // const con = this.add.container(0, 0);
        // con.setSize(width, height);
        // con.setInteractive();
        // try {
        //     WebFont.load({
        //         custom: {
        //             // families: ["Source Han Sans", "tt0173m_", "tt0503m_"]
        //             families: ["testFont", "tt0173m_"]
        //         },
        //         // google: {
        //         //     families: [ 'Freckle Face', 'Finger Paint', 'Nosifer' ]
        //         // },
        //         active: () => {
        //             const text = this.add.text(32, 32, '123', { fontFamily: 'testFont', fontSize: "80px", color: '#ff0000' }).setShadow(2, 2, "#333333", 2, false, true);
        //             // text.setFontFamily("tt0173m_");
        //             text.setText("abc456");
        //             //  this.add.text(150, 350, '45%', { fontFamily: 'SketchStyleNumber', fontSize: 64, color: '#5656ee' });
        //         }
        //     });
        // } catch (error) {
        //     console.warn("webfont failed to load");
        // }

        // // 初始化ui,为了不影响外部ui的逻辑，直接将container传入ui库中，不影响
        GRoot.inst.attachTo(this, {
            osd: "", res: "assets/",
            resUI: "assets/", dpr: Math.round(window.devicePixelRatio)
            , width, height, desginWidth: 800, desginHeight: 600
        });
        UIPackage.loadPackage("Package1").then((pkg) => {
            // tslint:disable-next-line:no-console
            console.log("fui ===>", pkg);

            // ============ image
            UIPackage.createObject("Package1", "Main").then((obj) => {
                const view = obj.asCom;
                // view.makeFullScreen();
                const mc = view.getChild("n7") as GMovieClip;
                // mc.playing = false;
                // view.setXY(Number(this.game.config.width) - mc.width * 2, 0);
                // mc.setScale(1 / GRoot.contentDprLevel, 1 / GRoot.contentDprLevel);
                GRoot.inst.addChild(view);
            });
        });

    }
}