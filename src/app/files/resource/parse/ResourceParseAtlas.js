import { Point, Sprite, Texture, Rectangle } from "pixi.js";
import ResourceParseAbstract from "./ResourceParseAbstract";
import { ResourceType } from "../ResourceType";
import ResourceSpritesheet from "../common/ResourceSpritesheet";

export default class ResourceParseAtlas extends ResourceParseAbstract {


    //
    // INIT
    //

    initResourceStruct() {
        const resourceStruct = super.initResourceStruct();

        resourceStruct.type = ResourceType.SPRITESHEET;
        resourceStruct.instance = new Sprite();
        resourceStruct.textures = [];
        resourceStruct.textureIndex = 0;

        return resourceStruct;
    }

    initResource( resourceStruct ) {
        this.resource = new ResourceSpritesheet( resourceStruct );
    }


    //
    // PARSE
    //

    parseProcess( resourceList ) {
        this.atlasStructList = this._atlasStructListGet( this.contentStruct );
        this.resourceListCutCheck( resourceList );
        this.parseCheckReady();
    }

    parseResourceReadyRemote( resource ) {
        if ( !this.resource || this.resource === resource ) return;
        this.resourceCutCheck( resource );
        this.parseCheckReady();
    }

    parseCheckReady() {
        const isReady = this.atlasStructList && this.atlasStructList.every( atlasStruct => atlasStruct.ready );
        if ( !isReady ) return;

        this.resourceStruct.ready = true;

        this.dispatchResourceComplete();
    }



    //
    // RESOURCE
    //

    resourceListCutCheck( resourceList ) {
        resourceList.forEach( resource => this.resourceCutCheck( resource ) );
    }

    resourceCutCheck( resource ) {
        if ( !resource || !resource.ready || resource.type !== ResourceType.IMAGE ) return;

        const atlasStruct = this.atlasStructList.find( atlasStruct => atlasStruct.name === resource.fileName );
        if ( !atlasStruct ) return;

        this.resourceTexturesCreateByResource( atlasStruct.textureStructList, resource );

        atlasStruct.ready = true;

        this.resource.resourceChildAdd( resource );
    }

    resourceTexturesCreateByResource( textureStructList, resource ) {
        const baseTexture = resource.texture.baseTexture;

        textureStructList.forEach( textureStruct => {
            const name = textureStruct.name;
            const width = textureStruct.rotate ? textureStruct.size.y : textureStruct.size.x;
            const height = textureStruct.rotate ? textureStruct.size.x : textureStruct.size.y;
            const frame = new Rectangle( textureStruct.xy.x, textureStruct.xy.y, width, height );
            const rotate = textureStruct.rotate ? 2 : 0;

            const texture = new Texture( baseTexture, frame, undefined, undefined, rotate );

            this.resourceStruct.textures.push( { name, texture } );
        } );
    }


    //
    // ATLAS
    // 

    _atlasStructListGet( contentStruct ) {
        const atlasStructList = [];

        const LINE_NEW = "\n";
        const PROP_DIVIDER = ": ";
        const REGION_PROP_PREFIX = "  ";

        let positionLine = 0;
        let positionLineLast = 0;
        let atlas = undefined;
        let texture = undefined;
        let line = undefined;
        let aa = 0;

        while ( true ) {
            positionLine = contentStruct.result.indexOf( LINE_NEW, positionLine );
            line = contentStruct.result.substring( positionLineLast, positionLine );
            if ( positionLine === -1 ) {
                if ( atlas ) {
                    if ( texture ) atlas.textureStructList.push( texture );
                    atlasStructList.push( atlas );
                }
                break;
            }

            if ( aa > 10000) {
                debugger;
                break;
            }

            if ( line === undefined ) {
                debugger;
            } else if ( line === "" ) {
                if ( atlas !== undefined ) {
                    if ( texture ) atlas.textureStructList.push( texture );
                    atlasStructList.push( atlas );
                }
                atlas = undefined;
                texture = undefined;
            } else if ( !atlas ) {
                atlas = { ...AtlasStruct, name: line, textureStructList: [] };

            // Atlas property
            } else if ( line.indexOf( REGION_PROP_PREFIX ) === -1 && line.indexOf( PROP_DIVIDER ) > 0 ) {
                const property = this._atlasPropertyGet( line );
                if ( property === undefined ) debugger;
                atlas[ property.name ] = property.value;

            // Texture name
            } else if ( line.indexOf( REGION_PROP_PREFIX ) === -1 && line.indexOf( PROP_DIVIDER ) === -1 ) {
                if ( texture ) {
                    atlas.textureStructList.push( texture );
                }
                texture = { ... TextureStruct, name: line };

            // texture property
            } else if ( line.indexOf( REGION_PROP_PREFIX ) >= 0 && line.indexOf( PROP_DIVIDER ) > 0 ) {
                const property = this._atlasPropertyGet( line );
                if ( property === undefined ) debugger;
                texture[ property.name ] = property.value;
            }

            positionLine += 1;
            positionLineLast = positionLine;
            aa += 1;
        }

        return atlasStructList;
    }

    _atlasPropertyGet( line ) {
        const PROP_DIVIDER = ": ";
        const REGION_PROP_PREFIX = "  ";
        const COMA = ",";
        const nameStart = line.indexOf( REGION_PROP_PREFIX, 0 );
        const valueStart = line.indexOf( PROP_DIVIDER, 0 );
        if ( valueStart === -1 ) {
            debugger
        }

        const name = line.substring( nameStart === 0 ? 2 : 0, valueStart );
        const result = line.substring( valueStart + PROP_DIVIDER.length, line.length );
        const pointIndex = result.indexOf( COMA );
        const results = result.split( COMA );
        let value = undefined;

        if ( pointIndex > 0 && !isNaN( parseInt( results[0] ) ) ) {
            value = new Point( parseInt( results[ 0 ] ), parseInt( results[ 1 ] ) );
        } else if ( pointIndex > 0 ) {
            value = result;
        } else if ( result.indexOf( "true" ) >= 0 || result.indexOf( "false" ) >= 0 ) {
            value = result.indexOf( "true" ) >= 0;
        } else if ( !isNaN( parseInt( result ) ) ) {
            value = parseInt( result );
        } else {
            value = result;
        }

        return value !== undefined ? { name, value } : undefined;
    }

}

const SpineAtlasStruct = {
    name: undefined,
    sourceNameList: [],
    atlasStructList: []
}

const AtlasStruct = {
    ready: false,
    name: undefined,
    size: undefined,            // size: 2048,2048
    format: undefined,          // format: RGBA8888
    filter: "Linear,Linear",    // filter: Linear,Linear
    repeat: "none",             // repeat: none
    textureStructList: []
}

const TextureStruct = {
    name: undefined,
    rotate: false,              // rotate
    xy: undefined,              // xy: 2, 144
    size: undefined,            // size: 1149, 171
    orig: undefined,            // orig: 1183, 228
    offset: undefined,          // offset: 0, 14
    index: -1                   // index: -1
};