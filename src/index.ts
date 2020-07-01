/**
 * 前置函数：在目标函数之前执行的函数
 * @param args
 * @return  any[] | IArguments | undefined | null
 *    - 如果返回的是类数组类型的值，则会把该类数组中的每一个元素作为参数传给目标函数 ；
 *    - 如果返回 undefined | null 时，则会忽略该返回值，不会更改目标函数的参数；
 */
type BeforeFun = (...args:any[])=>(any[] | IArguments | undefined | null)

/**
 * 后置函数：在目标函数执行之后再执行该函数
 * @param rawReturn:any   必须；该参数是 目标函数的返回值；
 * @param ...rawArguments:any[]   是目标函数所接收的参数
 * @return  any   后置函数的返回值 会替换 目标函数的返回值 成为最终的返回值；如果仍想返回目标函数的返回值，只需在后置函数中返回传入的 rawReturn 参数即可；
 */
type AfterFun = (rawReturn:any,...rawArguments:any[])=>any



interface Function {
    /**
     * 增加 前置函数；
     * 即：在当前函数（即：目标函数）执行前优先执行的函数 fun
     * @param fun : BeforeFun   必须；前置函数；注意：前置函数 返回了类数组中的每一个元素都会被作为 目标函数 的参数输入；如果 前置函数 返回 undefined | null 时，则不会更改目标函数的参数；
     * @return Function 返回一个新的函数，该函数已在目标函数前增加了前置函数
     *
     * 注意：
     * - 该方法不会更改原来的函数，而是返回一个更改后的新函数；
     */
    before(fun:BeforeFun):this;

    /**
     * 增加 后置函数；
     * 即：在目标函数执行之后再执行函数 fun
     * @param fun : AfterFun   必须；后置函数；注意：目标函数的返回值 会作为 后置函数的第一个参数传入，后置函数的返回值 会作为整个函数最终的返回值
     * @return Function 返回一个新的函数，该函数已在目标函数后增加了后置函数
     *
     * 注意：
     * - 该方法不会更改原来的函数，而是返回一个更改后的新函数；
     */
    after(fun:AfterFun):this;

    /**
     * 包装目标函数；
     * 即：给当前函数（即：目标函数）分别增加 前置函数 before 和 后置函数 after
     * @param before ?: BeforeFun   可选；前置函数；注意：前置函数 返回了类数组中的每一个元素都会被作为 目标函数 的参数输入；如果 前置函数 返回 undefined | null 时，则不会更改目标函数的参数；
     * @param after ?: AfterFun   可选；后置函数；注意：目标函数的返回值 会作为 后置函数的第一个参数传入，后置函数的返回值 会作为整个函数最终的返回值
     * @return Function 返回一个新的函数，该函数已为目标函数增加了 前置函数 和 后置函数
     *
     * 注意：
     * - 该方法不会更改原来的函数，而是返回一个更改后的新函数；
     */
    wrap(before?:BeforeFun|null|undefined,after?:AfterFun|null|undefined):this;
}



/**
 * 增加 前置函数；
 * 即：在当前函数（即：目标函数）执行前优先执行的函数 fun
 * @param fun : BeforeFun   必须；前置函数；注意：前置函数 返回了类数组中的每一个元素都会被作为 目标函数 的参数输入；如果 前置函数 返回 undefined | null 时，则不会更改目标函数的参数；
 * @return Function 返回一个新的函数，该函数已在目标函数前增加了前置函数
 *
 * 注意：
 * - 该方法不会更改原来的函数，而是返回一个更改后的新函数；
 */
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





/**
 * 增加 后置函数；
 * 即：在目标函数执行之后再执行函数 fun
 * @param fun : AfterFun   必须；后置函数；注意：目标函数的返回值 会作为 后置函数的第一个参数传入，后置函数的返回值 会作为整个函数最终的返回值
 * @return Function 返回一个新的函数，该函数已在目标函数后增加了后置函数
 *
 * 注意：
 * - 该方法不会更改原来的函数，而是返回一个更改后的新函数；
 */
Function.prototype.after = function (fun) {
    var rawFun = this;
    return function () {
        // @ts-ignore
        var rawReturn = rawFun.apply(this,arguments);
        // @ts-ignore
        return  fun.call(this,rawReturn,...arguments);
    };
}




/**
 * 包装目标函数；
 * 即：给当前函数（即：目标函数）分别增加 前置函数 before 和 后置函数 after
 * @param before ?: BeforeFun   可选；前置函数；注意：前置函数 返回了类数组中的每一个元素都会被作为 目标函数 的参数输入；如果 前置函数 返回 undefined | null 时，则不会更改目标函数的参数；
 * @param after ?: AfterFun   可选；后置函数；注意：目标函数的返回值 会作为 后置函数的第一个参数传入，后置函数的返回值 会作为整个函数最终的返回值
 * @return Function 返回一个新的函数，该函数已为目标函数增加了 前置函数 和 后置函数
 *
 * 注意：
 * - 该方法不会更改原来的函数，而是返回一个更改后的新函数；
 */
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