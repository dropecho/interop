package dropecho.interop.test;

#if cs
import cs.system.collections.generic.IList_1;
// import cs.system.collections.generic.List_1;
#end

@:expose("TestArray")
class TestArray<T> {
	public var array:AbstractArray<T>;
	public var nested:AbstractArray<AbstractArray<T>>;

	function new() {
		array = new AbstractArray<T>();
		nested = new AbstractArray<AbstractArray<T>>();
	}

	#if cs
	function fromList(list:IList_1<T>) {
		array = list;
	}
	#end
}
