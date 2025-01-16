class ContentStore {

    constructor() {
        this.storage = [];
    }

    add( contentStruct ) {
        if ( !contentStruct ) return false;
        if ( this.storage.includes( contentStruct ) ) return false;

        this.storage.push( contentStruct );

        return true;
    }

    remove( contentStruct ) {
        if ( !contentStruct ) return false;
        
        const index = this.storage.indexOf( contentStruct );
        if ( index >= 0 ) this.storage.splice( index, 1 );

        return true;
    }

}

const contentStore = new ContentStore();

export { contentStore };