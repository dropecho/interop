package dropecho.interop;

import haxe.ds.ObjectMap;

// Identity-keyed companion to AbstractMap: keys are compared by reference, not
// coerced via `Std.string`. Reach for this when a map is keyed by an object or
// instance (e.g. a visited-set during graph traversal); use AbstractMap for
// string/int keys, which stays a plain object on JS for clean interop.
//
// Backed by haxe.ds.ObjectMap, which is identity-based on every target, so
// unlike AbstractMap this needs no per-target file for correctness. A `.js.hx`
// sibling backs it with a native `Map` purely for friendlier JS-side consumption
// (and to avoid the hidden `__id__` ObjectMap injects onto key objects).
//
// The `K:{}` bound rejects Int/String keys at compile time on purpose.
@:forward
abstract ObjectKeyedMap<K:{}, V>(ObjectMap<K, V>) from ObjectMap<K, V> to ObjectMap<K, V> {
	public inline function new() {
		this = new ObjectMap<K, V>();
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

	public inline function clear():Void {
		this.clear();
	}
}
