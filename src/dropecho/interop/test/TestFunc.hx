package dropecho.interop.test;

import dropecho.interop.AbstractFunc;

@:expose("TestFunc")
class TestFunc<T1, T2, R> {
	public var Action0:Action_0;
	public var Action1:Action_1<T1>;
	public var Action2:Action_2<T1, T2>;
	public var Func0:Func_0<Int>;
	public var Func1:Func_1<Int, Int>;
	public var Func2:Func_2<T1, T2, Int>;

	function new() {
		Action0 = () -> trace("wee");
		// Action1 = (x:T1) -> trace("wee: " + x);
		// Action2 = (x:T1, y:T2) -> trace("wee: " + x + "," + y);

		Func0 = () -> 32;
    Func1 = (v:Int) -> return v;
		// Func2 = (v1:T1, v2:T2) -> return cast v1;
	}

	#if cs
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
		// Func0 = a;
	}

	function createFunc1(a:Func_1<T1, T1>) {
		// Func1 = a;
	}

	function createFunc2(a:Func_2<T1, T2, R>) {
		// Func2 = a;
	}
	#end
}
