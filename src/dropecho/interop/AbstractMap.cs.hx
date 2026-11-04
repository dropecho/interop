package dropecho.interop;

import haxe.Constraints;
import cs.system.collections.generic.IDictionary_2;
import cs.system.collections.generic.Dictionary_2;
import cs.system.collections.generic.IEnumerator_1;
import cs.system.collections.generic.KeyValuePair_2;

/**
Iterates a dictionary's values with a typed enumerator, so value types aren't boxed.
Its methods are inline, so a `for` loop over it compiles to a plain loop.
**/
@:nativeGen
class CSDictValueIterator<K, V> {
	final values:IEnumerator_1<V>;
	final count:Int;
	var index = 0;

	/**
	Starts iterating a dictionary's values.

	@param map The dictionary to read.
	**/
	public inline function new(map:IDictionary_2<K, V>) {
		count = map.Count;
		values = cs.Syntax.code('{0}.Values.GetEnumerator()', map);
	}

	/**
	Checks whether another value is available.

	@return True if `next` will return a value.
	**/
	public inline function hasNext():Bool {
		return index < count;
	}

	/**
	Returns the next value.

	@return The next value.
	**/
	public inline function next():V {
		index++;
		values.MoveNext();
		return values.Current;
	}
}

/**
Iterates a dictionary's keys with a typed enumerator, so value types aren't boxed.
Its methods are inline, so a `for` loop over it compiles to a plain loop.
**/
@:nativeGen
class CSDictKeyIterator<K, V> {
	final keys:IEnumerator_1<K>;
	final count:Int;
	var index = 0;

	/**
	Starts iterating a dictionary's keys.

	@param map The dictionary to read.
	**/
	public inline function new(map:IDictionary_2<K, V>) {
		count = map.Count;
		keys = cs.Syntax.code('{0}.Keys.GetEnumerator()', map);
	}

	/**
	Checks whether another key is available.

	@return True if `next` will return a key.
	**/
	public inline function hasNext():Bool {
		return index < count;
	}

	/**
	Returns the next key.

	@return The next key.
	**/
	public inline function next():K {
		index++;
		keys.MoveNext();
		return keys.Current;
	}
}

/**
Iterates a dictionary's entries in one pass over its `KeyValuePair`s.
Its methods are inline, so a `for (key => value in map)` loop compiles to a plain loop without building an object per entry.
**/
@:nativeGen
class CSDictKeyValueIterator<K, V> {
	final entries:IEnumerator_1<KeyValuePair_2<K, V>>;
	final count:Int;
	var index = 0;

	/**
	Starts iterating a dictionary's entries.

	@param map The dictionary to read.
	**/
	public inline function new(map:IDictionary_2<K, V>) {
		count = map.Count;
		entries = cs.Syntax.code('{0}.GetEnumerator()', map);
	}

	/**
	Checks whether another entry is available.

	@return True if `next` will return an entry.
	**/
	public inline function hasNext():Bool {
		return index < count;
	}

	/**
	Returns the next entry.

	@return The next key and its value.
	**/
	public inline function next():{key:K, value:V} {
		index++;
		entries.MoveNext();
		var entry = entries.Current;
		return {key: entry.Key, value: entry.Value};
	}
}

@:forward
@:nativeGen
abstract AbstractMap<K, V>(IDictionary_2<K, V>) from IDictionary_2<K, V> to IDictionary_2<K, V> {
	public function new(s:IDictionary_2<K, V> = null) {
		if (s != null) {
			this = s;
		} else {
			this = new Dictionary_2<K, V>();
		}
	}

	public inline function iterator() {
		return new CSDictValueIterator<K, V>(this);
	}

	public inline function keys() {
		return new CSDictKeyIterator<K, V>(this);
	}

	public inline function keyValueIterator() {
		return new CSDictKeyValueIterator<K, V>(this);
	}

	public inline function exists(key:K):Bool {
		return this.ContainsKey(key);
	}

	public inline function remove(key:K):Bool {
		return this.Remove(key);
	}

	public inline function clear():Void {
		this.Clear();
	}

	/**
	Gets the value stored for a key.

	@param key The key to look up.
	@return The value, or `null` when the key has no entry, as on every other target.
	**/
	@:arrayAccess
	public inline function get(key:K):Null<V> {
		return getOrNull(this, key);
	}

	/**
	Makes a shallow copy with its own storage. A `Dictionary` keeps its key comparer.

	@return The new map.
	**/
	public inline function copy():AbstractMap<K, V> {
		return copyOf(this);
	}

	@:arrayAccess
	public inline function set(key:K, value:V):V {
		this.set_Item(key, value);
		return value;
	}

	// One lookup instead of ContainsKey followed by the indexer. Raw C#, since Haxe would wrap the out argument in a cast.
	static function getOrNull<K, V>(map:IDictionary_2<K, V>, key:K):Null<V> {
		var value:V = cast null;
		var found:Bool = cs.Syntax.code('{0}.TryGetValue({1}, out {2})', map, key, value);
		if (!found) {
			return null;
		}
		return value;
	}

	// Raw C#, so a Dictionary's comparer can be passed to the copy.
	static function copyOf<K, V>(map:IDictionary_2<K, V>):IDictionary_2<K, V> {
		return cs.Syntax.code('({0} is global::System.Collections.Generic.Dictionary<K, V>)
			? new global::System.Collections.Generic.Dictionary<K, V>({0}, ((global::System.Collections.Generic.Dictionary<K, V>) {0}).Comparer)
			: new global::System.Collections.Generic.Dictionary<K, V>({0})', map);
	}

	@:from
	public static inline function fromMap<K, V>(map:Map<K, V>):AbstractMap<K, V> {
		return fromIMap(cast map);
	}

	@:from
	public static inline function fromIMap<K, V>(map:IMap<K, V>):AbstractMap<K, V> {
		var abs = new AbstractMap<K, V>();
		for (k => v in map.keyValueIterator()) {
			abs.set_Item(k, v);
		}
		return abs;
	}
}
