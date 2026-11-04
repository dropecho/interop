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

private class Node {
	public var id:Int;

	public function new(id:Int) {
		this.id = id;
	}
}

private enum Cell {
	Wall;
	Floor(height:Int);
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

	public function test_missing_key_is_null() {
		var m = new AbstractMap<String, Int>();

		Assert.isNull(m["missing"]);
		Assert.isFalse(m.exists("missing"));
	}

	public function test_remove_string_key() {
		var m = new AbstractMap<String, Int>();
		m["a"] = 1;

		Assert.isTrue(m.remove("a"));
		Assert.isFalse(m.remove("a"));
		Assert.isFalse(m.exists("a"));
	}

	public function test_clear() {
		var m = new AbstractMap<String, Int>();
		m["a"] = 1;
		m["b"] = 2;

		m.clear();

		Assert.isFalse(m.exists("a"));
		Assert.isFalse(m.exists("b"));
	}

	public function test_copy_is_independent() {
		var m = new AbstractMap<String, Int>();
		m["a"] = 1;

		var copied = m.copy();
		copied["a"] = 2;

		Assert.equals(1, m["a"]);
		Assert.equals(2, copied["a"]);
	}

	public function test_copy_keeps_keys_for_every_key_kind() {
		var ints = new AbstractMap<Int, String>();
		ints[1] = "a";
		var cells = new AbstractMap<Cell, Int>();
		cells[Floor(1)] = 1;
		var node = new Node(1);
		var nodes = new AbstractMap<Node, Int>();
		nodes[node] = 1;

		Assert.equals("a", ints.copy()[1]);
		Assert.equals(1, cells.copy()[Floor(1)]);
		Assert.equals(1, nodes.copy()[node]);
	}

	public function test_values_iterator() {
		var m = new AbstractMap<String, Int>();
		m["a"] = 1;
		m["b"] = 2;

		var sum = 0;
		for (value in m) {
			sum += value;
		}

		Assert.equals(3, sum);
	}

	// Built-in object names like `constructor` must not leak through on JS.
	public function test_builtin_object_names_are_not_keys() {
		var m = new AbstractMap<String, Int>();

		Assert.isNull(m["constructor"]);
		Assert.isNull(m["toString"]);
		Assert.isFalse(m.exists("constructor"));
	}

	public function test_proto_is_an_ordinary_key() {
		var m = new AbstractMap<String, Int>();
		m["__proto__"] = 1;
		m["a"] = 2;

		Assert.isTrue(m.exists("__proto__"));
		Assert.equals(1, m["__proto__"]);
		Assert.equals(2, m["a"]);
		Assert.equals(2, [for (key in m.keys()) key].length);
	}

	public function test_haxe_internal_names_are_ordinary_keys() {
		var m = new AbstractMap<String, Int>();
		m["__id__"] = 1;
		m["hx__closures__"] = 2;

		var keys = [for (key in m.keys()) key];
		keys.sort(Reflect.compare);
		Assert.same(["__id__", "hx__closures__"], keys);
		var sum = 0;
		for (value in m) {
			sum += value;
		}
		Assert.equals(3, sum);
		Assert.equals(2, [for (key in m.copy().keys()) key].length);
	}

	public function test_int_keys_come_back_as_ints() {
		var m = new AbstractMap<Int, String>();
		m[1] = "a";

		for (key => value in m) {
			Assert.equals(2, key + 1);
			Assert.equals("a", value);
		}
		for (key in m.keys()) {
			Assert.equals(2, key + 1);
		}
	}

	public function test_remove_int_key() {
		var m = new AbstractMap<Int, String>();
		m[1] = "a";

		Assert.isTrue(m.remove(1));
		Assert.isFalse(m.exists(1));
	}

	public function test_float_keys_come_back_as_floats() {
		var m = new AbstractMap<Float, String>();
		m[1.5] = "a";

		for (key in m.keys()) {
			Assert.floatEquals(3.0, key * 2);
		}
		Assert.equals("a", m[1.5]);
	}

	public function test_object_keys_with_equal_fields_do_not_collide() {
		var m = new AbstractMap<Node, Int>();
		var a = new Node(1);
		var b = new Node(1);

		m[a] = 1;
		m[b] = 2;

		Assert.equals(1, m[a]);
		Assert.equals(2, m[b]);
		Assert.equals(2, [for (key in m.keys()) key].length);
	}

	public function test_object_keys_exists_and_remove() {
		var m = new AbstractMap<Node, Int>();
		var a = new Node(1);
		var b = new Node(1);
		m[a] = 1;

		Assert.isTrue(m.exists(a));
		Assert.isFalse(m.exists(b));
		Assert.isTrue(m.remove(a));
		Assert.isFalse(m.exists(a));
	}

	public function test_object_keys_come_back_as_the_same_objects() {
		var m = new AbstractMap<Node, Int>();
		var a = new Node(1);
		m[a] = 10;

		for (key => value in m) {
			Assert.equals(a, key);
			Assert.equals(10, value);
		}
	}

	public function test_anonymous_object_keys_do_not_collide() {
		var m = new AbstractMap<Point, Int>();
		var a:Point = {x: 1, y: 1};
		var b:Point = {x: 1, y: 1};

		m[a] = 1;
		m[b] = 2;

		Assert.equals(1, m[a]);
		Assert.equals(2, m[b]);
	}

	public function test_enum_keys_compare_by_value() {
		var m = new AbstractMap<Cell, Int>();
		m[Floor(1)] = 1;
		m[Floor(1)] = 2;
		m[Wall] = 3;

		Assert.equals(2, m[Floor(1)]);
		Assert.equals(3, m[Wall]);
		Assert.isFalse(m.exists(Floor(2)));
	}

	public function test_enum_keys_come_back_as_enum_values() {
		var m = new AbstractMap<Cell, Int>();
		m[Floor(4)] = 1;

		for (key in m.keys()) {
			var height = switch key {
				case Floor(h): h;
				case Wall: -1;
			}
			Assert.equals(4, height);
		}
	}

	#if js
	public function test_fromDynamic() {
		var obj:Dynamic = {'test': 1};

		var am:AbstractMap<String, Int> = obj;
		Assert.equals(obj.test, am['test']);
	}

	public function test_string_map_is_a_plain_object() {
		var m = new AbstractMap<String, Int>();
		m["a"] = 1;

		Assert.equals(1, Reflect.field(m, "a"));
		Assert.equals('{"a":1}', haxe.Json.stringify(m));
	}

	public function test_int_map_is_a_plain_object() {
		var m = new AbstractMap<Int, String>();
		m[1] = "a";

		Assert.equals('{"1":"a"}', haxe.Json.stringify(m));
	}

	public function test_object_keyed_map_is_a_native_map() {
		var m = new AbstractMap<Node, Int>();

		Assert.isTrue(Std.isOfType(m, js.lib.Map));
	}

	// A generic key type can't be checked while compiling, so it stays a plain object.
	public function test_generic_key_map_is_a_plain_object() {
		var m:AbstractMap<String, Int> = cast makeGenericMap();
		m["a"] = 1;

		Assert.equals(1, Reflect.field(m, "a"));
	}

	static function makeGenericMap<K, V>():AbstractMap<K, V> {
		return new AbstractMap<K, V>();
	}
	#end
}
