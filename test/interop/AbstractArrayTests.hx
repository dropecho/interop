package interop;

import utest.Test;
import utest.Assert;
import dropecho.interop.AbstractArray;

class AbstractArrayTests extends Test {
	public function test_can_instantiate() {
		var m = new AbstractArray<Int>();
		Assert.notNull(m);
	}

	public function test_push() {
		var m = new AbstractArray<Int>();
		m.push(1);

		Assert.equals(1, m[0]);
	}

	public function test_unshift() {
		var m = new AbstractArray<Int>();
		m.unshift(1);

		Assert.equals(1, m[0]);
	}

	public function test_sort() {
		var m = new AbstractArray<Int>();
		m.unshift(1);
		m.unshift(2);

		m.sort((a, b) -> b - a);

		Assert.equals(2, m[0]);
	}

	public function test_filter() {
		var m = new AbstractArray<Int>();
		m.unshift(1);
		m.unshift(2);

		m.filter((a) -> a == 2);

		Assert.equals(2, m[0]);
	}

	public function test_canConvertFromHaxeArray() {
		var a:Array<Int> = [1, 2];
		var m:AbstractArray<Int> = a;

		Assert.equals(a[0], m[0]);
	}

	//
	//   public function test_canConvertFromHaxeArrayNested() {
	//     var a = [1, 2];
	//     var m:AbstractMap<String, AbstractArray<String>> = ["a" => a];
	//
	//     Assert.areEqual(a[0], m["a"][0]);
	//   }
}
