import { Container, Text, Application, Graphics, Point } from "pixi.js";
import { ResourceType } from "../ResourceType";
import EventDispathcer from "../../../event/EventDispatcher";
import ResourceEvent from "../ResourceEvent";
import Resource from "../common/Resource";

export default class ResourceParseAbstract extends EventDispathcer {

    constructor( contentStruct ) {
        super();

        this.contentStruct = contentStruct;

        this.resource = undefined;
    }


    //
    // READY
    //

    get ready() { return this.resource && this.resourceStruct.ready; }


    //
    // RESOURCE
    //

    init() {
        this.resourceStruct = this.initResourceStruct();
        this.initResource( this.resourceStruct );
    }

    initResourceStruct() {
        return {
            ready: false,
            name: this.contentStruct.name,
            type: ResourceType.UNKNOWN,
            contentType: this.contentStruct.type,
            contentStruct: this.contentStruct,
            textures: undefined,
            used: false
        }
    }

    initResource( resourceStruct ) {
        this.resource = new Resource( resourceStruct );
    }


    //
    // PARSE
    //

    parse( resourceList ) {
        this.dispatchResourceStart();
        this.parseProcess( resourceList );
    }

    parseProcess( resourceList ) {
        this.dispatchResourceComplete();
    }

    parseResourceReadyRemote( resource ) {
        return this.resource && this.resourceStruct;
    }


    //
    // DISPATCH
    //

    dispatchResourceStart() {
        this.dispatchEvent( new ResourceEvent( ResourceEvent.START, this.resource ) );
    }

    dispatchResourceComplete() {
        console.log( `${ this.constructor.name }: COMPLETE: ${ this.resourceStruct }` );
        this.dispatchEvent( new ResourceEvent( ResourceEvent.COMPLETE, this.resource ) );
    }

    dispatchResourceError( textData ) {
        console.warn( `${ this.constructor.name }: ERROR: ${ textData }` );
        this.dispatchEvent( new ResourceEvent( ResourceEvent.ERROR, this.resource ) );
    }


    //
    //
    //

    destroy() {
        this.contentStruct = undefined;
        this.resourceStruct = undefined;
        this.resource = undefined;
    }



}