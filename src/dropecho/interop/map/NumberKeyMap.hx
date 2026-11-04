package dropecho.interop.map;

#if js
import haxe.Constraints.IMap;
import dropecho.interop.map.ObjectIterators;
import haxe.DynamicAccess;

/**
The JS backing of `AbstractMap` for `Int` and `Float` keys.
It is a plain JS object like `StringKeyMap`, but keys come back as numbers when iterated.
JS lists number-like keys in ascending order, not insertion order.
**/
@:forward(exists, remove, clear)
abstract NumberKeyMap<K, V>(StringKeyMap<K, V>) {
	/**
	Creates an empty map, or wraps an existing plain object without copying it.

	@param object The plain object to use as the map's storage.
	**/
	public inline function new(?object:DynamicAccess<V>) {
		this = new StringKeyMap<K, V>(object);
	}

	/**
	Gets the value stored for a key.

	@param key The key to look up.
	@return The value, or `null` when the key has no entry.
	**/
	@:arrayAccess
	public inline function get(key:K):Null<V> {
		return this.get(key);
	}

	/**
	Stores a value for a key, replacing any value already there.

	@param key The key to store under.
	@param value The value to store.
	@return The stored value.
	**/
	@:arrayAccess
	public inline function set(key:K, value:V):V {
		return this.set(key, value);
	}

	/**
	Makes a shallow copy with its own storage.

	@return The new map.
	**/
	public inline function copy():NumberKeyMap<K, V> {
		return new NumberKeyMap<K, V>(this.copy());
	}

	/**
	Iterates the keys as numbers.

	@return An iterator over the keys.
	**/
	public inline function keys():NumberKeyIterator<K> {
		return new NumberKeyIterator(cast this);
	}

	/**
	Iterates the values.

	@return An iterator over the values.
	**/
	public inline function iterator():ObjectValueIterator<V> {
		return this.iterator();
	}

	/**
	Iterates the entries with number keys, for `for (key => value in map)`.

	@return An iterator over the entries.
	**/
	public inline function keyValueIterator():NumberKeyValueIterator<K, V> {
		return new NumberKeyValueIterator(this);
	}

	/**
	Wraps a plain object without copying it.

	@param object The plain object to use as the map's storage.
	@return The map.
	**/
	@:from
	public static inline function fromObject<K, V>(object:DynamicAccess<V>):NumberKeyMap<K, V> {
		return new NumberKeyMap<K, V>(object);
	}

	/**
	Copies the entries of a Haxe `Map` into a new map.

	@param map The map to copy.
	@return The new map.
	**/
	@:from
	public static inline function fromMap<K, V>(map:Map<K, V>):NumberKeyMap<K, V> {
		return fromIMap(cast map);
	}

	/**
	Copies the entries of any `IMap` into a new map.

	@param map The map to copy.
	@return The new map.
	**/
	@:from
	public static inline function fromIMap<K, V>(map:IMap<K, V>):NumberKeyMap<K, V> {
		var copied = new NumberKeyMap<K, V>();
		for (key => value in map.keyValueIterator()) {
			copied.set(key, value);
		}
		return copied;
	}

	/**
	Gives the plain object that stores the map.

	@return The plain object.
	**/
	@:to
	public inline function toObject():DynamicAccess<V> {
		return this;
	}
}
#end
