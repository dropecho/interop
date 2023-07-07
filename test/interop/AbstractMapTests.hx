package interop;

import utest.Assert;
import dropecho.interop.AbstractMap;
import haxe.ds.StringMap;
import haxe.ds.IntMap;
import haxe.ds.ObjectMap;

typedef Point = {
	var x:Float;
	var y:Float;
}

class AbstractMapTests extends utest.Test {
	public function test_fromStringMap() {
		var m = new StringMap<Int>();
		m.set("test", 1);

		var am:AbstractMap<String, Int> = m;
		Assert.equals(m.get("test"), am["test"]);
	}

	public function test_fromIntMap() {
		var m = new IntMap<Int>();
		m.set(2, 1);

		var am:AbstractMap<Int, Int> = m;
		Assert.equals(m.get(2), am[2]);
	}

	public function test_fromObjectMap() {
		var obj = {x: 2.0, y: 2.0};
		var m = new ObjectMap<Point, Int>();
		m.set(obj, 1);

		var am:AbstractMap<Point, Int> = m;
		Assert.equals(m.get(obj), am[obj]);
	}

	public function test_fromMap() {
		var m = ["test" => 1];

		var am:AbstractMap<String, Int> = m;
		Assert.equals(m.get("test"), am["test"]);
	}

	public function test_fromNestedMap() {
		var inner:AbstractMap<String, Int> = ["bar" => 1];
		var m = ["test" => inner];

		var am:AbstractMap<String, AbstractMap<String, Int>> = m;
		Assert.equals(m.get("test"), am["test"]);
	}

	//
	//   public function test_fromNestedMap2() {
	//     var m = ["test" => ["bar" => 1]];
	//     var am:AbstractMap<String, AbstractMap<String, Int>> = m;
	//     Assert.equals(m.get("test"), am.get("test"));
	//   }
	#if js
	public function test_fromDynamic() {
		var obj:Dynamic = {'test': 1};

		var am:AbstractMap<String, Int> = obj;
		Assert.equals(obj.test, am['test']);
	}
	#end
}
