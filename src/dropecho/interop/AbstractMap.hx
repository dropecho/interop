package dropecho.interop;

import haxe.Constraints;
import haxe.ds.StringMap;

using StringTools;

@:forward(set, get, exists)
abstract AbstractMap<V>(StringMap<V>) from StringMap<V> to StringMap<V> {
	public function new<V>(?s:StringMap<V>) {
		if (s != null) {
			this = s;
		} else {
			this = new StringMap<V>();
		}
	}

	public function keyValueIterator() {
		return this.keyValueIterator();
	}

	@:from
	public static function fromMap<V>(map:StringMap<V>):AbstractMap<V> {
		return new AbstractMap<V>(map);
	}

	@:from
	public static function fromAny<V>(d:Any) {
		var fields = Type.getInstanceFields(Type.getClass(d));
		var map = new StringMap<V>();

		for (f in fields) {
			var val = Reflect.field(d, f);
			if (Reflect.isFunction(val)) {
				map.set(f.split('_')[1], cast val());
			} else {
				map.set(f, cast val);
			}
		}
		return new AbstractMap(map);
	}
}
