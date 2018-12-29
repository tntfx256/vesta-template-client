import { IRequest, IResponse, Model, ValidationError, Err } from "@vesta/core";
import { getApi } from "./Api";

export class Crud<T> {

    public static getService<T>(modelName, edge?: string): Crud<T> {
        if (!(modelName in Crud.instances)) {
            Crud.instances[modelName] = new this(edge || modelName);
        }
        return Crud.instances[modelName];
    }

    public static hooks = {
        afterRequest: () => { },
        beforeRequest: () => { },
        onError: console.error,
        onSuccess: console.info,
    };


    private static instances: { [name: string]: Crud<any> } = {};
    protected api = getApi();

    protected constructor(protected edge: string) { }

    public fetch(id: number): Promise<T> {
        return this.api.get<T, IResponse<T>>(`${this.edge}/${id}`)
            .then((result) => result.items[0])
            .catch((error) => {
                Crud.hooks.onError(error);
                return null;
            });
    }

    public fetchAll(query?: IRequest<T>): Promise<T[]> {
        return this.api.get<IRequest<T>, IResponse<T>>(this.edge, query)
            .then((response) => response.items)
            .catch((error) => {
                Crud.hooks.onError(error);
                return [];
            });
    }

    public fetchCount(query?: IRequest<T>): Promise<number> {
        return this.api.get<IRequest<T>, IResponse<T>>(`${this.edge}/count`, query)
            .then((response) => response.total)
            .catch((error) => {
                Crud.hooks.onError(error);
                return 0;
            });
    }

    public insert(data: T, files?: T): Promise<T> {
        return this.api.post<T, IResponse<T>>(this.edge, data)
            .then((response) => {
                if (files) {
                    const id = (response.items[0] as any).id;
                    return this.api.upload<T, IResponse<T>>(`${this.edge}/file/${id}`, files);
                }
                return response;
            })
            .then((response) => {
                const id = (response.items[0] as any).id;
                Crud.hooks.onSuccess("info_add_record", id);
                return response.items[0];
            })
            .catch((error: Err) => {
                Crud.hooks.onError(error);
                if (error.code === Err.Code.Validation.code) { throw error; }
                return null;
            })
    }

    public remove(id: number): Promise<boolean> {
        return this.api.delete<IRequest<T>, IResponse<number>>(`${this.edge}/${id}`)
            .then((response) => {
                Crud.hooks.onSuccess("info_delete_record", response.items[0]);
                return true;
            })
            .catch((error) => {
                Crud.hooks.onError(error);
                return false;
            });
    }

    public save(model: T, files?: T): Promise<T> {
        return ((model as any).id ?
            this.update(model, files) :
            this.insert(model, files));
    }

    public submit(model: Model, files?: T, ...fields: string[]): Promise<T> {
        const validationErrors = model.validate(...fields);
        if (validationErrors) {
            return Promise.reject(new ValidationError(validationErrors));
        }
        return this.save(model.getValues(...fields), files);
    }

    public update(data: T, files?: T): Promise<T> {
        return this.api.put<T, IResponse<T>>(this.edge, data)
            .then((response) => {
                if (files) {
                    const id = (response.items[0] as any).id;
                    return this.api.upload<T, IResponse<T>>(`${this.edge}/file/${id}`, files);
                }
                return response;
            })
            .then((response) => {
                const id = (response.items[0] as any).id;
                Crud.hooks.onSuccess("info_update_record", id);
                return response.items[0];
            })
            .catch((error) => {
                Crud.hooks.afterRequest();
                Crud.hooks.onError(error);
                if (error.code === Err.Code.Validation.code) { throw error; }
                return null;
            });
    }
}
