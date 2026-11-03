package dropecho.interop;

import dropecho.interop.AbstractFunc;

/**
A set of unique items, with an optional key function that decides which items are equal.
This is the fallback for targets without their own version (JS and C# have one). It searches a plain array, so each operation takes time proportional to the set's size.
**/
class AbstractSet<T> {
	final key:Null<Func_1<T, Int>>;
	final items:Array<T> = [];

	/**
	Creates an empty set.

	@param key Gives the key that identifies an item, such as its index or id. Without one, items compare with `==`.
	**/
	public function new(?key:Func_1<T, Int>) {
		this.key = key;
	}

	/**
	Adds an item, unless an equal item is already in the set.

	@param item The item to add.
	@return True when the item was added, false when an equal item was already there.
	**/
	public function add(item:T):Bool {
		if (exists(item)) {
			return false;
		}
		items.push(item);
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
		return indexOf(item) >= 0;
	}

	/**
	Removes the item equal to the given one.

	@param item The item to remove.
	@return True when an equal item was in the set.
	**/
	public function remove(item:T):Bool {
		var index = indexOf(item);
		if (index < 0) {
			return false;
		}
		items.splice(index, 1);
		return true;
	}

	/** Removes every item. **/
	public function clear():Void {
		items.resize(0);
	}

	/**
	Counts the items.

	@return The number of items in the set.
	**/
	public function size():Int {
		return items.length;
	}

	/**
	Iterates the items in the order they were added.

	@return An iterator over the items.
	**/
	public function iterator():Iterator<T> {
		return items.iterator();
	}

	/**
	Copies the items into a new array, in the order they were added.

	@return The new array.
	**/
	public function toArray():Array<T> {
		return items.copy();
	}

	function indexOf(item:T):Int {
		for (index => stored in items) {
			var isEqual = key == null ? stored == item : key(stored) == key(item);
			if (isEqual) {
				return index;
			}
		}
		return -1;
	}
}
