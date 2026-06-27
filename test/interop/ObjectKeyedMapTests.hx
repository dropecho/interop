package interop;

import utest.Assert;
import dropecho.interop.ObjectKeyedMap;

private typedef Node = {id:Int};

class ObjectKeyedMapTests extends utest.Test {
	public function test_can_instantiate() {
		var m = new ObjectKeyedMap<Node, Bool>();
		Assert.notNull(m);
	}

	public function test_get_and_set_by_object() {
		var m = new ObjectKeyedMap<Node, Int>();
		var a:Node = {id: 1};

		m[a] = 10;
		Assert.equals(10, m[a]);
	}

	// The whole point: two distinct objects with the same shape are different
	// keys (this is what collided under AbstractMap's Std.string keying on JS).
	public function test_distinct_objects_same_shape_do_not_collide() {
		var m = new ObjectKeyedMap<Node, Int>();
		var a:Node = {id: 1};
		var b:Node = {id: 1};

		m[a] = 1;
		m[b] = 2;

		Assert.equals(1, m[a]);
		Assert.equals(2, m[b]);
	}

	public function test_exists_and_remove() {
		var m = new ObjectKeyedMap<Node, Int>();
		var a:Node = {id: 1};
		var b:Node = {id: 1};

		m[a] = 1;

		Assert.isTrue(m.exists(a));
		Assert.isFalse(m.exists(b));
		Assert.isTrue(m.remove(a));
		Assert.isFalse(m.exists(a));
	}

	public function test_keyValueIterator() {
		var m = new ObjectKeyedMap<Node, Int>();
		var a:Node = {id: 1};
		var b:Node = {id: 2};

		m[a] = 10;
		m[b] = 20;

		var sum = 0;
		for (k => v in m.keyValueIterator()) {
			sum += v;
		}

		Assert.equals(30, sum);
	}

	public function test_keys() {
		var m = new ObjectKeyedMap<Node, Int>();
		var a:Node = {id: 1};
		var b:Node = {id: 2};

		m[a] = 10;
		m[b] = 20;

		var count = 0;
		for (k in m.keys()) {
			count++;
		}

		Assert.equals(2, count);
	}
}
