/**
 * 为指定的函数 fun 创建对应的 单例函数
 * @param fun : Function  普通函数 或者 构造函数
 * @return Function  增加了单例机制的函数；该函数的使用方式 和 原函数 fun 一样，只是无论多少次调用该函数，该函数都会返回原函数 fun 的同一实例
 */
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
