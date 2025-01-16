import { BaseTexture, Sprite, Texture } from "pixi.js";
import ResourceParseAbstract from "./ResourceParseAbstract";
import ResourceImage from "../common/ResourceImage";
import { ResourceType } from "../ResourceType";

export default class ResourceParseImage extends ResourceParseAbstract {


    //
    // INIT
    //

    initResourceStruct() {
        const resourceStruct = super.initResourceStruct();

        resourceStruct.type = ResourceType.IMAGE;
        resourceStruct.instance = new Sprite();
        resourceStruct.texture = Texture.EMPTY;

        return resourceStruct;
    }

    initResource( resourceStruct ) {
        this.resource = new ResourceImage( resourceStruct );
    }


    //
    // PARSE
    //

    parseProcess( resourceList ) {
        this.imageLoad();
    }


    //
    // IMAGE
    //

    imageLoad() {
        const image = new Image();

        this.imageSubscribe( image );

        image.src = this.contentStruct.result;
    }

    imageOnLoad( event ) {
        const image = event.target;
        const baseTexture = new BaseTexture( image );
        const texture = new Texture( baseTexture );

        if ( this.ready ) return;

        this.resourceStruct.texture = texture;
        this.resourceStruct.ready = true;

        Texture.addToCache( texture, this.resourceStruct.name );

        this.resource.create();

        this.imageUnsubscribe( image );
        this.dispatchResourceComplete();
    }

    imageOnError( event ) {
        this.imageUnsubscribe( event.currentTarget );
        this.dispatchResourceError( event.toString() );
    }

    // IMAGE subscribe/unsubscribe

    imageSubscribe( image ) {
        image.onload = ( event ) => { this.imageOnLoad( event ) };
        image.onerror = ( event ) => { this.imageOnError( event ) };
    }
    imageUnsubscribe( image ) {
        image.onload = undefined;
        image.onerror = undefined;
    }

}