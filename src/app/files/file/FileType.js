const FileType = {
    TXT: "txt",
    JPG: "jpg",
    JPEG: "jpeg",
    PNG: "png",
    JSON: "json",
    ATLAS: "atlas",
    MP3: "mp3", // Audio
    OGG: "ogg",
    MP4: "mp4" // Video
};

const isFileType = ( type ) => {
    return Object.values( FileType ).includes( type );;
}

const nameFromFileNameGet = ( fileName ) => {
    if ( fileName && fileName.length > 0 ) {
        const pointPosition = fileName.lastIndexOf( "." );
        return pointPosition > 0 ? fileName.substring( 0, pointPosition ) : "";
    }
    return "";
}

const typeFromFileNameGet = ( fileName ) => {
    if ( fileName && fileName.length > 0 ) {
        const pointPosition = fileName.lastIndexOf( "." ) + 1;
        const lastPosition = fileName.length;
        return pointPosition > 1 && pointPosition < lastPosition ? fileName.substring( pointPosition, lastPosition ) : "";
    }
    return "";
}

export { FileType, isFileType, nameFromFileNameGet, typeFromFileNameGet };