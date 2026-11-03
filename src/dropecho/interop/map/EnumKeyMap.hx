package dropecho.interop.map;

#if js
import haxe.Constraints.IMap;
import haxe.ds.EnumValueMap;

/**
The JS backing of `AbstractMap` for enum keys.
It is a Haxe `EnumValueMap`, so keys compare by value (`Floor(1)` matches any other `Floor(1)`) and come back as enum values.
It is not a plain JS object.
**/
@:forward(exists, remove, clear, keys, iterator, keyValueIterator, toString)
abstract EnumKeyMap<K:EnumValue, V>(EnumValueMap<K, V>) from EnumValueMap<K, V> to EnumValueMap<K, V> {
	/** Creates an empty map. **/
	public inline function new() {
		this = new EnumValueMap<K, V>();
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
		this.set(key, value);
		return value;
	}

	/**
	Makes a shallow copy with its own storage.

	@return The new map.
	**/
	public inline function copy():EnumKeyMap<K, V> {
		return this.copy();
	}

	/**
	Copies the entries of a Haxe `Map` into a new map.

	@param map The map to copy.
	@return The new map.
	**/
	@:from
	public static inline function fromMap<K:EnumValue, V>(map:Map<K, V>):EnumKeyMap<K, V> {
		return fromIMap(cast map);
	}

	/**
	Copies the entries of any `IMap` into a new map.

	@param map The map to copy.
	@return The new map.
	**/
	@:from
	public static inline function fromIMap<K:EnumValue, V>(map:IMap<K, V>):EnumKeyMap<K, V> {
		var copied = new EnumKeyMap<K, V>();
		for (key => value in map.keyValueIterator()) {
			copied.set(key, value);
		}
		return copied;
	}
}
#end
