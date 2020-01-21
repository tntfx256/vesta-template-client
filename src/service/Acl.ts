import { Acl } from "@vesta/services";

let instance: Acl;
export function getAclInstance(): Acl {
    if (!instance) {
        instance = new Acl();
    }
    return instance;
}
