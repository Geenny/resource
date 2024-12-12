import Event from "../../event/Event";
import EventDispathcer from "../../event/EventDispatcher";
import { dispatcher } from "../dispatcher/dispatcher";

export default class Component extends EventDispathcer {

    init() {
        this.dispathcerInit();
        this.subcsriptionsInit();
    }

    destroy() {
        this.dispathcerDestroy();
        this.subscriptionsDestroy();
    }


    //
    // SUBSCRIPTIONS
    //

    subcsriptionsInit() {
        this.subscriptionsHandlersInit();
        this._subscriptionsCreate();
    }

    subscriptionsDestroy() {
        this.subscriptionsHandlersDestroy();
        this._subscriptionsKill();
    }

    subscriptionsHandlersInit() {
        this.handlers = {
            [Event.ANY]: this.onAny.bind( this )
        };
    }

    subscriptionsHandlersDestroy() {
        this.handlers = undefined;
    }

    // METHODS

    onAny( event ) { }

    _subscriptionsCreate() {
        if ( !this.handlers ) return;

        Object.keys( this.handlers ).forEach( handlerName => {
            const method = this.handlers[ handlerName ];
            this.addEventListener( handlerName, method );
        } );
    }

    _subscriptionsKill() {
        if ( !this.handlers ) return;

        Object.keys( this.handlers ).forEach( handlerName => {
            const method = this.handlers[ handlerName ];
            this.removeEventListener( handlerName, method );
        } );
    }


    //
    // DISPATCHER
    //

    dispathcerInit() {
        this.dispatcher = dispatcher;
    }

    dispathcerDestroy() {
        this.dispatcher = undefined;
    }

}