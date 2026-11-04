package dropecho.interop;

import dropecho.interop.AbstractFunc.Func_1;
import dropecho.interop.AbstractFunc.Func_2;
import dropecho.interop.AbstractFunc.Func__2;
import cs.system.collections.generic.List_1 as CSList;

/**
Iterates a `List<T>` by index, so value types aren't boxed.
Its methods are inline, so a `for` loop over it compiles to a plain indexed loop.
**/
@:nativeGen
class CSListIterator<V> {
	final list:CSList<V>;
	var index = 0;

	/**
	Starts iterating a list.

	@param list The list to read.
	**/
	public inline function new(list:CSList<V>) {
		this.list = list;
	}

	/**
	Checks whether another item is available.

	@return True if `next` will return an item.
	**/
	public inline function hasNext():Bool {
		return index < list.Count;
	}

	/**
	Returns the next item.

	@return The next item.
	**/
	public inline function next():V {
		return list.get_Item(index++);
	}
}

@:dce
@:nativeGen
abstract AbstractArray<V>(CSList<V>) from CSList<V> to CSList<V> {
	public var length(get, never):Int;

	private inline function get_length() {
		return this.Count;
	}

	public function new(?a:CSList<V> = null) {
		if (a != null) {
			this = a;
		} else {
			this = new CSList<V>();
		}
	}

	public inline function unshift(val:V):Void {
		this.Insert(0, val);
	}

	public inline function sort(f:(V, V) -> Int):Void {
		this.Sort((a, b) -> f(a, b));
	}

	public inline function filter(f:Func_1<V, Bool>):AbstractArray<V> {
		return cs.Syntax.code('{0}.FindAll((a)=> {1}(a))', this, f);
	}

	@:arrayAccess
	public inline function get(i:Int):V {
		return untyped __cs__('{0}[{1}]', this, i);
	}

	@:arrayAccess
	public inline function set(i:Int, v:V):V {
		return untyped __cs__('{0}[{1}]={2}', this, i, v);
	}

	public inline function push(item:V):Int {
		this.Add(item);
		return this.Count;
	}

	public inline function iterator():CSListIterator<V> {
		return new CSListIterator(this);
	}

	@:from
	public static inline function fromArray<V>(array:Array<V>):AbstractArray<V> {
		var abs = new AbstractArray();
		for (val in array) {
			abs.push(val);
		}
		return abs;
	}

	@:from
	public static inline function fromAny<V>(d:Any):AbstractArray<Dynamic> {
		if (Std.isOfType(d, CSList)) {
			return new AbstractArray(d);
		}

		var arr = cast(d, Array<Dynamic>);
		var abs = new AbstractArray<Dynamic>();
		for (v in arr) {
			abs.push(v);
		}

		return abs;
	}
}
