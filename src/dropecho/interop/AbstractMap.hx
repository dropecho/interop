package dropecho.interop;

import haxe.Constraints;
import haxe.ds.ObjectMap;
import haxe.ds.StringMap;

using StringTools;

@:forward
abstract AbstractMap<K, V>(IMap<K, V>) from IMap<K, V> to IMap<K, V> {
	public function new(?s:IMap<K, V>) {
		if (s != null) {
			this = s;
		} else {
			this = null;
		}
	}

	public inline function keyValueIterator() {
		return this.keyValueIterator();
	}

	@:from
	public inline static function fromMap<K, V>(map:IMap<K, V>):AbstractMap<K, V> {
		return new AbstractMap<K, V>(map);
	}

	@:arrayAccess
	public inline function get(key:K):V {
		return this.get(key);
	}

	@:arrayAccess
	public inline function set(k:K, v:V):V {
		this.set(k, v);
		return v;
	}

	@:from
	public static function fromAny<V>(d:Any) {
		var fields = Type.getInstanceFields(Type.getClass(d));
		var map = new Map<String, V>();

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
