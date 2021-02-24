package dropecho.interop;

#if cs
import cs.system.collections.generic.Dictionary_2;
#end

@:expose("TestMap")
class TestMap {
	static public var map:AbstractMap<Int, Int>;

	// static function setMap(value:Any) {
	//   map = AbstractMap.fromAny(value);
	// }

	static function createMap() {
		#if cs
		map = new cs.system.collections.generic.Dictionary_2<Int, Int>();
		#end
	}

	static function createAbstractMap() {
		#if cs
		map = new AbstractMap<Int, Int>();
		#end
	}

	#if cs
	static function createMapFromDictionary(dict:Dictionary_2<Int, Int>) {
		map = dict;
		// map = new AbstractMap(dict);
	}
	#end
}
