import Event from "../../event/Event.js";

export default class ContentEvent extends Event {
    constructor( type, contentStruct ) {
        super( type );
        this.contentStruct = contentStruct;
    }
}

ContentEvent.LOAD = "contentEventLoad";
ContentEvent.ERROR = "contentEventError";