package dropecho.interop;

/** A collection that can be looped over: a Haxe `Iterable` in JS, an `IEnumerable<T>` in C#. **/
@:dce
@:forward(iterator)
abstract AbstractIterable<V>(Iterable<V>) from Iterable<V> to Iterable<V> {
	/**
	Uses an `AbstractArray` as an iterable without copying it.

	@param array The array to iterate.
	@return The same array, as an iterable.
	**/
	@:from
	public static inline function fromAbstractArray<V>(array:AbstractArray<V>):AbstractIterable<V> {
		return (array : Array<V>);
	}
}
