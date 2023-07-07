package interop;

import utest.Assert;
import utest.Test;
import dropecho.interop.Extender;
import haxe.Json;
import haxe.DynamicAccess;

class ExClassTest {
	public var x:Int = 1;
	public var y:Int = 1;

	public function test_new(?opts:Dynamic = null) {
		Extender.defaults(this, opts);
	}
}

typedef Complicated = {
	var int:Int;
	var str:String;
	var dy:Dynamic;
	var dyarr:Array<Dynamic>;
	var arr:Array<Int>;
	var map:Map<String, Int>;
	var sub:Complicated;
}

class ExtenderTests extends Test {
	var base:Dynamic;
	var ex:Dynamic;

	var complicated:Dynamic;

	public function new() {
		base = {x: 0, y: {z: 0}, a: {b: 0}};
		ex = {
			x: 1,
			y: {z: 1},
			a: {c: 0},
			add: 1
		};

		complicated = {
			x: 0,
			y: 0,
			stuff: [{x: 0}, {x: 1}],
			bar: ['x' => 1, 'y' => 1]
		};
	}

	public function test_test_extender_should_set_simple_field_on_base() {
		Extender.defaults(base, ex);
		Assert.equals(1, base.x);
	}

	public function test_test_extender_should_set_object_field_on_base() {
		Extender.defaults(base, ex);
		Assert.equals(1, base.y.z);
	}

	public function test_test_extender_should_add_simple_field_on_base() {
		Extender.defaults(base, ex);
		Assert.equals(1, base.add);
	}

	public function test_test_extender_should_not_overwrite_existing_field_on_subobject_when_extension_does_not_have_field() {
		Extender.defaults(base, ex);
		Assert.equals(0, base.a.b);
	}

	public function test_test_extender_should_add_non_existing_field_on_subobject_when_extension_has_field() {
		Extender.defaults(base, ex);
		Assert.equals(0, base.a.c);
	}

	public function test_test_extender_should_handle_null_extension_object() {
		var good = false;
		try {
			Extender.defaults(base, null);
			good = true;
		} catch (e:Dynamic) {
			good = false;
		}

		Assert.isTrue(good);
	}

	public function test_test_extender_should_handle_null_base_object() {
		var good = false;
		try {
			Extender.defaults(null, ex);
			good = false;
		} catch (e:Dynamic) {
			// trace("exception", e);
			good = true;
		}

		Assert.isTrue(good);
	}

	public function test_test_extender_should_extend_all_for_empty_base_object() {
		var base:Dynamic = {};
		var empty = Extender.defaults(base, ex);

		Assert.equals(ex.x, empty.x);
		// Assert.equals(ex.y, empty.y);
		Assert.equals(ex.y.z, empty.y.z);
		Assert.equals(ex.a.c, empty.a.c);
		Assert.equals(ex.add, empty.add);
	}

	public function test_test_extender_should_extend_by_multiple_extensions() {
		var base:Dynamic = {};
		var ex:Array<Dynamic> = [{x: 1}, {y: 2}];
		var empty = Extender.defaults(base, ex);

		Assert.equals(1, empty.x);
		Assert.equals(2, empty.y);
	}

	public function test_test_extender_should_deal_with_arrays() {
		var base:Dynamic = {};
		var ex:Array<Dynamic> = [{}, complicated];
		var empty = Extender.defaults(base, ex);

		Assert.equals(complicated.x, empty.x);
		Assert.equals(complicated.y, empty.y);
		Assert.equals(complicated.stuff[0].x, empty.stuff[0].x);
	}

	public function test_null_opts_should_function() {
		var test = new ExClassTest();

		Assert.equals(1, test.x);
		Assert.equals(1, test.y);
	}

	public function test_opts_should_function() {
		var test = new ExClassTest({y: 2});

		Assert.equals(1, test.x);
		Assert.equals(2, test.y);
	}

	// typedef Complicated = {
	//   var int:Int;
	//   var str:String;
	//   var dy:Dynamic;
	//   var dyarr:Array<Dynamic>;
	//   var arr:Array<Int>;
	//   var map:Map<String, Int>;
	//   var sub:Sub;
	// }

	public function test_complicated_should_work() {
		var expected = {
			int: 1,
			str: "Hi",
			dy: {x: 1},
			dyarr: [{x: 1}, {x: 2}],
			arr: [1, 2, 3],
			map: ['x' => 1, 'y' => 2],
			sub: null
		};

		var base:Dynamic = {};
		var out = Extender.defaults(base, expected);
	}

	public function test_nested_complicated_should_work() {
		var expected = {
			int: 1,
			str: "Hi",
			dy: {x: 1},
			dyarr: [{x: 1}, {x: 2}],
			arr: [1, 2, 3],
			map: ['x' => 1, 'y' => 2],
			sub: {
				int: 1,
				str: "Hi",
				dy: {x: 1},
				dyarr: [{x: 1}, {x: 2}],
				arr: [1, 2, 3],
				map: ['x' => 1, 'y' => 2],
			}
		};

		var base:Dynamic = {};
		var out = Extender.defaults(base, expected);

		// trace(expected);
		// trace(out);
		// trace(expected.map.get('x'));
		// trace(out.map.get('x'));

		// checkEquality(expected, out);
	}

	public function test_checkEquality(ex:Dynamic, out:Dynamic) {
		for (f in Reflect.fields(ex)) {
			var exVal = Reflect.field(ex, f);
			var outVal = Reflect.field(out, f);
			// if (exVal != null) {
			//   Assert.isNotNull(outVal);
			// }
			if (Std.is(exVal, Array)) {
				if (Reflect.isObject(exVal[0])) {
					checkEquality(exVal[0], outVal[0]);
				} else {
					Assert.equals(exVal[0], outVal[0]);
				}
			} else if (Reflect.isObject(exVal) && Reflect.isObject(outVal)) {
				checkEquality(exVal, outVal);
			} else {
				Assert.equals(exVal, outVal);
			}
		}
	}
}
