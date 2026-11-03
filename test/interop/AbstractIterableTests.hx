package interop;

import utest.Test;
import utest.Assert;
import haxe.ds.List;
import dropecho.interop.AbstractArray;
import dropecho.interop.AbstractIterable;

class AbstractIterableTests extends Test {
	function collect<T>(items:AbstractIterable<T>):Array<T> {
		return [for (item in items) item];
	}

	public function test_canConvertFromHaxeArray() {
		Assert.same([1, 2, 3], collect([1, 2, 3]));
	}

	public function test_canConvertFromHaxeList() {
		var list = new List<Int>();
		list.add(1);
		list.add(2);

		Assert.same([1, 2], collect(list));
	}

	public function test_canConvertFromAbstractArray() {
		var arr = new AbstractArray<Int>();
		arr.push(1);
		arr.push(2);

		Assert.same([1, 2], collect(arr));
	}

	public function test_empty() {
		Assert.same([], collect(new Array<Int>()));
	}

	public function test_hasNext_can_be_called_repeatedly() {
		var items:AbstractIterable<Int> = [1, 2];
		var it = items.iterator();

		Assert.isTrue(it.hasNext());
		Assert.isTrue(it.hasNext());
		Assert.equals(1, it.next());
		Assert.equals(2, it.next());
		Assert.isFalse(it.hasNext());
	}
}
