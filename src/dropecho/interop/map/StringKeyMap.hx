package dropecho.interop.map;

#if js
import haxe.Constraints.IMap;
import haxe.DynamicAccess;
import haxe.iterators.DynamicAccessIterator;
import haxe.iterators.DynamicAccessKeyValueIterator;

/**
The JS backing of `AbstractMap` for `String` keys, and for key types that are still generic when compiled.
It is a plain JS object, so JS code can read it as `obj[key]` and `JSON.stringify` it.
Keys are converted with `Std.string`, and only the object's own properties count as entries.
**/
abstract StringKeyMap<K, V>(DynamicAccess<V>) from DynamicAccess<V> to DynamicAccess<V> {
	// Assigning this name on a plain object replaces its prototype instead of adding an entry.
	static inline final PROTOTYPE_KEY = "__proto__";

	/**
	Creates an empty map, or wraps an existing plain object without copying it.

	@param object The plain object to use as the map's storage.
	**/
	public inline function new(?object:DynamicAccess<V>) {
		this = object != null ? object : new DynamicAccess<V>();
	}

	/**
	Gets the value stored for a key.

	@param key The key to look up.
	@return The value, or `null` when the key has no entry.
	**/
	@:arrayAccess
	public inline function get(key:K):Null<V> {
		var name = Std.string(key);
		if (this.exists(name)) {
			return this.get(name);
		}
		return null;
	}

	/**
	Stores a value for a key, replacing any value already there.

	@param key The key to store under.
	@param value The value to store.
	@return The stored value.
	**/
	@:arrayAccess
	public inline function set(key:K, value:V):V {
		var name = Std.string(key);
		if (name == PROTOTYPE_KEY) {
			var object:Dynamic = this;
			js.lib.Object.defineProperty(object, name, {
				value: value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		} else {
			this.set(name, value);
		}
		return value;
	}

	/**
	Checks whether a key has an entry.

	@param key The key to check.
	@return True when the key has an entry.
	**/
	public inline function exists(key:K):Bool {
		return this.exists(Std.string(key));
	}

	/**
	Removes a key's entry.

	@param key The key to remove.
	@return True when the key had an entry.
	**/
	public inline function remove(key:K):Bool {
		return this.remove(Std.string(key));
	}

	/** Removes every entry. **/
	public inline function clear():Void {
		for (name in this.keys()) {
			this.remove(name);
		}
	}

	/**
	Makes a shallow copy with its own storage.

	@return The new map.
	**/
	public inline function copy():StringKeyMap<K, V> {
		var copied = new StringKeyMap<K, V>();
		for (name => value in this) {
			copied.set(cast name, value);
		}
		return copied;
	}

	/**
	Iterates the keys. Keys of a generic key type come back as strings.

	@return An iterator over the keys.
	**/
	public inline function keys():Iterator<K> {
		var names:Array<K> = cast this.keys();
		return names.iterator();
	}

	/**
	Iterates the values.

	@return An iterator over the values.
	**/
	public inline function iterator():DynamicAccessIterator<V> {
		return this.iterator();
	}

	/**
	Iterates the entries, for `for (key => value in map)`.

	@return An iterator over the entries.
	**/
	public inline function keyValueIterator():KeyValueIterator<K, V> {
		return cast new DynamicAccessKeyValueIterator<V>(this);
	}

	/**
	Copies the entries of a Haxe `Map` into a new map.

	@param map The map to copy.
	@return The new map.
	**/
	@:from
	public static inline function fromMap<K, V>(map:Map<K, V>):StringKeyMap<K, V> {
		return fromIMap(cast map);
	}

	/**
	Copies the entries of any `IMap` into a new map.

	@param map The map to copy.
	@return The new map.
	**/
	@:from
	public static inline function fromIMap<K, V>(map:IMap<K, V>):StringKeyMap<K, V> {
		var copied = new StringKeyMap<K, V>();
		for (key => value in map.keyValueIterator()) {
			copied.set(key, value);
		}
		return copied;
	}
}
#end
