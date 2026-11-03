package interop;

import utest.Assert;
import dropecho.interop.AbstractSet;

private class Item {
	public var id:Int;

	public function new(id:Int) {
		this.id = id;
	}
}

private typedef Tile = {
	var x:Int;
	var y:Int;
}

private enum Cell {
	Wall;
	Floor(height:Int);
}

class AbstractSetTests extends utest.Test {
	static inline final MAP_WIDTH = 100;

	public function test_add_reports_whether_the_item_was_new() {
		var s = new AbstractSet<String>();

		Assert.isTrue(s.add("a"));
		Assert.isFalse(s.add("a"));
		Assert.equals(1, s.size());
	}

	public function test_exists() {
		var s = new AbstractSet<String>();
		s.add("a");

		Assert.isTrue(s.exists("a"));
		Assert.isFalse(s.exists("b"));
	}

	public function test_remove() {
		var s = new AbstractSet<Int>();
		s.add(1);

		Assert.isTrue(s.remove(1));
		Assert.isFalse(s.remove(1));
		Assert.isFalse(s.exists(1));
		Assert.equals(0, s.size());
	}

	public function test_clear() {
		var s = new AbstractSet<Int>();
		s.add(1);
		s.add(2);

		s.clear();

		Assert.equals(0, s.size());
		Assert.isFalse(s.exists(1));
	}

	public function test_iterates_every_item() {
		var s = new AbstractSet<Int>();
		s.add(1);
		s.add(2);
		s.add(3);

		var sum = 0;
		for (item in s) {
			sum += item;
		}

		Assert.equals(6, sum);
	}

	public function test_toArray_and_addAll() {
		var s = new AbstractSet<String>();
		s.addAll(["a", "b", "a"]);
		var items = s.toArray();
		items.sort(Reflect.compare);

		Assert.same(["a", "b"], items);
	}

	// The old dropecho.ds Set treated these as the same item because their hashes matched.
	public function test_floats_that_round_to_the_same_int_are_different_items() {
		var s = new AbstractSet<Float>();
		s.add(1.2);

		Assert.isFalse(s.exists(1.7));
		Assert.isTrue(s.add(1.7));
	}

	public function test_strings_with_the_same_hash_are_different_items() {
		var s = new AbstractSet<String>();
		s.add("Aa");

		Assert.isFalse(s.exists("BB"));
		Assert.isTrue(s.add("BB"));
	}

	public function test_objects_compare_by_identity() {
		var s = new AbstractSet<Item>();
		var a = new Item(1);
		s.add(a);

		Assert.isTrue(s.exists(a));
		Assert.isFalse(s.exists(new Item(1)));
		Assert.isTrue(s.add(new Item(1)));
	}

	public function test_adding_does_not_change_the_item() {
		var s = new AbstractSet<Tile>();
		var tile:Tile = {x: 1, y: 2};
		s.add(tile);

		var fields = Reflect.fields(tile);
		fields.sort(Reflect.compare);
		Assert.same(["x", "y"], fields);
	}

	public function test_enums_compare_by_value() {
		var s = new AbstractSet<Cell>();
		s.add(Floor(1));

		Assert.isTrue(s.exists(Floor(1)));
		Assert.isFalse(s.add(Floor(1)));
		Assert.isFalse(s.exists(Floor(2)));
		Assert.isTrue(s.add(Wall));
		Assert.equals(2, s.size());
	}

	public function test_key_function_makes_items_with_the_same_key_equal() {
		var s = new AbstractSet<Tile>(tileIndex);
		s.add({x: 1, y: 2});

		Assert.isTrue(s.exists({x: 1, y: 2}));
		Assert.isFalse(s.add({x: 1, y: 2}));
		Assert.isFalse(s.exists({x: 2, y: 1}));
		Assert.isTrue(s.remove({x: 1, y: 2}));
		Assert.equals(0, s.size());
	}

	public function test_key_function_keeps_the_first_item_added() {
		var s = new AbstractSet<Tile>(tileIndex);
		var first:Tile = {x: 1, y: 2};
		s.add(first);
		s.add({x: 1, y: 2});

		for (item in s) {
			Assert.equals(first, item);
		}
	}

	public function test_key_function_works_with_enums() {
		var s = new AbstractSet<Cell>(cell -> switch cell {
			case Wall: 0;
			case Floor(_): 1;
		});
		s.add(Floor(1));

		Assert.isTrue(s.exists(Floor(5)));
		Assert.isFalse(s.exists(Wall));
	}

	public function test_addAll_with_key_function() {
		var s = new AbstractSet<Tile>(tileIndex);
		s.addAll([{x: 1, y: 1}, {x: 1, y: 1}, {x: 2, y: 2}]);

		Assert.equals(2, s.size());
	}

	public function test_generic_item_type() {
		var s = makeGenericSet([1, 2, 2]);

		Assert.equals(2, s.size());
	}

	static function makeGenericSet<T>(items:Array<T>):AbstractSet<T> {
		var s = new AbstractSet<T>();
		s.addAll(items);
		return s;
	}

	static function tileIndex(tile:Tile):Int {
		return tile.y * MAP_WIDTH + tile.x;
	}
}
