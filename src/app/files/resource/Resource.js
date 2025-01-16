export default class Resource {

    constructor() {
        this.metadata = { version: undefined };
    }

    get isCreated() { return !!this.resourceStruct; }

    create( contentStructList ) {
        if ( !contentStructList ) return false;
        
        this.resourceStruct = this.createFromList( contentStructList );
    }

    createFromList( contentStructList ) {


        return resourceStruct;
    }

}