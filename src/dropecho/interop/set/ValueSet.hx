package dropecho.interop.set;

#if js
import dropecho.interop.AbstractFunc;
import js.lib.HaxeIterator;

/**
The JS backing of `AbstractSet` for every item type except enums.
Items are stored in a native JS `Map`: strings and numbers compare by value, objects by identity.
With a key function, items with the same key count as the same item instead.
**/
class ValueSet<T> {
	final key:Null<Func_1<T, Int>>;

	// Native `Map`, not `Set`, so a keyed set can find the stored item from its key.
	final items = new js.lib.Map<Any, T>();

	/**
	Creates an empty set.

	@param key Gives the key that identifies an item, such as its index or id. Without one, items compare as described above.
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
		var id = idOf(item);
		if (items.has(id)) {
			return false;
		}
		items.set(id, item);
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
		return items.has(idOf(item));
	}

	/**
	Removes the item equal to the given one.

	@param item The item to remove.
	@return True when an equal item was in the set.
	**/
	public function remove(item:T):Bool {
		return items.delete(idOf(item));
	}

	/** Removes every item. **/
	public function clear():Void {
		items.clear();
	}

	/**
	Counts the items.

	@return The number of items in the set.
	**/
	public function size():Int {
		return items.size;
	}

	/**
	Iterates the items in the order they were added.

	@return An iterator over the items.
	**/
	public function iterator():Iterator<T> {
		return new HaxeIterator(items.values());
	}

	/**
	Copies the items into a new array, in the order they were added.

	@return The new array.
	**/
	public function toArray():Array<T> {
		return [for (item in iterator()) item];
	}

	function idOf(item:T):Any {
		if (key == null) {
			return item;
		}
		return key(item);
	}
}
#end
