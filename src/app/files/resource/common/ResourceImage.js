import { BaseTexture, Texture, Sprite } from "pixi.js";
import Resource from "./Resource";

export default class ResourceImage extends Resource {


    //
    // UPDATE
    //

    update() {
        if ( !this.view ) return;

        this.view.texture = this.texture;
    }


    //
    // TEXTURE
    //

    get texture() { return this.resourceStruct.texture || Texture.EMPTY; }

}