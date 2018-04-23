import { Err } from "../medium";
import { LogService } from "../service/LogService";

/**
 * cordova-plugin-file & cordova-plugin-file-transfer & cordova-plugin-filepath
 */
const requestFileSystem = window.requestFileSystem || (window as any).webkitRequestFileSystem;
const resolveLocalFileSystemURL = window.resolveLocalFileSystemURI || (window as any).webkitResolveLocalFileSystemURL;

export enum AppLocationType { Private, Public }

export class FilePlugin {
    private file: any;
    private fileSystem: FileSystem;
    //private publicEntry: DirectoryEntry;
    //private privateEntry: DirectoryEntry;

    public getDirectory(type: AppLocationType, relativePath?: string): Promise<DirectoryEntry> {
        const baseDirectory: string = type == AppLocationType.Public ?
            this.file.externalRootDirectory :
            this.file.dataDirectory;
        return this.resolveUrl(baseDirectory)
            .then((result) => {
                if (relativePath) {
                    return this.mkdirp(result as DirectoryEntry, relativePath);
                } else {
                    return result as DirectoryEntry;
                }
            })
            ;
    }

    public resolveUrl(uri: string): Promise<Entry> {
        return new Promise<Entry>((resolve, reject) => {
            resolveLocalFileSystemURL(uri, resolve, reject);
        });
    }

    public resolveNativePath(path: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            (window as any).FilePath.resolveNativePath(path, resolve, reject);
        });
    }

    public mkdirp(entry: DirectoryEntry, relativePath: string): Promise<DirectoryEntry> {
        const folders = relativePath.split(/[\/\\]/g);
        return new Promise(((resolve, reject) => {
            mkdir(entry, 0);

            function mkdir(dirEntry: DirectoryEntry, index: number) {
                if (index == folders.length) {
                    return resolve(dirEntry);
                }
                // tslint:disable-next-line:max-line-length
                dirEntry.getDirectory(folders[index], { create: true, exclusive: false }, (newEntry: DirectoryEntry) => {
                    mkdir(newEntry, ++index);
                }, (err) => {
                    reject(new Error(`Failed creating the '${dirEntry.nativeURL}/${folders[index]}'`));
                });
            }
        }));
    }

    public copy(src: string | FileEntry, dest: string | DirectoryEntry, fileName?: string): Promise<FileEntry> {
        const checkType = (path: string | Entry): Promise<Entry> => {
            if (typeof path === "string") { return this.resolveUrl(path); }
            return Promise.resolve(path as Entry);
        };

        return Promise.all([checkType(src), checkType(dest)])
            .then((result: Entry[]) => {
                const srcEntry: Entry = result[0];
                const destEntry: Entry = result[1];
                if (destEntry.isFile) {
                    throw new Err(Err.Code.FileSystem, "Destination is not of type Directory");
                }
                if (!fileName) {
                    fileName = srcEntry.name;
                }
                return new Promise<FileEntry>((resolve, reject) => {
                    // tslint:disable-next-line:max-line-length
                    srcEntry.copyTo(destEntry as DirectoryEntry, fileName, (entry) => resolve(entry as FileEntry), reject);
                });
            });
    }

    public download(config: any) {
        const options: FileDownloadOptions = {};
        if (config.headers) {
            options.headers = config.headers;
        }
        this.resolveUrl(config.destination).then((destDirEntry) => {
            const ft = new FileTransfer();
            if (config.progressHandler) {
                ft.onprogress = (progressEvent) => {
                    config.progressHandler(progressEvent);
                };
            }
            // tslint:disable-next-line:max-line-length
            ft.download(encodeURI(`${config.endPoint}/${config.fileName}`), `${destDirEntry.toURL()}${config.fileName}`, (entry) => {
                config.cb(null, entry);
            }, (err) => {
                try {
                    const realError = JSON.parse(err.body);
                    config.cb(new Error(realError.message));
                } catch (e) {
                    config.cb(new Error("Error downloading file"));
                }
            }, true, options);
        });
    }

    public convertToFile(fileEntry: FileEntry): Promise<File> {
        return new Promise<File>((resolve, reject) => {
            fileEntry.file(resolve, reject);
        });
    }

    private getFileSystem(): Promise<FileSystem> {
        return new Promise<FileSystem>((resolve, reject) => {
            if (this.fileSystem) {
                resolve(this.fileSystem);
            } else {
                requestFileSystem(window.PERSISTENT, 0, resolve, reject);
            }
        });
    }
}
