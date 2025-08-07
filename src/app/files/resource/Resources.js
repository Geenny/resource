import { dispatcher } from "../../core/dispatcher/dispatcher";
import { resourceStore } from "../../core/store/resourceStore";
import ContentDropEvent from "../content/drop/ContentDropEvent";
import ContentDropGrabber from "../content/drop/ContentDropGrabber";
import ResourcesParse from "./parse/ResourceParse";
import ResourceEvent from "./ResourceEvent";

export default class Resources {

    constructor() {
        ContentDropGrabber.instance.addEventListener( ContentDropEvent.ON_LOAD_ALL_START, this.onContentAllStart.bind( this ) );
        ContentDropGrabber.instance.addEventListener( ContentDropEvent.ON_LOAD_ALL_COMPLETE, this.onContentAllComplete.bind( this ) );

        this.resourceSubscribe();
    }


    //
    // HANDLE GRABBER
    //

    onContentAllStart( event ) {
        
    }
    onContentAllComplete( event ) {
        const contentStructList = event && event.contentStruct;

        if ( !contentStructList ) return;
        if ( !Array.isArray( contentStructList ) ) return;

        ResourcesParse.parse( contentStructList );
    }


    //
    // SUBSCRIBE
    //

    resourceSubscribe() {
        if ( this._resource_subscribe ) return;

        this._resource_subscribe = {
            onComplete: this.onResourceAllComplete.bind( this ),
            onError: this.onResourceAllError.bind( this )
        };

        dispatcher.addEventListener( ResourceEvent.COMPLETE_PARSE_ALL, this._resource_subscribe.onComplete );
        dispatcher.addEventListener( ResourceEvent.ERROR_PARSE_ALL, this._resource_subscribe.onError );
    }
    resourceUnsubscribe() {
        if ( !this._resource_subscribe ) return;

        dispatcher.removeEventListener( ResourceEvent.COMPLETE_PARSE_ALL, this._resource_subscribe.onComplete );
        dispatcher.removeEventListener( ResourceEvent.ERROR_PARSE_ALL, this._resource_subscribe.onError );

        this._resource_subscribe = undefined;
    }

    onResourceAllComplete( event ) {
        const { resource: resourceList } = event;

        resourceList && resourceList.length > 0 && resourceList.forEach( resource => resourceStore.add( resource ) );
    }
    onResourceAllError( event ) {
        console.warn("Resources: Not loaded resources!");
    }

}