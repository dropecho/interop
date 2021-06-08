package interop;

import massive.munit.Assert;
import dropecho.interop.AbstractFunc;

class Whatever {
	public var func2:Func_2<Int, Int, Int>;

	public function new() {}
}

class AbstractFuncTest {
	macro private static function testMacro() {
		var foo = "hello";

		return macro trace(foo);
	}

	@Test
	public function can_instantiate() {
		var m:Action_0 = () -> trace("hi");
		Assert.isNotNull(m);
	}

	@Test
	public function action0() {
		var val = 0;
		var m:Action_0 = () -> val += 1;
		m.call();

		// testMacro();
	}

	@Test
	public function action1() {
		var val = 0;
		var m:Action_1<Int> = (p1:Int) -> val += 1;
		m.call(1);
	}

	@Test
	public function func2() {
		var m = (a, b) -> a + b;
		var foo = new Whatever();
		foo.func2 = m;
		var r = foo.func2.call(1, 2);

		Assert.areEqual(r, 3);
	}
}
