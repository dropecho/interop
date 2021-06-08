package dropecho.interop;

import dropecho.interop.AbstractFunc.Func_1;
import dropecho.interop.AbstractFunc.Func_2;
import cs.system.collections.IEnumerator;
// import cs.system.collections.generic.IList_1 as CSList;
import cs.system.collections.generic.List_1 as CSList;

// import cs.Syntax;

@:nativeGen
class CSListIterator<V> {
	var v:IEnumerator;
	var c:Int;
	var i:Int;

	public function new(list:CSList<V>) {
		i = 0;
		c = list.Count;
		v = list.GetEnumerator();
	}

	public function hasNext():Bool {
		return i < c;
	}

	public function next():V {
		i++;
		v.MoveNext();
		return v.Current;
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

	public inline function sort(f:Func_2<V, V, Int>):Void {
		// cs.Syntax.code('{0}.Sort({1})', this, f);
		untyped __cs__('{0}.Sort({1})', this, f);
	}

	public inline function filter(f:Func_1<V, Bool>):AbstractArray<V> {
		return new AbstractArray<V>();
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
	public static function fromArray<V>(array:Array<V>):AbstractArray<V> {
		var abs = new AbstractArray();
		for (val in array) {
			abs.push(val);
		}
		return abs;
	}

	@:from
	public static function fromAny<V>(d:Any):AbstractArray<Dynamic> {
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
