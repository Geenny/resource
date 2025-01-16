import Event from "../../event/Event.js";

export default class ResourceEvent extends Event {
    constructor( type, resource ) {
        super( type );
        this.resource = resource;
    }
}

ResourceEvent.COMPLETE_PARSE_ALL = "resourceEventCompleteParseAll";
ResourceEvent.ERROR_PARSE_ALL = "resourceEventErrorParseAll";
ResourceEvent.START = "resourceEventStart";
ResourceEvent.COMPLETE = "resourceEventComplete";
ResourceEvent.ERROR = "resourceEventError";