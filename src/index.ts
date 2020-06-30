type BeforeFun = (...args:any[])=>(any[] | IArguments | undefined | null)
type AfterFun = (rawReturn:any,...rawArguments:any[])=>any

interface Function {
    before(fun:BeforeFun):this;
    after(fun:AfterFun):this;
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
    }
}





Function.prototype.after = function (fun) {
    var rawFun = this;
    return function () {
        // @ts-ignore
        var rawReturn = rawFun.apply(this,arguments);
        // @ts-ignore
        return  fun.call(this,rawReturn,...arguments);
    }
}