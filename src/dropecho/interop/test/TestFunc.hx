package dropecho.interop.test;

import dropecho.interop.AbstractFunc;

@:expose("TestFunc")
@:generic
@:nativeGen
class TestFunc<T1, T2, R> {
	public var Action0:Action_0;
	public var Action1:Action_1<T1>;
	public var Action2:Action_2<T1, T2>;
	public var Func0:Func_0<R>;
	public var Func1:Func_1<T1, R>;
	public var Func2:Func_2<T1, T2, R>;

	function new() {
		Action0 = () -> trace("wee");
		Action1 = (x:T1) -> trace("wee: " + x);
		Action2 = (x:T1, y:T2) -> trace("wee: " + x + "," + y);

		Func0 = () -> return cast 32;
		Func1 = (v:T1) -> return cast v;
		Func2 = (v1:T1, v2:T2) -> return cast v2;
	}

	function createAction0(a:Action_0) {
		Action0 = a;
	}

	function createAction1(a:Action_1<T1>) {
		Action1 = a;
	}

	function createAction2(a:Action_2<T1, T2>) {
		Action2 = a;
	}

	function createFunc0(a:Func_0<R>) {
		Func0 = a;
	}

	function createFunc1(a:Func_1<T1, R>) {
		Func1 = a;
	}

	function createFunc2(a:Func_2<T1, T2, R>) {
		Func2 = a;
	}

	/**
	Turns a Haxe function into a delegate and back.

	@return True when the same Haxe function comes back, with no wrapper around it.
	**/
	public function func1RoundTripKeepsFunction():Bool {
		var original:T1->R = (v:T1) -> cast v;
		var delegate:Func_1<T1, R> = original;
		var back:T1->R = delegate;
		return back == original;
	}

	/**
	Turns an action into a delegate and back.

	@return True when the same Haxe function comes back, with no wrapper around it.
	**/
	public function action1RoundTripKeepsFunction():Bool {
		var original:T1->Void = (v:T1) -> {};
		var delegate:Action_1<T1> = original;
		var back:T1->Void = delegate;
		return back == original;
	}

	/**
	Calls `Func1` after turning it into a Haxe function, as Haxe code taking a plain function would.

	@param p1 Passed to `Func1`.
	@return What `Func1` returns.
	**/
	public function callFunc1AsHaxe(p1:T1):R {
		var fn:T1->R = Func1;
		return fn(p1);
	}
}
