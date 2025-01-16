import { dispatcher } from "../../../core/dispatcher/dispatcher";
import { FileType } from "../../file/FileType";
import ResourceEvent from "../ResourceEvent";
import { ResourceGuardsList } from "../ResourceGuardsList";

export default class ResourcesParse {

    static get instance() {
        if ( !ResourcesParse._instance ) ResourcesParse._instance = new ResourcesParse();
        return ResourcesParse._instance;
    }

    static parse( contentStructList = [] ) {
        return ResourcesParse.instance.parse( contentStructList );
    }



    constructor() {
        this.parserStructList = undefined;
    }



    //
    // CONTENT PARSE
    //

    parse( contentStructList ) {
        if ( this.parserStructList ) return;

        this.parserStructList = [];

        const resourceList = this.contentParse( contentStructList );

        return resourceList;
    }

    contentParse( contentStructList ) {
        for ( let i = 0; i < contentStructList.length; i++ ) {
            const contentStruct = contentStructList[ i ];
            const resourceGuard = ResourceGuardsList.find( condition => condition.guard( contentStruct ) );
            if ( !resourceGuard ) {
                console.warn( `For: ${ contentStruct.name }, type: ${ contentStruct.type } not find ANY GUARD!!!` );
                continue;
            }
            
            const ResourceParseClass = resourceGuard.parseClass;
            const parser = new ResourceParseClass( contentStruct );
            parser.init();

            const events = this.parserSubscribe( parser );
            this.parserStructList.push( { parser, events, resource: parser.resource } );
        }

        const resourceUncreateList = this.parserStructList.map( parserStruct => parserStruct.resource );
        this.parserStructList.forEach( parserStruct => parserStruct.parser.parse( resourceUncreateList ) );
    }

    parseReadyAll( resourcelist ) {
        dispatcher.dispatchEvent( new ResourceEvent( ResourceEvent.COMPLETE_PARSE_ALL, resourcelist ) );
    }

    parseDestroyAll() {
        if ( !this.parserStructList ) return;

        while ( this.parserStructList.length > 0 ) {
            const parserStruct = this.parserStructList.shift();
            const { parser } = parserStruct;
            parser.destroy();
        }

        this.parserStructList = undefined;
    }


    //
    // SUBSCRIBE
    //

    parserSubscribe( parser ) {
        const events = {
            onComplete: this.onResourceComplete.bind( this ),
            onError: this.onResourceError.bind( this )
        }

        parser.addEventListener( ResourceEvent.COMPLETE, events.onComplete );
        parser.addEventListener( ResourceEvent.ERROR, events.onError );

        return events;
    }
    parserUnsubscribe( parserStruct ) {
        const { parser, events } = parserStruct;

        parser.removeEventListener( ResourceEvent.COMPLETE, events.onComplete );
        parser.removeEventListener( ResourceEvent.ERROR, events.onError );
    }


    //
    // HANDLERS
    //

    onResourceComplete( event ) {
        const { target, resource } = event;
        const parserStructIndex = this.parserStructList.findIndex( parserStruct => parserStruct.parser === target );
        const parserStruct = this.parserStructList[ parserStructIndex ];

        this.parserUnsubscribe( parserStruct );

        // Call parsers about ready resource
        const parserStructUnreadyList = this.parserStructList.filter( parserStruct => !parserStruct.parser.ready );
        parserStructUnreadyList.forEach( parserStruct => parserStruct.parser.parseResourceReadyRemote( resource ) );

        if ( parserStructUnreadyList.length > 0 ) return;

        // Dispatch about all resources ready
        const resourceList = this.parserStructList.map( parserStruct => parserStruct.resource );
        this.parseReadyAll( resourceList );

        // Destroy parsers
        this.parseDestroyAll();
    }
    onResourceError( event ) {
        const { currentTarget } = event;
        const parser = this.parserStructList.find( parserStruct => parserStruct.resource === currentTarget );
    }
}