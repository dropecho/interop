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

	@:from
	public static function fromAny<V>(d:Any) {
		var arr = cast(d, Array<Dynamic>);
		return new AbstractArray([for (v in arr) v]);
	}
}
