import { BaseTexture, Texture, Sprite } from "pixi.js";
import ResourceImage from "./ResourceImage";

export default class ResourceSpritesheet extends ResourceImage {
    

    //
    // TEXTURE
    //

    get texture() { return this.textures[ 0 ]; }

    get textures() { return this.resourceStruct.textures || [ Texture.EMPTY ]; }

    get textureIndex() { return this.resourceStruct.textureIndex || 0; }

}