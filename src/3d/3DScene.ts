export class ThreeDScene extends Phaser.Scene {
    private graphics;
    private s;
    private r;
    private colors;
    private go = false;
    private temp = { t: 0 };
    private logos;
    private thickness;
    private alpha;
    constructor(config) {
        super(config);
    }

    create() {
        this.graphics = this.add.graphics();

        const hsv = Phaser.Display.Color.HSVColorWheel();

        this.colors = [];

        // Color = Color * alpha + Background * (1 - alpha);
        for (var i = 0; i < hsv.length; i += 4) {
            const color = hsv[i]["color"];
            this.colors.push(color);
        }

        this.r = 0;
        this.s = [];
        this.logos = 13;
        this.thickness = 10;
        this.alpha = 1;

        for (var i = 0; i < this.logos; i++) {
            this.s.push(0);
        }

        this.tweens.add({
            targets: this.graphics,
            duration: 500,
            props: { r: 0 },
            repeat: -1,
            onRepeat: () => {
                Phaser.Utils.Array.RotateRight(this.colors);
            }
        });

    }

    update() {
        this.graphics.clear();

        this.r += 0.01;

        var scale = 0.9 - (this.logos * 0.01);

        for (var i = 0; i < this.logos; i++) {
            //  3D slant :)
            // drawLogo(colors[i], -380 + (i * 2), -100 + (i * 2), scale, s[i]);

            // drawLogo(colors[i], -380, -100, scale, s[i]);

            // drawLogo(colors[i], -380, -100 + ((i * 2) * Math.sin(r * 2)), scale, s[i]);

            this.drawLogo(this.colors[i], -380 + ((i * 2) * Math.sin(this.r * 2)), -100 + ((i * 2) * Math.cos(this.r * 2)), scale, this.s[i]);

            if (this.go) {
                this.s[i] = Math.sin(this.r / 2);
            }

            // s[i] = Math.sin(r * i) / 16;

            // s[i] = Math.sin(i) * r / 8;

            // s[i] = r + (i * 0.01);

            // s[i] += (Math.sin(r) * Math.sin(i)) / 128;
            // s[i] += (Math.sin(13 - i) / 1024);
            // s[i] += (0.002 * (0.25 * (i + 1) + 0.75 * (13 - i)));

            scale += 0.01;
        }
    }

    drawLogo(color, x, y, scale, rot) {
        // var thickness = 10;
        // var alpha = 1;

        this.graphics.lineStyle(this.thickness, color, this.alpha);

        var w = 100;
        var h = 200;
        var h2 = 100;
        var top = y + 0;
        var mid = y + 100;
        var bot = y + 200;
        var s = 30;

        this.graphics.save();
        this.graphics.translateCanvas(400, 300);
        this.graphics.scaleCanvas(scale, scale);
        this.graphics.rotateCanvas(rot);

        this.graphics.beginPath();

        //  P

        this.graphics.moveTo(x, top);
        this.graphics.lineTo(x + w, top);
        this.graphics.lineTo(x + w, mid);
        this.graphics.lineTo(x, mid);
        this.graphics.lineTo(x, bot);

        //  H

        x += w + s;

        this.graphics.moveTo(x, top);
        this.graphics.lineTo(x, bot);
        this.graphics.moveTo(x, mid);
        this.graphics.lineTo(x + w, mid);
        this.graphics.moveTo(x + w, top);
        this.graphics.lineTo(x + w, bot);

        //  A

        x += w + s;

        this.graphics.moveTo(x, bot);
        this.graphics.lineTo(x + (w * 0.75), top);
        this.graphics.lineTo(x + (w * 0.75) + (w * 0.75), bot);

        //  S

        x += ((w * 0.75) * 2) + s;

        this.graphics.moveTo(x + w, top);
        this.graphics.lineTo(x, top);
        this.graphics.lineTo(x, mid);
        this.graphics.lineTo(x + w, mid);
        this.graphics.lineTo(x + w, bot);
        this.graphics.lineTo(x, bot);

        //  E

        x += w + s;

        this.graphics.moveTo(x + w, top);
        this.graphics.lineTo(x, top);
        this.graphics.lineTo(x, bot);
        this.graphics.lineTo(x + w, bot);
        this.graphics.moveTo(x, mid);
        this.graphics.lineTo(x + w, mid);

        //  R

        x += w + s;

        this.graphics.moveTo(x, top);
        this.graphics.lineTo(x + w, top);
        this.graphics.lineTo(x + w, mid);
        this.graphics.lineTo(x, mid);
        this.graphics.lineTo(x, bot);
        this.graphics.moveTo(x, mid);
        this.graphics.lineTo(x + w, bot);

        this.graphics.strokePath();

        this.graphics.restore();
    }

    colorHex(rgbStr: string) {
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是rgb颜色表示
        if (/^(rgb|RGB)/.test(rgbStr)) {
            var aColor = rgbStr.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                if (hex.length < 2) {
                    hex = '0' + hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = rgbStr;
            }
            return strHex;
        } else if (reg.test(rgbStr)) {
            var aNum = rgbStr.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return rgbStr;
            } else if (aNum.length === 3) {
                var numHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        }
        return rgbStr;
    }
}