package dropecho.interop;

import js.Syntax;
import haxe.Constraints;
import haxe.ds.StringMap;
import haxe.ds.ObjectMap;

using StringTools;

@:forward
abstract AbstractMap<K, V>(js.lib.Map<K, V>) from js.lib.Map<K, V> to js.lib.Map<K, V> {
	public function new<K, V>(?s:js.lib.Map<K, V>) {
		if (s != null) {
			this = s;
		} else {
			this = new js.lib.Map<K, V>();
		}
	}

	@:from
	public static function fromMap<K, V>(map:Map<K, V>):AbstractMap<K, V> {
		var abs = new AbstractMap<K, V>();

		for (k => v in map) {
			abs.set(k, v);
		}

		return abs;
	}

	public function exists(key:K):Bool {
		return this.has(key);
	}

	@:arrayAccess
	public function get(key:K):V {
		return Syntax.code('{0}[{1}]', this, key);
	}
}
