import Event from "../../../event/Event.js";

export default class ContentDropEvent extends Event {
    constructor( type, contentStruct = undefined ) {
        super( type );
        this.contentStruct = contentStruct;
    }
}

ContentDropEvent.DRAGENTER = "contentDropDragEnter";
ContentDropEvent.DRAGOVER = "contentDropDragOver";
ContentDropEvent.DRAGLEAVE = "contentDropDragLeave";
ContentDropEvent.DRAGNDROP = "contentDropDragNDrop";
ContentDropEvent.ON_LOAD = "contentDropOnLoad";
ContentDropEvent.ON_LOAD_ALL_START = "contentOnLoadAllStart";
ContentDropEvent.ON_LOAD_ALL_COMPLETE = "contentOnLoadAllComplete";