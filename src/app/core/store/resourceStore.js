class ResourceStore {

    constructor() {
        this.storage = [];
    }

    add( resource ) {
        if ( !resource ) return false;
        if ( this.storage.includes( resource ) ) return false;

        this.storage.push( resource );

        return true;
    }

    remove( resource ) {
        if ( !resource ) return false;
        
        const index = this.storage.indexOf( resource );
        if ( index >= 0 ) this.storage.splice( index, 1 );

        return true;
    }

}

const resourceStore = new ResourceStore();

export { resourceStore };