package dropecho.interop;

import js.lib.Map as JsMap;
import js.lib.HaxeIterator;

// JS backing for ObjectKeyedMap: a native `Map`. Keys are compared by identity
// (objects) / value (primitives), so JS callers get `.get()`/`.set()`/`.has()`,
// `for...of` iteration, and `.size` — and, unlike the cross-target ObjectMap
// backing, no hidden `__id__` property is injected onto their key objects.
@:forward(iterator, keyValueIterator, forEach, size)
abstract ObjectKeyedMap<K:{}, V>(JsMap<K, V>) to JsMap<K, V> {
	public inline function new() {
		this = new JsMap<K, V>();
	}

	@:arrayAccess
	public inline function get(key:K):V {
		return this.get(key);
	}

	@:arrayAccess
	public inline function set(key:K, value:V):V {
		this.set(key, value);
		return value;
	}

	public inline function exists(key:K):Bool {
		return this.has(key);
	}

	public inline function remove(key:K):Bool {
		return this.delete(key);
	}

	public inline function clear():Void {
		this.clear();
	}

	// Wrap the native key iterator so `keys()` returns a Haxe Iterator<K>, matching
	// the ObjectMap-backed targets.
	public inline function keys():Iterator<K> {
		return new HaxeIterator(this.keys());
	}
}
