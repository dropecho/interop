package interop;

import massive.munit.Assert;
import dropecho.interop.AbstractMap;
import haxe.ds.StringMap;
import haxe.ds.IntMap;
import haxe.ds.ObjectMap;

typedef Point = {
	var x:Float;
	var y:Float;
}

class AbstractMapTest {
	@Before
	public function setup() {}

	@Test
	public function fromStringMap() {
		var m = new StringMap<Int>();
		m.set("test", 1);

		var am:AbstractMap<String, Int> = m;
		Assert.areEqual(m.get("test"), am["test"]);
	}

	@Test
	public function fromIntMap() {
		var m = new IntMap<Int>();
		m.set(2, 1);

		var am:AbstractMap<Int, Int> = m;
		Assert.areEqual(m.get(2), am[2]);
	}

	@Test
	public function fromObjectMap() {
		var obj = {x: 2.0, y: 2.0};
		var m = new ObjectMap<Point, Int>();
		m.set(obj, 1);

		var am:AbstractMap<Point, Int> = m;
		Assert.areEqual(m.get(obj), am[obj]);
	}

	@Test
	public function fromDynamic() {
		var obj:Dynamic = {'test': 1};

		var am:AbstractMap<String, Int> = obj;
		Assert.areEqual(obj.test, am['test']);
	}
}
