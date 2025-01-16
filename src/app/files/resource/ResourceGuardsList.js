import { FileType } from "../file/FileType";
import ResourceParseAtlas from "./parse/ResourceParseAtlas";
import ResourceParseImage from "./parse/ResourceParseImage";
import ResourceParseSpine from "./parse/ResourceParseSpine";
import ResourceParseSpritesheet from "./parse/ResourceParseSpritesheet";

const ResourceGuardsList = [
    {
        parseClass: ResourceParseAtlas,
        guard: ( contentStruct ) => contentStruct.type === FileType.ATLAS
    },
    {
        parseClass: ResourceParseImage,
        guard: ( contentStruct ) => [ FileType.PNG, FileType.JPG, FileType.JPEG ].includes( contentStruct.type )
    },
    {
        parseClass: ResourceParseSpine,
        guard: ( contentStruct ) => contentStruct.type === FileType.JSON && checkSpineContentStruct( contentStruct )
    },
    {
        parseClass: ResourceParseSpritesheet,
        guard: ( contentStruct ) => contentStruct.type === FileType.JSON && false
    }
];

const jsonParseToObjectGet = ( jsonText ) => {
    try {
        return JSON.parse( jsonText );
    } catch (error) {
        console.log( error.toString() );
    }
    
    return {};
}

const checkSpineContentStruct = ( contentStruct ) => {
    let jsonData = contentStruct.json || jsonParseToObjectGet( contentStruct.result );
    if ( !jsonData ) return false;
    if ( !contentStruct.json ) contentStruct.json = jsonData;
    if ( !jsonData.skeleton || !jsonData.skeleton.spine ) return false;
    if ( !jsonData.bones || !jsonData.bones.length ) return false;
    if ( !jsonData.slots || !jsonData.slots.length ) return false;
    if ( !jsonData.skins || !jsonData.skins.length ) return false;
    
    return true;
};

export { ResourceGuardsList } ;
