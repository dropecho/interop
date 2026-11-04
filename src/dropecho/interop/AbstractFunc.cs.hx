package dropecho.interop;

@:native("System.Action")
extern class Action__0 {
	public function Invoke():Void;
}

@:native("System.Action")
extern class Action__1<T1> {
	public function Invoke(p1:T1):Void;
}

@:native("System.Action")
extern class Action__2<T1, T2> {
	public function Invoke(p1:T1, p2:T2):Void;
}

@:native('System.Func') extern class Func__0<R> {
	public function Invoke():R;
}

@:native('System.Func') extern class Func__1<T1, R> {
	public function Invoke(p1:T1):R;
}

@:native('System.Func') extern class Func__2<T1, T2, R> {
	public function Invoke(p1:T1, p2:T2):R;
}

@:dce
@:generic
@:nativeGen
abstract Action_0(Action__0) from Action__0 {
	@:from
	public static inline function fromHaxe(f:Void->Void):Action_0 {
		return cs.Syntax.code('{0}.invoke', new ActionInvoker_0(f));
	}

	@:to public inline function toAction():Void->Void {
		return call;
	}

	@:op(a())
	inline function call():Void {
		return this.Invoke();
	}
}

@:dce
@:generic
@:nativeGen
abstract Action_1<T1>(Action__1<T1>) from Action__1<T1> {
	@:from
	public static inline function fromHaxe<T1>(f:T1->Void):Action_1<T1> {
		return cs.Syntax.code('{0}.invoke', new ActionInvoker_1(f));
	}

	@:to public inline function toAction():T1->Void {
		return call;
	}

	@:op(a())
	inline function call(p1:T1):Void {
		return this.Invoke(p1);
	}
}

@:dce
@:generic
@:nativeGen
abstract Action_2<T1, T2>(Action__2<T1, T2>) from Action__2<T1, T2> {
	@:from
	public static inline function fromHaxe<T1, T2>(f:T1->T2->Void):Action_2<T1, T2> {
		return cs.Syntax.code('{0}.invoke', new ActionInvoker_2(f));
	}

	@:to public inline function toAction():(T1, T2) -> Void {
		return call;
	}

	@:op(a())
	inline function call(p1:T1, p2:T2):Void {
		this.Invoke(p1, p2);
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_0<R>(Func__0<R>) from Func__0<R> {
	@:from
	public static inline function fromHaxe<R>(f:Void->R):Func_0<R> {
		return cs.Syntax.code('{0}.invoke', new FuncInvoker_0(f));
	}

	@:to public inline function toFunc():Void->R {
		return call;
	}

	@:op(a())
	inline function call():R {
		return this.Invoke();
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_1<T1, R>(Func__1<T1, R>) from Func__1<T1, R> {
	@:from
	public static inline function fromHaxe<T1, R>(f:T1->R):Func_1<T1, R> {
		return cs.Syntax.code('{0}.invoke', new FuncInvoker_1(f));
	}

	@:to public inline function toFunc():T1->R {
		return call;
	}

	@:op(a())
	inline function call(p1:T1):R {
		return this.Invoke(p1);
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_2<T1, T2, R>(Func__2<T1, T2, R>) from Func__2<T1, T2, R> {
	@:from
	public static inline function fromHaxe<T1, T2, R>(f:T1->T2->R):Func_2<T1, T2, R> {
		return cs.Syntax.code('{0}.invoke', new FuncInvoker_2(f));
	}

	@:to public inline function toFunc():(T1, T2) -> R {
		return call;
	}

	@:op(a())
	inline function call(p1:T1, p2:T2):R {
		return this.Invoke(p1, p2);
	}
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class ActionInvoker_0 {
	final f:Void->Void;

	/**
	Wraps a Haxe function.

	@param f The function to call.
	**/
	public function new(f:Void->Void) {
		this.f = f;
	}

	/**
	Calls the wrapped function. A delegate made from this method calls the Haxe function with typed arguments.
	**/
	public function invoke():Void {
		f();
	}
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class ActionInvoker_1<T1> {
	final f:T1->Void;

	/**
	Wraps a Haxe function.

	@param f The function to call.
	**/
	public function new(f:T1->Void) {
		this.f = f;
	}

	/**
	Calls the wrapped function. A delegate made from this method calls the Haxe function with typed arguments.

	@param p1 Passed to the function.
	**/
	public function invoke(p1:T1):Void {
		f(p1);
	}
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class ActionInvoker_2<T1, T2> {
	final f:(T1, T2)->Void;

	/**
	Wraps a Haxe function.

	@param f The function to call.
	**/
	public function new(f:(T1, T2)->Void) {
		this.f = f;
	}

	/**
	Calls the wrapped function. A delegate made from this method calls the Haxe function with typed arguments.

	@param p1 Passed to the function.
	@param p2 Passed to the function.
	**/
	public function invoke(p1:T1, p2:T2):Void {
		f(p1, p2);
	}
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class FuncInvoker_0<R> {
	final f:Void->R;

	/**
	Wraps a Haxe function.

	@param f The function to call.
	**/
	public function new(f:Void->R) {
		this.f = f;
	}

	/**
	Calls the wrapped function. A delegate made from this method calls the Haxe function with typed arguments.

	@return What the function returns.
	**/
	public function invoke():R {
		return f();
	}
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class FuncInvoker_1<T1, R> {
	final f:T1->R;

	/**
	Wraps a Haxe function.

	@param f The function to call.
	**/
	public function new(f:T1->R) {
		this.f = f;
	}

	/**
	Calls the wrapped function. A delegate made from this method calls the Haxe function with typed arguments.

	@param p1 Passed to the function.
	@return What the function returns.
	**/
	public function invoke(p1:T1):R {
		return f(p1);
	}
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class FuncInvoker_2<T1, T2, R> {
	final f:(T1, T2)->R;

	/**
	Wraps a Haxe function.

	@param f The function to call.
	**/
	public function new(f:(T1, T2)->R) {
		this.f = f;
	}

	/**
	Calls the wrapped function. A delegate made from this method calls the Haxe function with typed arguments.

	@param p1 Passed to the function.
	@param p2 Passed to the function.
	@return What the function returns.
	**/
	public function invoke(p1:T1, p2:T2):R {
		return f(p1, p2);
	}
}
