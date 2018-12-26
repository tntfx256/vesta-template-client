import { Acl } from "@vesta/services";

let instance: Acl;
export function getAcl(): Acl {
    if (!instance) {
        instance = new Acl();
    }
    return instance;
}