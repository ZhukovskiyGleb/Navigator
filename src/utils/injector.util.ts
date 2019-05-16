export interface Injectable {}

interface ClassRef {
    new(): Injectable;
}

export class Injector {
    private static _injects: {[key: string]: Injectable} = {};

    public static inject(ref: ClassRef): void {
        const name = ref.toString();

        if (this._injects.hasOwnProperty(name)) {
            console.log(`Error: Inject ${name} already exist!`);
            return;
        }

        this._injects[name] = new ref();
    }

    public static get(ref: ClassRef): Injectable {
        return this._injects[ref.toString()] || null;
    }
}
