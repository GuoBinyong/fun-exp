type BeforeFun = (...args:any[])=>(any[] | IArguments | undefined | null)
type AfterFun = (rawReturn:any,...rawArguments:any[])=>any

interface Function {
    before(fun:BeforeFun):this;
    after(fun:AfterFun):this;
    wrap(before?:BeforeFun|null|undefined,after?:AfterFun|null|undefined):this;
}


Function.prototype.before = function (fun) {
    var rawFun = this;
    return function () {
        // @ts-ignore
        var argArr = fun.apply(this,arguments);
        if (argArr == null){
            argArr = arguments;
        }

        // @ts-ignore
        return rawFun.apply(this,argArr);
    };
}





Function.prototype.after = function (fun) {
    var rawFun = this;
    return function () {
        // @ts-ignore
        var rawReturn = rawFun.apply(this,arguments);
        // @ts-ignore
        return  fun.call(this,rawReturn,...arguments);
    };
}




Function.prototype.wrap = function (before,after) {
    var rawFun = this;

    if (before && after){
        return function () {
            // @ts-ignore
            var argArr = before.apply(this,arguments);
            if (argArr == null){
                argArr = arguments;
            }

            // @ts-ignore
            var rawReturn = rawFun.apply(this,argArr);

            // @ts-ignore
            return  fun.call(this,rawReturn,...arguments);
        };
    }


    if (before){
        return rawFun.before(before);
    }

    if (after){
        return rawFun.after(after);
    }

    return rawFun;
}

