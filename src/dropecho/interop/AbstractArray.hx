package dropecho.interop;

@:dce
@:forward
abstract AbstractArray<V>(Array<V>) from Array<V> to Array<V> {
	public function new<V>(?a:Array<V>) {
		if (a != null) {
			this = a;
		} else {
			this = new Array<V>();
		}
	}

	@:arrayAccess
	public inline function get(i:Int):V {
		return this[i];
	}

	@:arrayAccess
	public inline function set(i:Int, v:V):V {
		return this[i] = v;
	}

	@:from
	public static function fromAny<V>(d:Any) {
		var arr = cast(d, Array<Dynamic>);
		return new AbstractArray([for (v in arr) v]);
	}
}
