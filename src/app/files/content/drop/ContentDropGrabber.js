import EventDispathcer from "../../../event/EventDispatcher.js";
import ContentDropEvent from "./ContentDropEvent.js";
import ContentStruct from "../ContentStruct.js";
import { FileType, typeFromFileNameGet, nameFromFileNameGet } from "../../file/FileType.js";

const DRAGENTER = "dragenter";
const DRAGOVER = "dragover";
const DRAGLEAVE = "dragleave";
const DRAGNDROP = "drop";

export default class ContentDropGrabber extends EventDispathcer {

    static init( htmlElement ) {
        const target = htmlElement || document.body;
        return ContentDropGrabber.instance.init( target );
    }

    static get instance() {
        if ( !ContentDropGrabber._instance ) ContentDropGrabber._instance = new ContentDropGrabber();
        return ContentDropGrabber._instance;
    }

    constructor() {
        super();

        this._contentStructList = [];
        
        this.onDragEnter = this.onDragEnter.bind( this );
        this.onDragOver = this.onDragOver.bind( this );
        this.onDragLeave = this.onDragLeave.bind( this );
        this.onDragNDrop = this.onDragNDrop.bind( this );
        this._onFileLoad = this._onFileLoad.bind( this );
    }

    init( htmlElement ) {
        if ( !( htmlElement instanceof HTMLElement ) ) return;

        this.htmlElement = htmlElement;

        this.htmlElement.addEventListener( DRAGENTER, this.onDragEnter );
        this.htmlElement.addEventListener( DRAGOVER, this.onDragOver );
        this.htmlElement.addEventListener( DRAGLEAVE, this.onDragLeave );
        this.htmlElement.addEventListener( DRAGNDROP, this.onDragNDrop );

        return this;
    }


    //
    // SUBSCRIBE
    //

    preventDefault( event ) {
        event.preventDefault();
        event.stopPropagation();
    }
    onDragEnter( event ) {
        this.preventDefault( event );
        this.dispatchEvent( new ContentDropEvent( ContentDropEvent.DRAGENTER, event.target ) );
    }
    onDragOver( event ) {
        this.preventDefault( event );
        this.dispatchEvent( new ContentDropEvent( ContentDropEvent.DRAGOVER, event.target ) );
    }
    onDragLeave( event ) {
        this.preventDefault( event );
        this.dispatchEvent( new ContentDropEvent( ContentDropEvent.DRAGLEAVE, event.target ) );
    }
    onDragNDrop( event ) {
        this.preventDefault( event );
        this.parseEventTransferData( event );
        this.dispatchEvent( new ContentDropEvent( ContentDropEvent.DRAGNDROP, event.target ) );
    }


    //
    // TRANSFER DATA
    //

    parseEventTransferData( event ) {
        if ( !event ) return;
        this.parseTransferData( event.dataTransfer );
    }

    parseTransferData( dataTransfer ) {
        if ( !dataTransfer || !( dataTransfer.files instanceof FileList ) ) return;

        this._contentStructList = [];

        for ( let i = 0; i < dataTransfer.files.length; i++ ) {
            const file = dataTransfer.files[ i ];
            if ( file && file.name ) {
                const type = typeFromFileNameGet( file.name );
                const name = nameFromFileNameGet( file.name );

                const contentStruct = { ...ContentStruct, file, type, name };
                this._contentStructAdd( contentStruct );
            }
        }
        this.startLoadAll();
    }

    contentStructByReaderGet( reader ) {
        for ( let i = 0; i <  this._contentStructList.length; i++ ) {
            const contentStruct = this._contentStructList[ i ];
            if ( contentStruct.reader === reader ) {
                return contentStruct;
            }
        }
        return null;
    }

    isLoadedContentStructAll() {
        return this._contentStructList.every( contentStruct => contentStruct.state === 2 );
    }

    contentStructAllLoadedCheck() {
        if (!this.isLoadedContentStructAll()) return;

        this.loadAllStarted = false;
        this.dispatchEvent( new ContentDropEvent( ContentDropEvent.ON_LOAD_ALL_COMPLETE, this._contentStructList ) );

        // Clear All
        while ( this._contentStructList.length > 0 ) {
            const contentStruct = this._contentStructList.shift();
            // Clear @ContentStruct
            contentStruct.result = undefined;
        }
    }

    _contentStructAdd( contentStruct ) {
        if ( this._contentStructList.indexOf( contentStruct ) >= 0 ) return;
        this._contentStructList.push( contentStruct );
    }
    _contentStructRemove( contentStruct ) {
        const index = this._contentStructList.indexOf( contentStruct );
        if ( index < 0 ) return false;
        this._contentStructList.splice( index, 1 );
        return true;
    }


    //
    // LOAD
    //

    startLoadAll() {
        if ( this.loadAllStarted ) return;
        this.loadAllStarted = true;

        this.dispatchEvent( new ContentDropEvent( ContentDropEvent.ON_LOAD_ALL_START ) );

        for ( let i = 0; i < this._contentStructList.length; i++ ) {
            const contentStruct = this._contentStructList[ i ];
            this._loadStruct( contentStruct );
        }
    }

    _loadStruct( contentStruct ) {
        if ( !contentStruct || contentStruct.state != 0 ) return;
        contentStruct.state = 1;

        const fileReader = new FileReader();

        fileReader.onload = this._onFileLoad;

        contentStruct.reader = fileReader;

        this._loadStructReadAs( contentStruct );
    }

    _loadStructReadAs( contentStruct ) {
        const { type, file, reader } = contentStruct;

        switch ( type ) {
            case FileType.PNG :
            case FileType.JPG :
                reader.readAsDataURL( file );
                break;
            case FileType.ATLAS:
            case FileType.JSON:
            default:
                reader.readAsText( file );
        }
    }

    _onFileLoad( event ) {
        const contentStruct = this.contentStructByReaderGet( event.target );
        if ( !contentStruct ) return;

        contentStruct.state = 2;
        contentStruct.result = event.target.result;

        this.dispatchEvent( new ContentDropEvent( ContentDropEvent.ON_LOAD, contentStruct ) );

        this.contentStructAllLoadedCheck();
    }

}