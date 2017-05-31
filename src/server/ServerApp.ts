import * as express from "express";
import * as morgan from "morgan";
import * as http from "http";
import * as spdy from "spdy";
import * as fs from "fs";
import {IStaticServerSetting} from "./app";

export class ServerApp {
    private app: express.Express;
    private server: http.Server | spdy.Server;

    constructor(private setting: IStaticServerSetting) {
        this.app = express();
        if (setting.http2) {
            const options = {
                key: fs.readFileSync(setting.ssl.key),
                cert: fs.readFileSync(setting.ssl.cert)
            };
            this.server = spdy.createServer(options, <any>this.app);
        } else {
            this.server = http.createServer(this.app);
        }
        this.server.on('error', err => console.error('Static server error: ', err));
        this.server.on('listening', arg => console.log('Static server starts listening on ', this.server.address()));
    }

    private configExpressServer() {
        this.app.use(morgan(this.setting.env == 'development' ? 'dev' : 'combined'));
        this.app.enable('trust proxy');
        this.app.disable('case sensitive routing');
        this.app.disable('strict routing');
        this.app.disable('x-powered-by');
        try {
            fs.mkdirSync(this.setting.dir.upload);
        } catch (e) {
        }
    }

    public init() {
        this.configExpressServer();
        this.app.use('/offline.manifest', (req, res, next) => {
            res.contentType('text/cache-manifest');
            res.sendFile(`${this.setting.dir.html}/offline.manifest`);
        });
        this.app.use('/asset', express.static(this.setting.dir.upload));
        this.app.use(express.static(this.setting.dir.html, {index: false}));
        this.app.use((req, res, next) => {
            if (/.+\.(html|htm|js|css|xml|png|jpg|jpeg|gif|pdf|txt|ico|woff|woff2|svg|eot|ttf|rss|zip|mp3|rar|exe|wmv|doc|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent)$/i.exec(req.url)) {
                res.status(404);
                return res.end();
            }
            console.log(`\nStaticServer> Not Found: ${req.url}\n`);
            if (this.setting.http2) {
                this.push(res, '/js/app.js', '/js/lib.js', '/css/app-ltr.css', '/img/bg-main.jpg');
            }
            res.sendFile(`${this.setting.dir.html}/index.html`);

        });

        if (this.setting.env === 'development') {
            this.app.use((err: any, req, res, next) => {
                res.status(err.status || 500);
                console.log('development error', err);
                res.json({message: err.message, error: err});
            });
        }

        this.app.use((err: any, req, res, next) => {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: {}
            });
        });
    }

    public start() {
        this.server.listen(this.setting.port);
    }

    public push(res, ...files: Array<string>) {
        for (let i = 0, il = files.length; i < il; i++) {
            let file = files[i];
            fs.createReadStream(`${this.setting.dir.html}${file}`)
                .on('error', err => console.log('file error:', err))
                .pipe(res.push(file, {request: {accept: '*/*'}}))
                .on('error', err => console.log('push error:', err));
        }
    }
}
