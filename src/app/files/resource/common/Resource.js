import { Container, Graphics, Point, Texture } from "pixi.js";
import { ResourceType } from "../ResourceType";

export default class Resource {

    constructor( resourceStruct ) {
        this.resourceStruct = resourceStruct;
        this.contentStruct = resourceStruct.contentStruct;

        this.size = new Point();
        this.container = undefined;   // Container
        // this.view = undefined;        // View

        this.zz_addon_list = [];
        this.zz_resource_parent = undefined;
        this.zz_resource_list = [];
        this.zz_resource_possible = [];
        this.zz_driver_list = [];
        this.zz_driver_possible = [];

        this.init();
    }


    //
    // GET/SET
    //

    get ready() { return this.resourceStruct.ready; }

    get name() { return this.resourceStruct.name; }
    get type() { return this.resourceStruct.type; }
    get fileName() { return this.contentStruct.file.name; }

    get used() { return !!this.zz_resource_parent; }

    get view() { return this.resourceStruct.instance; }



    //
    // INIT
    //

    init() {
        this.initVars();
        this.initContainer();
        this.initView();
        this.initDriverPossible();
        this.initResourcePossible();
    }

    initVars() { }

    initContainer() {
        this.container = new Container();
    }

    initView() { }

    initDriverPossible() {
        // this.zz_driver_possible = [];
    }

    initResourcePossible() {
        // this.zz_resource_possible = [];
    }


    //
    // CREATE
    //

    create() {
        if ( !this.container ) return;
        if ( !this.view ) return;
        if ( this.container.children.includes( this.view ) ) {
            this.container.removeChild( this.view );
        }

        this.container.addChild( this.view );
        
        this.update();
    }


    //
    // UPDATE
    //

    update() { }


    //
    // RESOURCE
    //

    isResource( resource ) {
        return this.zz_resource_list.indexOf( resource ) >= 0;
    }

    isResourcePossible( type ) {
        return this.zz_resource_possible.indexOf( type ) >= 0;
    }

    resourceParentSet( resource ) {
        this.zz_resource_parent = resource;
    }

    resourceChildAdd( resource ) { 
        const index = this.zz_resource_list.indexOf( resource );
        if ( index >= 0 ) return;

        // Add resource as child
        this.zz_resource_list.push( resource );

        // Set self as parent
        resource.resourceParentSet( this );
    }

    resourceChildrenRemove() {
        while ( this.zz_resource_list.length > 0 ) {
            const resource = this.zz_resource_list.shift();
            resource.resourceParentSet( undefined );
        }
    }


    //
    // DRIVERS
    //

    driverPosibleInit() {
        // this.zz_driver_possible = [];
    }

    isDriverPossible( type ) {
        return this.zz_driver_possible.indexOf( type ) >= 0;
    }


    //
    // ADDONS VIEW
    //

    addonAdd( resource, condition ) {
        if ( !condition || !condition.method ) return;
        if ( !resource || !resource.ready ) return;
        if ( this.zz_addon_list.some( addon => addon.resource === resource ) ) return;

        const isResourceByConditionAdd = this.addonResourceAdd( resource, condition );
        if ( !isResourceByConditionAdd ) {
            console.warn( `${ this.constructor.name }: Addon NOT ADDED: ${ resource }; ${ condition }` );
            return;
        }

        const name = condition.name || "noname";

        this.zz_addon_list.push( { name, condition, resource } );
    }

    addonRemove( resource ) {
        const index = this.zz_addon_list.findIndex( addon => addon.resource === resource );
        if ( index < 0 ) return;
        this.zz_addon_list.splice( index, 1 );
    }

    addonRemoveAll() {
        while ( this.zz_addon_list.length > 0 ) {
            this.zz_addon_list.shift();
        }
    }

    addonClear() {
        const addonList = this.zz_addon_list.filter( addon => !addon.resource.ready );
        addonList.forEach( addon => this.addonRemove( addon.resource ) );
    }


    //
    // ADDON RESOURCE
    //

    addonResourceAdd( resource, condition ) {
        return false;
    }

}