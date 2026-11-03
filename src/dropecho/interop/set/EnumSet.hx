package dropecho.interop.set;

#if js
import dropecho.interop.AbstractFunc;
import haxe.Constraints.IMap;
import haxe.ds.EnumValueMap;
import haxe.ds.IntMap;

/**
The JS backing of `AbstractSet` for enum items.
Items compare by value, so `Floor(1)` matches any other `Floor(1)`. With a key function, items with the same key count as the same item instead.
**/
class EnumSet<T:EnumValue> {
	final key:Null<Func_1<T, Int>>;

	// Keyed by the item itself (`EnumValueMap`), or by its key (`IntMap`).
	final items:IMap<Dynamic, T>;

	// `IMap` has no size, so the count is kept here.
	var count = 0;

	/**
	Creates an empty set.

	@param key Gives the key that identifies an item, such as its index or id. Without one, items compare by value.
	**/
	public function new(?key:Func_1<T, Int>) {
		this.key = key;
		if (key == null) {
			items = cast new EnumValueMap<T, T>();
		} else {
			items = cast new IntMap<T>();
		}
	}

	/**
	Adds an item, unless an equal item is already in the set.

	@param item The item to add.
	@return True when the item was added, false when an equal item was already there.
	**/
	public function add(item:T):Bool {
		var id = idOf(item);
		if (items.exists(id)) {
			return false;
		}
		items.set(id, item);
		count++;
		return true;
	}

	/**
	Adds each item, skipping items already in the set.

	@param newItems The items to add.
	**/
	public function addAll(newItems:Iterable<T>):Void {
		for (item in newItems) {
			add(item);
		}
	}

	/**
	Checks whether an equal item is in the set.

	@param item The item to look for.
	@return True when an equal item is in the set.
	**/
	public function exists(item:T):Bool {
		return items.exists(idOf(item));
	}

	/**
	Removes the item equal to the given one.

	@param item The item to remove.
	@return True when an equal item was in the set.
	**/
	public function remove(item:T):Bool {
		var removed = items.remove(idOf(item));
		if (removed) {
			count--;
		}
		return removed;
	}

	/** Removes every item. **/
	public function clear():Void {
		items.clear();
		count = 0;
	}

	/**
	Counts the items.

	@return The number of items in the set.
	**/
	public function size():Int {
		return count;
	}

	/**
	Iterates the items.

	@return An iterator over the items.
	**/
	public function iterator():Iterator<T> {
		return items.iterator();
	}

	/**
	Copies the items into a new array.

	@return The new array.
	**/
	public function toArray():Array<T> {
		return [for (item in items) item];
	}

	function idOf(item:T):Dynamic {
		if (key == null) {
			return item;
		}
		return key(item);
	}
}
#end
