package dropecho.interop;

import haxe.Constraints.IMap;

@:forward
abstract AbstractMap<K, V>(js.lib.Map<K, V>) from js.lib.Map<K, V> to js.lib.Map<K, V> {
	public function new(?s:js.lib.Map<K, V>) {
		if (s != null) {
			this = s;
		} else {
			this = new js.lib.Map<K, V>();
		}
	}

	public function remove(key:K):Bool {
		return this.delete(key);
	}

	public function exists(key:K):Bool {
		return this.has(key);
	}

	@:arrayAccess
	public function get(key:K):V {
		return this.get(key);
	}

	@:arrayAccess
	public function set(key:K, value:V):V {
		this.set(key, value);
		return value;
	}

	@:from
	public static function fromMap<K, V>(map:Map<K, V>):AbstractMap<K, V> {
		return new AbstractMap<K, V>(new js.lib.Map(map));
	}

	@:from
	public inline static function fromIMap<K, V>(map:IMap<K, V>):AbstractMap<K, V> {
		return new AbstractMap<K, V>(new js.lib.Map(map));
	}
}
