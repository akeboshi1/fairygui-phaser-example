import { BaseScene } from "../Base/BaseScene";

export class TextScene extends BaseScene {
    constructor() {
        super({ key: TextScene.name });

        this.pkgName = "Basics";
        this.resName = "Demo_Text";
    }
}