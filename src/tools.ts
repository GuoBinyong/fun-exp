export function createSingleton<Fun extends Function>(fun:Fun):Fun {
    var singleInst:any;

    return function () {
        if (singleInst !== undefined) {
            return singleInst;
        }
        if (new.target) {
            // @ts-ignore
            return new fun(...arguments);
        }

        // @ts-ignore
        return fun.apply(this, arguments);
    } as unknown as Fun
}
