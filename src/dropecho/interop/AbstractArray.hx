package dropecho.interop;

@:dce
@:forward
abstract AbstractArray<V>(Array<V>) from Array<V> to Array<V> {
	public function new(?a:Array<V>) {
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

	/**
	Copies an untyped array, such as one read with reflection, into a new `AbstractArray`.
	Not an implicit conversion, so a value of the wrong type is a compile error rather than a runtime one.

	@param d The array to copy.
	@return A new array holding the same items.
	**/
	public static function fromAny(d:Any):AbstractArray<Dynamic> {
		var arr = cast(d, Array<Dynamic>);
		return new AbstractArray([for (v in arr) v]);
	}
}
