import ResourceParseAbstract from "./ResourceParseAbstract";
import { ResourceType } from "../ResourceType";
import ResourceSpine from "../common/ResourceSpine";
import { TextureAtlas } from "pixi-spine";
import { AtlasAttachmentLoader, SkeletonJson, Spine } from "@pixi-spine/runtime-3.8";


export default class ResourceParseSpine extends ResourceParseAbstract {


    //
    // INIT
    //

    initResourceStruct() {
        const resourceStruct = super.initResourceStruct();

        resourceStruct.type = ResourceType.SPINE;
        resourceStruct.instance = undefined;
        resourceStruct.attachmentDataList = this.attachmentDataListGet( this.contentStruct.json.skins );
        resourceStruct.textureNameList = resourceStruct.attachmentDataList.map( attachment => attachment.name );

        return resourceStruct;
    }

    initResource( resourceStruct ) {
        this.resource = new ResourceSpine( resourceStruct );
    }


    //
    // PARSE
    //

    parseProcess( resourceList ) {
        this.resourceListReleventCheck( resourceList );
        this.parseCheckReady();
    }

    parseResourceReadyRemote( resource ) {
        if ( !this.resource || this.resource === resource ) return;
        this.resourceReleventCheck( resource );
        this.parseCheckReady();
    }

    parseCheckReady() {
        if ( this.ready ) return;

        if ( !this.resourceStruct.instance ) return;

        this.resourceStruct.ready = true;

        this.dispatchResourceComplete();
    }


    //
    // RESOURCE
    //

    resourceListReleventCheck( resourceList ) {
        resourceList.forEach( resource => this.resourceReleventCheck( resource ) );
    }

    resourceReleventCheck( resource ) {
        if ( !resource || !resource.ready || resource.type !== ResourceType.SPRITESHEET ) return;

        const textureNameList = this.resourceStruct.textureNameList;
        const textures = resource.textures.filter( textureData => textureNameList.includes( textureData.name ) );
        const isTexturesAll = textures.length === resource.textures.length && textureNameList.length >= textures.length;
        if ( !isTexturesAll ) return;

        const attachmentDataList = this.resourceStruct.attachmentDataList;
        this.resourceAttachmentTexturesAdd( attachmentDataList, textures );
        
        const spine = this.spineCreateFromJSON( attachmentDataList );

        this.resourceStruct.instance = spine;
        this.resource.resourceChildAdd( resource );
    }

    resourceAttachmentTexturesAdd( attachmentDataList, textures ) {
        attachmentDataList.forEach( attatchment => {
            const { name } = attatchment;
            const textureData = textures.find( textureData => textureData.name === name );
            attatchment.texture = textureData.texture;
        } );
    }



    //
    // SPINE
    //

    spineCreateFromJSON( attachmentDataList ) {
        const attachmentData = this.attachmentDataGet( attachmentDataList );

        const spineAtlas = new TextureAtlas();
        spineAtlas.addTextureHash( attachmentData, false );

        const spineAtlasLoader = new AtlasAttachmentLoader( spineAtlas );
        const spineJsonParser = new SkeletonJson( spineAtlasLoader );
        const spineData = spineJsonParser.readSkeletonData( this.contentStruct.json );

        return new Spine( spineData );
    }

    attachmentDataGet( textures ) {
        const object = {};
        textures.forEach( attachment => { 
            object[ attachment.name ] = attachment.texture;
        } );
        return object;
    }

    attachmentDataListGet( skins ) {
        if ( !skins || !skins.length ) return;

        const list = [];

        for ( let i = 0; i < skins.length; i++ ) {
            const skin = skins[ i ];
            // const attachment = this.skinsAttachmentParse( skin.attachments );

            for ( const attachmentsName in skin.attachments ) {
                const attachmentsData = skin.attachments[ attachmentsName ];
                for ( const attachmentName in attachmentsData ) {
                    if ( list.some( attachment => attachment.name === attachmentName ) ) continue;

                    const attachmentData = attachmentsData[ attachmentName ];
                    const texture = undefined;
                    
                    list.push( { name: attachmentName, attachment: attachmentData, texture } );
                }
            }
        }

        return list;
    }

}
