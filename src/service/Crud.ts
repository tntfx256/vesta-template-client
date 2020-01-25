import { Preloader } from "@vesta/components";
import { Crud, ICrudConfig } from "@vesta/services";
import { getApiInstance } from "./Api";
import { getLogInstance } from "./Log";

const instances: { [edge: string]: Crud<any> } = {};

export function getCrudInstance<T>(edge: string): Crud<T> {
    if (!instances[edge]) {
        const crudConfig: ICrudConfig = {
            api: getApiInstance(),
            edge,
            hooks: {
                afterRequest: Preloader.hide,
                beforeRequest: Preloader.show,
                onError: getLogInstance().error,
                onSuccess: getLogInstance().log,
            },
        };
        instances[edge] = new Crud(crudConfig);
    }
    return instances[edge];
}
