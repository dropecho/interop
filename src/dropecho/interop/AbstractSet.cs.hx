package dropecho.interop;

import cs.Lib;
import cs.NativeArray;
import cs.system.collections.generic.HashSet_1;
import cs.system.collections.generic.IEqualityComparer_1;
import dropecho.interop.AbstractFunc;

/**
A set of unique items: a native `HashSet<T>` in C#.
Items compare with their own `Equals`, or, with a key function, by their key.
**/
@:forward
@:nativeGen
abstract AbstractSet<T>(HashSet_1<T>) from HashSet_1<T> to HashSet_1<T> {
	/**
	Creates an empty set.

	@param key Gives the key that identifies an item, such as its index or id. Without one, items compare with `Equals`.
	**/
	public inline function new(?key:Func_1<T, Int>) {
		if (key == null) {
			this = new HashSet_1<T>();
		} else {
			this = new HashSet_1<T>(new KeyComparer<T>(key));
		}
	}

	/**
	Adds an item, unless an equal item is already in the set.

	@param item The item to add.
	@return True when the item was added, false when an equal item was already there.
	**/
	public inline function add(item:T):Bool {
		return this.Add(item);
	}

	/**
	Adds each item, skipping items already in the set.

	@param newItems The items to add.
	**/
	public inline function addAll(newItems:Iterable<T>):Void {
		for (item in newItems) {
			this.Add(item);
		}
	}

	/**
	Checks whether an equal item is in the set.

	@param item The item to look for.
	@return True when an equal item is in the set.
	**/
	public inline function exists(item:T):Bool {
		return this.Contains(item);
	}

	/**
	Removes the item equal to the given one.

	@param item The item to remove.
	@return True when an equal item was in the set.
	**/
	public inline function remove(item:T):Bool {
		return this.Remove(item);
	}

	/** Removes every item. **/
	public inline function clear():Void {
		this.Clear();
	}

	/**
	Counts the items.

	@return The number of items in the set.
	**/
	public inline function size():Int {
		return this.Count;
	}

	/**
	Iterates a snapshot of the items.

	@return An iterator over the items.
	**/
	public inline function iterator():Iterator<T> {
		return toNativeArray().iterator();
	}

	/**
	Copies the items into a new array.

	@return The new array.
	**/
	public inline function toArray():Array<T> {
		return Lib.array(toNativeArray());
	}

	inline function toNativeArray():NativeArray<T> {
		var items = new NativeArray<T>(this.Count);
		this.CopyTo(items);
		return items;
	}
}

// Compares items by the key a key function gives them.
@:nativeGen
private class KeyComparer<T> implements IEqualityComparer_1<T> {
	final key:Func_1<T, Int>;

	public function new(key:Func_1<T, Int>) {
		this.key = key;
	}

	public function Equals(a:T, b:T):Bool {
		return key(a) == key(b);
	}

	public function GetHashCode(item:T):Int {
		return key(item);
	}
}
