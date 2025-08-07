import { BaseTexture, Texture, Sprite } from "pixi.js";
import ResourceImage from "./ResourceImage";

export default class ResourceSpritesheet extends ResourceImage {
    

    //
    // TEXTURE
    //

    get texture() { return this.textures[ 0 ]?.texture; }

    get textures() { return this.resourceStruct.textures || [ { texture: Texture.EMPTY } ]; }

    get textureIndex() { return this.resourceStruct.textureIndex || 0; }

}