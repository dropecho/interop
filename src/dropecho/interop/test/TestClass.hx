package dropecho.interop.test;

@:struct
@:expose('TestClassConfig')
class TestClassConfig {
	public var i:Int;
	public var f:Float;

	public function new() {};
}

@:expose('TestThisClass')
class TestThisClass {
	public var i:Int;
	public var f:Float;
	public var m:AbstractMap<String, Int> = new AbstractMap<String, Int>();
	public var a:Array<Int> = new Array<Int>();
	public var subarr:AbstractArray<TestClassConfig> = new AbstractArray<TestClassConfig>();

	public function new(?opts:Dynamic) {
		Extender.defaults(this, opts);
		var b:Array<Int> = [1, 2, 3];

		var x = b[1];
	}

	public function test() {
		return subarr[0].i + i;
	}
}

class TestAnotherClass {
	// public static function doSomething(?opts:Dynamic = null) {
	//   var ex:Array<Dynamic> = [{i: 1}, {f: 2}, opts];
	//   var params = Extender.defaults(new TestClassConfig(), ex);
	// }
}
