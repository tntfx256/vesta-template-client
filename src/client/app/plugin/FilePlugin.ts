import {LogService} from "../service/LogService";

/**
 * cordova-plugin-file & cordova-plugin-file-transfer & cordova-plugin-filepath
 */
const requestFileSystem = window.requestFileSystem || window['webkitRequestFileSystem'];
const resolveLocalFileSystemURL = window.resolveLocalFileSystemURI || window['webkitResolveLocalFileSystemURL'];

export enum AppLocationType {Private, Public}

export class FilePlugin {
    private fileSystem: FileSystem;
    //private publicEntry: DirectoryEntry;
    //private privateEntry: DirectoryEntry;
    private file: any;

    constructor() {
        //<development>
        if ('undefined' == typeof cordova) {
            LogService.error('FilePlugin not available');
        } else
        //</development>
            this.file = cordova.file;
    }

    private getFileSystem(): Promise<FileSystem> {
        //<development>
        if (!this.check('getFileSystem')) return;
        //</development>
        return new Promise<FileSystem>((resolve, reject) => {
            if (this.fileSystem) {
                resolve(this.fileSystem);
            } else {
                requestFileSystem(window.PERSISTENT, 0, resolve, reject);
            }
        });
    }

    public getDirectory(type: AppLocationType, relativePath?: string): Promise<DirectoryEntry> {
        //<development>
        if (!this.check('getDirectory')) return;
        //</development>
        let baseDirectory: string = type == AppLocationType.Public ? this.file.externalRootDirectory : this.file.dataDirectory;
        return this.resolveUrl(baseDirectory)
            .then(result => {
                if (relativePath) {
                    return this.mkdirp(<DirectoryEntry>result, relativePath);
                } else {
                    return <DirectoryEntry>result;
                }
            })
            ;
    }

    public resolveUrl(uri: string): Promise<Entry> {
        //<development>
        if (!this.check('resolveUrl')) return;
        //</development>
        return new Promise<Entry>((resolve, reject) => {
            resolveLocalFileSystemURL(uri, resolve, reject);
        });
    }

    public resolveNativePath(path: string): Promise<string> {
        //<development>
        if (!this.check('resolveNativePath')) return;
        //</development>
        return new Promise<string>((resolve, reject) => {
            window['FilePath'].resolveNativePath(path, resolve, reject);
        });
    }

    public mkdirp(entry: DirectoryEntry, relativePath: string): Promise<DirectoryEntry> {
        //<development>
        if (!this.check('mkdirp')) return;
        //</development>
        let folders = relativePath.split(/[\/\\]/g);
        return new Promise(((resolve, reject) => {
            mkdir(entry, 0);

            function mkdir(entry: DirectoryEntry, index: number) {
                if (index == folders.length) {
                    return resolve(entry);
                }
                entry.getDirectory(folders[index], {create: true, exclusive: false}, (newEntry: DirectoryEntry) => {
                    console.log('Successfully created the `' + newEntry.nativeURL + '` directory');
                    mkdir(newEntry, ++index);
                }, (err) => {
                    console.error('Failed creating the `' + entry.nativeURL + '/' + folders[index] + '` directory because of: ', err);
                    reject(new Error(`Failed creating the '${entry.nativeURL}/${folders[index]}'`));
                });
            }
        }));
    }

    public copy(src: string | FileEntry, dest: string | DirectoryEntry, fileName?: string): Promise<FileEntry> {
        //<development>
        if (!this.check('copy')) return;
        //</development>
        let checkType = (path: string | Entry): Promise<Entry> => {
            if (typeof path === 'string') return this.resolveUrl(path);
            return Promise.resolve(<Entry>path);
        };

        return Promise.all([checkType(src), checkType(dest)])
            .then((result: Array<Entry>) => {
                let srcEntry: Entry = result[0],
                    destEntry: Entry = result[1];
                if (destEntry.isFile) throw new Error('Destination is not of type Directory');
                if (!fileName) {
                    fileName = srcEntry.name;
                }
                return new Promise<FileEntry>((resolve, reject) => {
                    srcEntry.copyTo(<DirectoryEntry>destEntry, fileName, entry => resolve(<FileEntry>entry), reject);
                });
            });
    }

    public download(config: any) {
        //<development>
        if (!this.check('download')) return;
        //</development>
        let options: FileDownloadOptions = {};
        if (config.headers) {
            options.headers = config.headers;
        }
        this.resolveUrl(config.destination).then((destDirEntry) => {
            let ft = new FileTransfer();
            if (config.progressHandler) {
                ft.onprogress = function (progressEvent) {
                    config.progressHandler(progressEvent);
                };
            }
            ft.download(encodeURI(config.endPoint + '/' + config.fileName), destDirEntry.toURL() + config.fileName, function (entry) {
                config.cb(null, entry);
            }, function (err) {
                try {
                    let realError = JSON.parse(err.body);
                    config.cb(new Error(realError.message));
                } catch (e) {
                    config.cb(new Error('Error downloading file'));
                }
            }, true, options);
        });
    }

    public convertToFile(fileEntry: FileEntry): Promise<File> {
        //<development>
        if (!this.check('convertToFile')) return;
        //</development>
        return new Promise<File>((resolve, reject) => {
            fileEntry.file(resolve, reject);
        });
    }

    //<development>
    private check(method): boolean {
        if ('undefined' == typeof cordova) {
            LogService.error(`FilePlugin: ${method}`);
            return false
        }
        return true;
    }

    //</development>
}
