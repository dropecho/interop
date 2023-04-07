package interop;

import massive.munit.Assert;
import dropecho.interop.AbstractFunc;

class AbstractFuncTest {
	//   @Test
	//   public function can_instantiate() {
	//     var m:Action_0 = () -> trace("hi");
	//     Assert.isNotNull(m);
	//   }
	//
	@Test
	public function action0() {
		var val = 0;
		var m:Action_0 = () -> val += 1;
		m();

		Assert.areEqual(1, val);
	}

	@Test
	public function action1() {
		var val = 0;
		var m:Action_1<Int> = (p1:Int) -> val += p1;
		m(1);

		Assert.areEqual(1, val);
	}

	@Test
	public function action2() {
		var val = 0;
		var m:Action_2<Int, Int> = (p1:Int, p2:Int) -> val += p1 + p2;
		m(1, 1);

		Assert.areEqual(2, val);
	}

	@Test
	public function func0() {
		var m:Func_0<Int> = () -> 1;
		var out = m();
		Assert.areEqual(1, out);
	}

	@Test
	public function func1() {
		var m:Func_1<Int, Int> = (p:Int) -> p + 1;
		var out = m(2);
		Assert.areEqual(3, out);
	}

	@Test
	public function func2() {
		var m:Func_2<Int, Int, Int> = (a, b) -> a + b;
		var out = m(1, 2);

		Assert.areEqual(out, 3);
	}
}
