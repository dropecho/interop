package dropecho.interop.map;

#if js
import haxe.DynamicAccess;

// These iterators read a plain object's own keys once with `Object.keys`. Unlike `Reflect.fields`,
// that skips no names (it keeps "__id__"), and their inline methods let a `for` loop compile to a plain loop.

/** Iterates a plain object's values. **/
class ObjectValueIterator<V> {
	final object:DynamicAccess<V>;
	final names:Array<String>;
	var index = 0;

	/**
	Starts iterating an object's values.

	@param object The object to read.
	**/
	public inline function new(object:DynamicAccess<V>) {
		this.object = object;
		names = js.lib.Object.keys(cast object);
	}

	/**
	Checks whether another value is available.

	@return True if `next` will return a value.
	**/
	public inline function hasNext():Bool {
		return index < names.length;
	}

	/**
	Returns the next value.

	@return The next value.
	**/
	public inline function next():V {
		return object[names[index++]];
	}
}

/** Iterates a plain object's entries, with the key names as they are stored. **/
class ObjectKeyValueIterator<K, V> {
	final object:DynamicAccess<V>;
	final names:Array<String>;
	var index = 0;

	/**
	Starts iterating an object's entries.

	@param object The object to read.
	**/
	public inline function new(object:DynamicAccess<V>) {
		this.object = object;
		names = js.lib.Object.keys(cast object);
	}

	/**
	Checks whether another entry is available.

	@return True if `next` will return an entry.
	**/
	public inline function hasNext():Bool {
		return index < names.length;
	}

	/**
	Returns the next entry.

	@return The next key and its value.
	**/
	public inline function next():{key:K, value:V} {
		var name = names[index++];
		return {key: cast name, value: object[name]};
	}
}

/** Iterates a plain object's keys as numbers. **/
class NumberKeyIterator<K> {
	final names:Array<String>;
	var index = 0;

	/**
	Starts iterating an object's keys.

	@param object The object to read.
	**/
	public inline function new(object:DynamicAccess<Any>) {
		names = js.lib.Object.keys(cast object);
	}

	/**
	Checks whether another key is available.

	@return True if `next` will return a key.
	**/
	public inline function hasNext():Bool {
		return index < names.length;
	}

	/**
	Returns the next key.

	@return The next key, as a number.
	**/
	public inline function next():K {
		return cast Std.parseFloat(names[index++]);
	}
}

/** Iterates a plain object's entries, with the keys as numbers. **/
class NumberKeyValueIterator<K, V> {
	final object:DynamicAccess<V>;
	final names:Array<String>;
	var index = 0;

	/**
	Starts iterating an object's entries.

	@param object The object to read.
	**/
	public inline function new(object:DynamicAccess<V>) {
		this.object = object;
		names = js.lib.Object.keys(cast object);
	}

	/**
	Checks whether another entry is available.

	@return True if `next` will return an entry.
	**/
	public inline function hasNext():Bool {
		return index < names.length;
	}

	/**
	Returns the next entry.

	@return The next key, as a number, and its value.
	**/
	public inline function next():{key:K, value:V} {
		var name = names[index++];
		return {key: cast Std.parseFloat(name), value: object[name]};
	}
}
#end
