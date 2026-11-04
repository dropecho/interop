package dropecho.interop;

import cs.system.collections.generic.IEnumerable_1;
import cs.system.collections.generic.IEnumerator_1;
import cs.system.collections.generic.List_1 as CSList;

/** Adapts a C# `IEnumerator<T>` to the Haxe iterator protocol. **/
@:nativeGen
class CSEnumeratorIterator<V> {
	var enumerator:IEnumerator_1<V>;
	var peeked:Bool;
	var hasCurrent:Bool;

	/**
	Wraps an enumerator that has not been advanced yet.

	@param enumerator The enumerator to read from.
	**/
	public inline function new(enumerator:IEnumerator_1<V>) {
		this.enumerator = enumerator;
		peeked = false;
		hasCurrent = false;
	}

	/**
	Checks whether another item is available.

	@return True if `next` will return an item.
	**/
	public inline function hasNext():Bool {
		// MoveNext advances, so remember the answer until next() consumes it.
		if (!peeked) {
			hasCurrent = enumerator.MoveNext();
			peeked = true;
		}
		return hasCurrent;
	}

	/**
	Returns the next item.

	@return The next item in the sequence.
	**/
	public inline function next():V {
		if (!peeked) {
			enumerator.MoveNext();
		}
		peeked = false;
		return enumerator.Current;
	}
}

/** A collection that can be looped over: a Haxe `Iterable` in JS, an `IEnumerable<T>` in C#. **/
@:dce
@:nativeGen
abstract AbstractIterable<V>(IEnumerable_1<V>) from IEnumerable_1<V> to IEnumerable_1<V> {
	/**
	Gets an iterator over the collection, so it works in a Haxe `for` loop.

	@return An iterator over the items.
	**/
	public inline function iterator():CSEnumeratorIterator<V> {
		// The extern resolves GetEnumerator to the untyped IEnumerable one, whose result
		// cannot be cast to IEnumerator<T> for arrays, so call the typed one directly.
		var enumerator:IEnumerator_1<V> = cs.Syntax.code('{0}.GetEnumerator()', this);
		return new CSEnumeratorIterator(enumerator);
	}

	/**
	Uses an `AbstractArray` (a `List<T>`) as an iterable without copying it.

	@param array The array to iterate.
	@return The same list, as an iterable.
	**/
	@:from
	public static inline function fromAbstractArray<V>(array:AbstractArray<V>):AbstractIterable<V> {
		return (array : CSList<V>);
	}

	/**
	Converts a Haxe iterable (such as an `Array` or `List`) by copying its items into a `List<T>`.

	@param iter The Haxe iterable to copy.
	@return An iterable holding the same items in the same order.
	**/
	@:from
	public static inline function fromIterable<V>(iter:Iterable<V>):AbstractIterable<V> {
		var list = new CSList<V>();
		for (item in iter) {
			list.Add(item);
		}
		return list;
	}
}
