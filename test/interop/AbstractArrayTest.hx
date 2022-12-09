package interop;

import dropecho.interop.AbstractMap;
import massive.munit.Assert;
import dropecho.interop.AbstractArray;

class AbstractArrayTest {
	@Test
	public function can_instantiate() {
		var m = new AbstractArray<Int>();
		Assert.isNotNull(m);
	}

	@Test
	public function push() {
		var m = new AbstractArray<Int>();
		m.push(1);

		Assert.areEqual(1, m[0]);
	}

	@Test
	public function unshift() {
		var m = new AbstractArray<Int>();
		m.unshift(1);

		Assert.areEqual(1, m[0]);
	}

	@Test
	public function sort() {
		var m = new AbstractArray<Int>();
		m.unshift(1);
		m.unshift(2);

		m.sort((a, b) -> b - a);

		Assert.areEqual(2, m[0]);
	}

	@Test
	public function filter() {
		var m = new AbstractArray<Int>();
		m.unshift(1);
		m.unshift(2);

		m.filter((a) -> a == 2);

		Assert.areEqual(2, m[0]);
	}

	@Test
	public function canConvertFromHaxeArray() {
		var a:Array<Int> = [1, 2];
		var m:AbstractArray<Int> = a;

		Assert.areEqual(a[0], m[0]);
	}

	//   @Test
	//   public function canConvertFromHaxeArrayNested() {
	//     var a = [1, 2];
	//     var m:AbstractMap<String, AbstractArray<String>> = ["a" => a];
	//
	//     Assert.areEqual(a[0], m["a"][0]);
	//   }
}
