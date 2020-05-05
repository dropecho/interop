package dropecho.utils;

import haxe.Constraints;
import haxe.ds.StringMap;
import haxe.ds.ObjectMap;

using StringTools;

@:forward(set, get, exists, keyValueIterator)
abstract AbstractMap<T>(StringMap<T>) from StringMap<T> to StringMap<T> {
	public function new<T>(?s:StringMap<T>) {
		this = s;
	}

	@:from
	public static function jsMap<T>(d:js.lib.Map<Any, T>) {
		var map = new StringMap<T>();
		d.forEach((v, k, m) -> {
			map.set(k, v);
		});
		return new AbstractMap(map);
	}

	@:from
	public static function fromAny(d:Any) {
		if (isJsMap(d)) {
			return jsMap(d);
		}

		var fields = Reflect.fields(d);
		var map = [for (f in fields) f => Reflect.field(d, f)];
		return new AbstractMap(map);
	}

	public static function isJsMap(value:Any):Bool {
		return Std.is(value, js.lib.Map);
	}
}
