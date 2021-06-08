package dropecho.interop.test;

#if js
import haxe.DynamicAccess;
#end
#if cs
import cs.system.collections.generic.Dictionary_2;
#end

@:expose("TestMap")
class TestMap<T, U> {
	public var map:AbstractMap<T, U>;
	public var nested:AbstractMap<T, AbstractMap<T, U>>;

	function new() {
		map = new AbstractMap<T, U>();
		nested = new AbstractMap<T, AbstractMap<T, U>>();
	}

	#if cs
	function createMapFromDictionary(dict:Dictionary_2<T, U>) {
		map = dict;
	}
	#end

	#if js
	public var dyn:DynamicAccess<Dynamic>;

	function createDynAcces() {
		dyn = {};

		dyn.set("test", 1);

		return dyn;
	}
	#end
}
