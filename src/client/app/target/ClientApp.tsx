import React from "react";
import {AuthService} from "../service/AuthService";
import {AclPolicy} from "../cmn/enum/Acl";
import {AbstractClient} from "./AbstractClient";

export class ClientApp extends AbstractClient {

    public init() {
        this.registerServiceWorker();
        //<web>
        AuthService.getInstance().setDefaultPolicy(AclPolicy.Allow);
        //</web>
    }

    private registerServiceWorker() {
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.register('js/sw.js')
        //         .then(registration=> {
        //             console.log('serviceWorker registered', registration);
        //         })
        //         .catch(err=>console.error(err));
        // }
    }
}
