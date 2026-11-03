package dropecho.interop.test;

@:expose("TestIterable")
class TestIterable {
	/**
	Copies every item of an iterable into an array, in order.

	@param items The items to copy.
	@return The items as an array.
	**/
	public static function collect<T>(items:AbstractIterable<T>):AbstractArray<T> {
		var out = new AbstractArray<T>();
		for (item in items) {
			out.push(item);
		}
		return out;
	}
}
