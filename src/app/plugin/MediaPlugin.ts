import { Promise } from "es6-promise";
import { FilePlugin } from "./FilePlugin";

/**
 * cordova-plugin-camera, (cordova-plugin-media/cordova-plugin-media-with-compression-fork),
 * cordova-plugin-media-capture
 */
export enum DestinationType {
    DATA_URL = 0, // Return base64 encoded string
    FILE_URI = 1, // Return file uri (content://media/external/images/media/2 for Android)
    NATIVE_URI = 2, // Return native uri (eg. asset-library://... for iOS)
}

export enum EncodingType {
    JPEG = 0, // Return JPEG encoded image
    PNG = 1, // Return PNG encoded image
}

export enum MediaType {
    PICTURE = 0, // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
    VIDEO = 1, // allow selection of video only, ONLY RETURNS URL
    ALLMEDIA = 2, // allow selection from all media types
    AUDIO = 61,
}

export enum PictureSourceType {
    PHOTOLIBRARY = 0, // Choose image from picture library (same as SAVEDPHOTOALBUM for Android)
    CAMERA = 1, // Take picture from camera
    SAVEDPHOTOALBUM = 2, // Choose image from picture library (same as PHOTOLIBRARY for Android)
}

export enum Direction { BACK = 0, FRONT = 1 }

export enum MediaError {
    MEDIA_ERR_ABORTED = 1,
    MEDIA_ERR_NETWORK = 2,
    MEDIA_ERR_DECODE = 3,
    MEDIA_ERR_NONE_SUPPORTED = 4,
}

export enum MediaStatus { MEDIA_NONE = 0, MEDIA_STARTING = 1, MEDIA_RUNNING = 2, MEDIA_PAUSED = 3, MEDIA_STOPPED = 4 }

// matches iOS UIPopoverArrowDirection constants to specify arrow location on popover
export enum PopoverArrowDirection { ARROW_UP = 1, ARROW_DOWN = 2, ARROW_LEFT = 4, ARROW_RIGHT = 8, ARROW_ANY = 15 }

// export class PhotoCaptureOptions {
//     public quality = 50;
//     public destinationType = 1;
//     public sourceType = 1;
//     public targetWidth = -1;
//     public targetHeight = -1;
//     public encodingType = 0;
//     public mediaType = 0;
//     public allowEdit = false;
//     public correctOrientation = false;
//     public saveToPhotoAlbum = false;
//     public popoverOptions = null;
//     public cameraDirection = 0;
// }

export class MediaPlugin {
    private camera: Camera;
    private filePlugin: FilePlugin;

    constructor() {
        this.camera = navigator.camera;
        this.filePlugin = new FilePlugin();
    }

    public takePicture(option: CameraOptions): Promise<string> {
        option.encodingType = option.encodingType || EncodingType.JPEG;
        option.mediaType = option.mediaType || MediaType.PICTURE;
        option.sourceType = option.sourceType || PictureSourceType.PHOTOLIBRARY;
        option.destinationType = option.destinationType || DestinationType.FILE_URI;
        option.quality = option.quality || 50;
        return new Promise<string>((resolve, reject) => {
            this.camera.getPicture((image: string) => resolve(this.filePlugin.resolveNativePath(image)),
                (error: string) => reject(new Error(error)), option);
        });
    }

    public cleanup() {
        this.camera.cleanup(() => null, () => null);
    }

    public captureAudio(options, cb) {
        const d = new Date();
        let onRecordStop;
        let media;
        const name = cordova.file.externalRootDirectory + "audio-" +
            d.getFullYear() + this.zeroFiller(d.getMonth() + 1) + this.zeroFiller(d.getDate()) + "-" +
            this.zeroFiller(d.getHours()) + this.zeroFiller(d.getMinutes()) + this.zeroFiller(d.getSeconds()) + ".mp3";
        media = new Media(name, () => {
            this.filePlugin.resolveUrl(name/*, onRecordStop*/);
        }, (err) => {
            onRecordStop(err);
        });
        cb({
            startRecording() {
                media.startRecord();
            },
            stopRecording(recordStopCallback) {
                onRecordStop = recordStopCallback;
                media.stopRecord();
            },
        });
    }

    public captureVideo(options: VideoOptions, cb) {
        navigator.device.capture.captureVideo((mediaFiles) => {
            cb(null, mediaFiles);
        }, (err) => {
            cb(err);
        }, options);
    }

    public resizeImage(imageEntry, newWidth): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const sourceCanvas = document.createElement("canvas");
            const destCanvas = document.createElement("canvas");

            img.onload = () => {
                sourceCanvas.width = img.width;
                sourceCanvas.height = img.height;
                sourceCanvas.getContext("2d").drawImage(img, 0, 0);
                destCanvas.width = newWidth;
                destCanvas.height = img.height * (newWidth / img.width);
                (window as any).pica.resizeCanvas(sourceCanvas, destCanvas, { quality: 1 }, (err) => {
                    if (err) { return reject(err); }
                    resolve(destCanvas.toDataURL("image/jpg", 0.5));
                });
            };
            img.src = imageEntry.nativeURL;
        });
    }

    private zeroFiller(input: number): string {
        return input < 10 ? `0${input}` : String(input);
    }
}
