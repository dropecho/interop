package dropecho.interop.map;

#if js
import haxe.Constraints.IMap;
import js.lib.HaxeIterator;

// `js.lib.Map` is written out in full: an `import ... as` alias fails to resolve when
// this type is first loaded from `AbstractMapBuilder`.

/**
The JS backing of `AbstractMap` for object, function and `Bool` keys.
It is a native JS `Map`: objects are compared by identity, so two instances with equal fields are different keys, matching a C# `Dictionary`.
Entries iterate in insertion order.
**/
@:forward(size, forEach)
abstract IdentityKeyMap<K, V>(js.lib.Map<K, V>) from js.lib.Map<K, V> to js.lib.Map<K, V> {
	/** Creates an empty map. **/
	public inline function new() {
		this = new js.lib.Map<K, V>();
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
	Checks whether a key has an entry.

	@param key The key to check.
	@return True when the key has an entry.
	**/
	public inline function exists(key:K):Bool {
		return this.has(key);
	}

	/**
	Removes a key's entry.

	@param key The key to remove.
	@return True when the key had an entry.
	**/
	public inline function remove(key:K):Bool {
		return this.delete(key);
	}

	/** Removes every entry. **/
	public inline function clear():Void {
		this.clear();
	}

	/**
	Makes a shallow copy with its own storage.

	@return The new map.
	**/
	public inline function copy():IdentityKeyMap<K, V> {
		return new js.lib.Map<K, V>(this);
	}

	/**
	Iterates the keys.

	@return An iterator over the keys.
	**/
	public inline function keys():Iterator<K> {
		return new HaxeIterator(this.keys());
	}

	/**
	Iterates the values.

	@return An iterator over the values.
	**/
	public inline function iterator():Iterator<V> {
		return this.iterator();
	}

	/**
	Iterates the entries, for `for (key => value in map)`.

	@return An iterator over the entries.
	**/
	public inline function keyValueIterator():KeyValueIterator<K, V> {
		return new IdentityKeyValueIterator(this);
	}

	/**
	Copies the entries of a Haxe `Map` into a new map.

	@param map The map to copy.
	@return The new map.
	**/
	@:from
	public static inline function fromMap<K, V>(map:Map<K, V>):IdentityKeyMap<K, V> {
		return fromIMap(cast map);
	}

	/**
	Copies the entries of any `IMap` into a new map.

	@param map The map to copy.
	@return The new map.
	**/
	@:from
	public static inline function fromIMap<K, V>(map:IMap<K, V>):IdentityKeyMap<K, V> {
		var copied = new IdentityKeyMap<K, V>();
		for (key => value in map.keyValueIterator()) {
			copied.set(key, value);
		}
		return copied;
	}
}

// Turns the native `[key, value]` entries into the `{key, value}` pairs Haxe loops expect.
private class IdentityKeyValueIterator<K, V> {
	final entries:HaxeIterator<js.lib.KeyValue<K, V>>;

	public inline function new(map:js.lib.Map<K, V>) {
		entries = new HaxeIterator(map.entries());
	}

	public inline function hasNext():Bool {
		return entries.hasNext();
	}

	public inline function next():{key:K, value:V} {
		var entry = entries.next();
		return {key: entry.key, value: entry.value};
	}
}
#end
