package dropecho.interop;

@:forward(iterator)
abstract AbstractArray<V>(Array<V>) from Array<V> to Array<V> {
	public function new<V>(?a:Array<V>) {
		if (a != null) {
			this = a;
		} else {
			this = new Array<V>();
		}
	}

	#if cs
	@:from
	public static function fromCsArray(a:cs.system.Array) {
		var abs = new Array<Dynamic>();
		for (i in 0...a.GetLength(0)) {
			abs.push(a.GetValue(i));
		}

		return new AbstractArray(abs);
	}
	#end

	@:from
	public static function fromAny<V>(d:Any) {
		#if cs
		if (Std.is(d, cs.system.Array)) {
			return fromCsArray(d);
		}
		#end

		var arr = cast(d, Array<Dynamic>);
		return new AbstractArray([for (v in arr) v]);
	}
}
