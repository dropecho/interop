package dropecho.interop;

@:native("System.Action")
extern class Action__0 {
	public var Target(default, never):Dynamic;

	public function Invoke():Void;
}

@:native("System.Action")
extern class Action__1<T1> {
	public var Target(default, never):Dynamic;

	public function Invoke(p1:T1):Void;
}

@:native("System.Action")
extern class Action__2<T1, T2> {
	public var Target(default, never):Dynamic;

	public function Invoke(p1:T1, p2:T2):Void;
}

@:native('System.Func') extern class Func__0<R> {
	public var Target(default, never):Dynamic;

	public function Invoke():R;
}

@:native('System.Func') extern class Func__1<T1, R> {
	public var Target(default, never):Dynamic;

	public function Invoke(p1:T1):R;
}

@:native('System.Func') extern class Func__2<T1, T2, R> {
	public var Target(default, never):Dynamic;

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
		var invoker = this == null ? null : cs.Lib.as(this.Target, HaxeInvoker);
		return invoker == null ? call : cast invoker.haxeFunction();
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
		var invoker = this == null ? null : cs.Lib.as(this.Target, HaxeInvoker);
		return invoker == null ? call : cast invoker.haxeFunction();
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
		var invoker = this == null ? null : cs.Lib.as(this.Target, HaxeInvoker);
		return invoker == null ? call : cast invoker.haxeFunction();
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
		var invoker = this == null ? null : cs.Lib.as(this.Target, HaxeInvoker);
		return invoker == null ? call : cast invoker.haxeFunction();
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
		var invoker = this == null ? null : cs.Lib.as(this.Target, HaxeInvoker);
		return invoker == null ? call : cast invoker.haxeFunction();
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
		var invoker = this == null ? null : cs.Lib.as(this.Target, HaxeInvoker);
		return invoker == null ? call : cast invoker.haxeFunction();
	}

	@:op(a())
	inline function call(p1:T1, p2:T2):R {
		return this.Invoke(p1, p2);
	}
}

/**
Implemented by every invoker, so `toFunc` and `toAction` can find the Haxe function behind a delegate made by `fromHaxe`.
**/
@:nativeGen
@:noCompletion
interface HaxeInvoker {
	/**
	Gives back the wrapped function.

	@return The Haxe function the invoker calls.
	**/
	function haxeFunction():Dynamic;
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class ActionInvoker_0 implements HaxeInvoker {
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

	/**
	Gives back the wrapped function, so turning the delegate back into a Haxe function needs no new wrapper.

	@return The Haxe function this invoker calls.
	**/
	public function haxeFunction():Dynamic {
		return f;
	}
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class ActionInvoker_1<T1> implements HaxeInvoker {
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

	/**
	Gives back the wrapped function, so turning the delegate back into a Haxe function needs no new wrapper.

	@return The Haxe function this invoker calls.
	**/
	public function haxeFunction():Dynamic {
		return f;
	}
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class ActionInvoker_2<T1, T2> implements HaxeInvoker {
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

	/**
	Gives back the wrapped function, so turning the delegate back into a Haxe function needs no new wrapper.

	@return The Haxe function this invoker calls.
	**/
	public function haxeFunction():Dynamic {
		return f;
	}
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class FuncInvoker_0<R> implements HaxeInvoker {
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

	/**
	Gives back the wrapped function, so turning the delegate back into a Haxe function needs no new wrapper.

	@return The Haxe function this invoker calls.
	**/
	public function haxeFunction():Dynamic {
		return f;
	}
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class FuncInvoker_1<T1, R> implements HaxeInvoker {
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

	/**
	Gives back the wrapped function, so turning the delegate back into a Haxe function needs no new wrapper.

	@return The Haxe function this invoker calls.
	**/
	public function haxeFunction():Dynamic {
		return f;
	}
}

/**
Holds a Haxe function so `fromHaxe` can turn it into a delegate.
Calling through it avoids an argument array, reflection and `dynamic` on every call.
**/
@:nativeGen
@:noCompletion
class FuncInvoker_2<T1, T2, R> implements HaxeInvoker {
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

	/**
	Gives back the wrapped function, so turning the delegate back into a Haxe function needs no new wrapper.

	@return The Haxe function this invoker calls.
	**/
	public function haxeFunction():Dynamic {
		return f;
	}
}
