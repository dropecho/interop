package interop;

import utest.Test;
import utest.Assert;
import dropecho.interop.AbstractFunc;

class AbstractFuncTests extends Test {
	//
	//   public function test_can_instantiate() {
	//     var m:Action_0 = () -> trace("hi");
	//     Assert.isNotNull(m);
	//   }
	//
	public function test_action0() {
		var val = 0;
		var m:Action_0 = () -> val += 1;
		m();

		Assert.equals(1, val);
	}

	public function test_action1() {
		var val = 0;
		var m:Action_1<Int> = (p1:Int) -> val += p1;
		m(1);

		Assert.equals(1, val);
	}

	public function test_action2() {
		var val = 0;
		var m:Action_2<Int, Int> = (p1:Int, p2:Int) -> val += p1 + p2;
		m(1, 1);

		Assert.equals(2, val);
	}

	public function test_func0() {
		var m:Func_0<Int> = () -> 1;
		var out = m();
		Assert.equals(1, out);
	}

	public function test_func1() {
		var m:Func_1<Int, Int> = (p:Int) -> p + 1;
		var out = m(2);
		Assert.equals(3, out);
	}

	public function test_func2() {
		var m:Func_2<Int, Int, Int> = (a, b) -> a + b;
		var out = m(1, 2);

		Assert.equals(out, 3);
	}
}
