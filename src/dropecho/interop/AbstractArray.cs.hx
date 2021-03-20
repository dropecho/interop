package dropecho.interop;

import cs.system.collections.IEnumerator;
import cs.system.collections.generic.IList_1 as ICSList;
import cs.system.collections.generic.List_1 as CSList;

// import cs.system.Array as CSArray;

@:nativeGen
class CSListIterator<V> {
	var v:IEnumerator;
	var c:Int;
	var i:Int;

	public function new(list:ICSList<V>) {
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

@:forward
@:nativeGen
abstract AbstractArray<V>(ICSList<V>) from ICSList<V> to ICSList<V> {
	public function new(a:ICSList<V> = null) {
		if (a != null) {
			this = a;
		} else {
			this = new CSList<V>();
		}
	}

	public inline function push(item:V):Int {
		this.Add(item);
		return this.Count;
	}

	public inline function iterator():CSListIterator<V> {
		return new CSListIterator(this);
	}

	@:from
	public static function fromAny<V>(d:Any):AbstractArray<Dynamic> {
		if (Std.is(d, ICSList)) {
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
