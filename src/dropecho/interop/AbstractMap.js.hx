package dropecho.interop;

import haxe.DynamicAccess;
import haxe.Constraints.IMap;

@:forward
abstract AbstractMap<K, V>(DynamicAccess<Dynamic>) {
	public function new(?s:DynamicAccess<Dynamic>) {
		if (s != null) {
			this = s;
		} else {
			this = new DynamicAccess<Dynamic>();
		}
	}

	// public inline function exists(key:K):Bool {
	//   return false;
	//   // return this && this.exists(key);
	// }

	@:arrayAccess
	public inline function get(key:K):V {
		return this.get(Std.string(key));
	}

	@:arrayAccess
	public inline function set(key:K, value:V):V {
		this.set(Std.string(key), value);
		return value;
	}

	@:from
	public inline static function fromMap<K, V>(map:Map<K, V>):AbstractMap<K, V> {
		return fromIMap(cast map);
	}

	@:from
	public inline static function fromIMap<K, V>(map:IMap<K, V>):AbstractMap<K, V> {
		var abs = new AbstractMap<K, V>();
		for (k => v in map.keyValueIterator()) {
			abs[k] = v;
		}
		return abs;
	}
}
