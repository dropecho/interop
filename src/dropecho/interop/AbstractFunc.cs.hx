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
		if (this == null) {
			return null;
		}
		var invoker = cs.Lib.as(this.Target, HaxeInvoker);
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
		if (this == null) {
			return null;
		}
		var invoker = cs.Lib.as(this.Target, HaxeInvoker);
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
		if (this == null) {
			return null;
		}
		var invoker = cs.Lib.as(this.Target, HaxeInvoker);
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
		if (this == null) {
			return null;
		}
		var invoker = cs.Lib.as(this.Target, HaxeInvoker);
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
		if (this == null) {
			return null;
		}
		var invoker = cs.Lib.as(this.Target, HaxeInvoker);
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
		if (this == null) {
			return null;
		}
		var invoker = cs.Lib.as(this.Target, HaxeInvoker);
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
Calls pass numbers in the closure's typed slots, without an argument array, reflection or `dynamic`.
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
	Calls the wrapped function. A delegate made from this method calls the Haxe function directly.
	**/
	#if dropecho_interop_unboxed
	@:functionCode('
		this.f.__hx_invoke0_o();
	')
	#end
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
Calls pass numbers in the closure's typed slots, without an argument array, reflection or `dynamic`.
**/
@:nativeGen
@:noCompletion
class ActionInvoker_1<T1> implements HaxeInvoker {
	final f:T1->Void;

	#if dropecho_interop_unboxed
	// Numeric arguments go in the closure's double slots, so they aren't boxed.
	// Not for method closures or generic closures, which box them anyway.
	final floatArgs:Bool;
	#end

	/**
	Wraps a Haxe function.

	@param f The function to call.
	**/
	public function new(f:T1->Void) {
		this.f = f;
		#if dropecho_interop_unboxed
		floatArgs = cs.Syntax.code('({0}.__fn_type >= 0 && !{0}.GetType().IsGenericType)', f);
		#end
	}

	/**
	Calls the wrapped function. A delegate made from this method calls the Haxe function directly.

	@param p1 Passed to the function.
	**/
	#if dropecho_interop_unboxed
	@:functionCode('
		double d1 = 0.0;
		object o1 = p1;
		if (this.floatArgs) {
			if (typeof(T1) == typeof(int)) { d1 = (int)(object)p1; o1 = global::haxe.lang.Runtime.undefined; }
			else if (typeof(T1) == typeof(double)) { d1 = (double)(object)p1; o1 = global::haxe.lang.Runtime.undefined; }
		}
		this.f.__hx_invoke1_o(d1, o1);
	')
	#end
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
Calls pass numbers in the closure's typed slots, without an argument array, reflection or `dynamic`.
**/
@:nativeGen
@:noCompletion
class ActionInvoker_2<T1, T2> implements HaxeInvoker {
	final f:(T1, T2)->Void;

	#if dropecho_interop_unboxed
	// Numeric arguments go in the closure's double slots, so they aren't boxed.
	// Not for method closures or generic closures, which box them anyway.
	final floatArgs:Bool;
	#end

	/**
	Wraps a Haxe function.

	@param f The function to call.
	**/
	public function new(f:(T1, T2)->Void) {
		this.f = f;
		#if dropecho_interop_unboxed
		floatArgs = cs.Syntax.code('({0}.__fn_type >= 0 && !{0}.GetType().IsGenericType)', f);
		#end
	}

	/**
	Calls the wrapped function. A delegate made from this method calls the Haxe function directly.

	@param p1 Passed to the function.
	@param p2 Passed to the function.
	**/
	#if dropecho_interop_unboxed
	@:functionCode('
		double d1 = 0.0;
		object o1 = p1;
		double d2 = 0.0;
		object o2 = p2;
		if (this.floatArgs) {
			if (typeof(T1) == typeof(int)) { d1 = (int)(object)p1; o1 = global::haxe.lang.Runtime.undefined; }
			else if (typeof(T1) == typeof(double)) { d1 = (double)(object)p1; o1 = global::haxe.lang.Runtime.undefined; }
			if (typeof(T2) == typeof(int)) { d2 = (int)(object)p2; o2 = global::haxe.lang.Runtime.undefined; }
			else if (typeof(T2) == typeof(double)) { d2 = (double)(object)p2; o2 = global::haxe.lang.Runtime.undefined; }
		}
		this.f.__hx_invoke2_o(d1, o1, d2, o2);
	')
	#end
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
Calls pass numbers in the closure's typed slots, without an argument array, reflection or `dynamic`.
**/
@:nativeGen
@:noCompletion
class FuncInvoker_0<R> implements HaxeInvoker {
	final f:Void->R;

	#if dropecho_interop_unboxed
	// The closure returns a double (its type is 1), so a numeric result isn't boxed.
	final floatReturn:Bool;
	#end

	/**
	Wraps a Haxe function.

	@param f The function to call.
	**/
	public function new(f:Void->R) {
		this.f = f;
		#if dropecho_interop_unboxed
		floatReturn = cs.Syntax.code('({0}.__fn_type == 1)', f);
		#end
	}

	/**
	Calls the wrapped function. A delegate made from this method calls the Haxe function directly.

	@return What the function returns.
	**/
	#if dropecho_interop_unboxed
	@:functionCode('
		if (this.floatReturn) {
			if (typeof(R) == typeof(int)) { return (R)(object)(int)this.f.__hx_invoke0_f(); }
			if (typeof(R) == typeof(double)) { return (R)(object)this.f.__hx_invoke0_f(); }
		}
		return global::haxe.lang.Runtime.genericCast<R>(this.f.__hx_invoke0_o());
	')
	#end
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
Calls pass numbers in the closure's typed slots, without an argument array, reflection or `dynamic`.
**/
@:nativeGen
@:noCompletion
class FuncInvoker_1<T1, R> implements HaxeInvoker {
	final f:T1->R;

	#if dropecho_interop_unboxed
	// Numeric arguments go in the closure's double slots, so they aren't boxed.
	// Not for method closures or generic closures, which box them anyway.
	final floatArgs:Bool;

	// The closure returns a double (its type is 1), so a numeric result isn't boxed.
	final floatReturn:Bool;
	#end

	/**
	Wraps a Haxe function.

	@param f The function to call.
	**/
	public function new(f:T1->R) {
		this.f = f;
		#if dropecho_interop_unboxed
		floatArgs = cs.Syntax.code('({0}.__fn_type >= 0 && !{0}.GetType().IsGenericType)', f);
		floatReturn = cs.Syntax.code('({0}.__fn_type == 1)', f);
		#end
	}

	/**
	Calls the wrapped function. A delegate made from this method calls the Haxe function directly.

	@param p1 Passed to the function.
	@return What the function returns.
	**/
	#if dropecho_interop_unboxed
	@:functionCode('
		double d1 = 0.0;
		object o1 = p1;
		if (this.floatArgs) {
			if (typeof(T1) == typeof(int)) { d1 = (int)(object)p1; o1 = global::haxe.lang.Runtime.undefined; }
			else if (typeof(T1) == typeof(double)) { d1 = (double)(object)p1; o1 = global::haxe.lang.Runtime.undefined; }
		}
		if (this.floatReturn) {
			if (typeof(R) == typeof(int)) { return (R)(object)(int)this.f.__hx_invoke1_f(d1, o1); }
			if (typeof(R) == typeof(double)) { return (R)(object)this.f.__hx_invoke1_f(d1, o1); }
		}
		return global::haxe.lang.Runtime.genericCast<R>(this.f.__hx_invoke1_o(d1, o1));
	')
	#end
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
Calls pass numbers in the closure's typed slots, without an argument array, reflection or `dynamic`.
**/
@:nativeGen
@:noCompletion
class FuncInvoker_2<T1, T2, R> implements HaxeInvoker {
	final f:(T1, T2)->R;

	#if dropecho_interop_unboxed
	// Numeric arguments go in the closure's double slots, so they aren't boxed.
	// Not for method closures or generic closures, which box them anyway.
	final floatArgs:Bool;

	// The closure returns a double (its type is 1), so a numeric result isn't boxed.
	final floatReturn:Bool;
	#end

	/**
	Wraps a Haxe function.

	@param f The function to call.
	**/
	public function new(f:(T1, T2)->R) {
		this.f = f;
		#if dropecho_interop_unboxed
		floatArgs = cs.Syntax.code('({0}.__fn_type >= 0 && !{0}.GetType().IsGenericType)', f);
		floatReturn = cs.Syntax.code('({0}.__fn_type == 1)', f);
		#end
	}

	/**
	Calls the wrapped function. A delegate made from this method calls the Haxe function directly.

	@param p1 Passed to the function.
	@param p2 Passed to the function.
	@return What the function returns.
	**/
	#if dropecho_interop_unboxed
	@:functionCode('
		double d1 = 0.0;
		object o1 = p1;
		double d2 = 0.0;
		object o2 = p2;
		if (this.floatArgs) {
			if (typeof(T1) == typeof(int)) { d1 = (int)(object)p1; o1 = global::haxe.lang.Runtime.undefined; }
			else if (typeof(T1) == typeof(double)) { d1 = (double)(object)p1; o1 = global::haxe.lang.Runtime.undefined; }
			if (typeof(T2) == typeof(int)) { d2 = (int)(object)p2; o2 = global::haxe.lang.Runtime.undefined; }
			else if (typeof(T2) == typeof(double)) { d2 = (double)(object)p2; o2 = global::haxe.lang.Runtime.undefined; }
		}
		if (this.floatReturn) {
			if (typeof(R) == typeof(int)) { return (R)(object)(int)this.f.__hx_invoke2_f(d1, o1, d2, o2); }
			if (typeof(R) == typeof(double)) { return (R)(object)this.f.__hx_invoke2_f(d1, o1, d2, o2); }
		}
		return global::haxe.lang.Runtime.genericCast<R>(this.f.__hx_invoke2_o(d1, o1, d2, o2));
	')
	#end
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
