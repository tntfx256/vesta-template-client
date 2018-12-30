import { Preloader } from "@vesta/components";
import { Crud, ICrudConfig } from "@vesta/services";
import { getApi } from "./Api";
import { getLog } from "./getLog";

let instances: { [edge: string]: Crud<any> };

export function getCrud<T>(edge): Crud<T> {
    if (!instances[edge]) {
        const crudConfig: ICrudConfig = {
            api: getApi(),
            edge,
            hooks: {
                afterRequest: Preloader.hide,
                beforeRequest: Preloader.show,
                onError: getLog().error,
                onSuccess: getLog().log,
            }
        };
        instances[edge] = new Crud(crudConfig);
    }
    return instances[edge];
}
