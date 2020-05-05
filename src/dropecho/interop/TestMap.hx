package dropecho.interop;

@:expose("TestMap")
class TestMap {
	static public var map:AbstractMap<Int>;

	static function setMap(value:Any) {
		map = AbstractMap.fromAny(value);
	}
}
