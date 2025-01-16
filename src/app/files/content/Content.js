import { dispatcher } from "../../core/dispatcher/dispatcher";
import { contentStore } from "../../core/store/contentStore";
import ContentEvent from "./ContentEvent";
import ContentDropEvent from "./drop/ContentDropEvent";
import ContentDropGrabber from "./drop/ContentDropGrabber";

export default class Content {

    constructor() {
        ContentDropGrabber.init();
        ContentDropGrabber.instance.addEventListener( ContentDropEvent.ON_LOAD, this.onContentLoad.bind( this ) );
    }

    onContentLoad( event ) {
        const { contentStruct } = event;

        if ( !contentStruct ) return;

        const isContentAdd = contentStore.add( contentStruct );
        if ( isContentAdd ) {
            console.log( "Content: Load:", `${contentStruct.name}.${contentStruct.type}` );
            dispatcher.dispatchEvent( new ContentEvent( ContentEvent.LOAD, contentStruct ) );
        }
    }

}