package dropecho.interop;

import haxe.Constraints;
import cs.system.collections.generic.IDictionary_2;
import cs.system.collections.generic.Dictionary_2;
import cs.system.collections.IEnumerator;

@:nativeGen
class CSDictValueIterator<K, V> {
	var v:IEnumerator;
	var c:Int;
	var i:Int;

	public function new(map:IDictionary_2<K, V>) {
		i = 0;
		c = map.Values.Count;
		v = map.Values.GetEnumerator();
	}

	public function hasNext():Bool {
		return i < c;
	}

	public function next():V {
		i++;
		v.MoveNext();
		return v.Current;
	}
}

@:nativeGen
class CSDictKeyIterator<K, V> {
	var k:IEnumerator;
	var c:Int;
	var i:Int;

	public function new(map:IDictionary_2<K, V>) {
		i = 0;
		c = map.Keys.Count;
		k = map.Keys.GetEnumerator();
	}

	public function hasNext():Bool {
		return i < c;
	}

	public function next():K {
		i++;
		k.MoveNext();
		return k.Current;
	}
}

@:nativeGen
class CSDictKeyValueIterator<K, V> {
	var k:IEnumerator;
	var v:IEnumerator;
	var c:Int;
	var i:Int;

	public function new(map:IDictionary_2<K, V>) {
		i = 0;
		c = map.Keys.Count;
		k = map.Keys.GetEnumerator();
		v = map.Values.GetEnumerator();
	}

	public function hasNext():Bool {
		return i < c;
	}

	public function next():{key:K, value:V} {
		i++;
		k.MoveNext();
		v.MoveNext();
		return {key: k.Current, value: cast(v.Current)};
	}
}

@:forward
@:nativeGen
abstract AbstractMap<K, V>(IDictionary_2<K, V>) from IDictionary_2<K, V> to IDictionary_2<K, V> {
	public function new(s:IDictionary_2<K, V> = null) {
		if (s != null) {
			this = s;
		} else {
			this = new Dictionary_2<K, V>();
		}
	}

	@:from // TODO: Figure out why this is broken, fails on runtime cs stuff.
	public static function fromMap<K, V>(map:IMap<K, V>):AbstractMap<K, V> {
		var abs = new Dictionary_2<K, V>();
		var keys:Iterator<K> = map.keys();
		for (k in keys) {
			var key:K = k;
			var value:V = map.get(key);
			abs.set_Item(key, value);
		}
		return abs;
	}

	public inline function iterator() {
		return new CSDictValueIterator<K, V>(this);
	}

	public inline function keys() {
		return new CSDictKeyIterator<K, V>(this);
	}

	public inline function keyValueIterator() {
		return new CSDictKeyValueIterator<K, V>(this);
	}

	public inline function exists(key:K):Bool {
		return this.ContainsKey(key);
	}

	public inline function remove(key:K):Bool {
		var exists = exists(key);
		this.Remove(key);
		return exists;
	}

	@:arrayAccess
	public inline function get(key:K):V {
		if (!this.ContainsKey(key)) {
			throw 'No key $key found in dictionary, try using .exists(key) to check first.';
		}
		return this.get_Item(key);
	}

	@:arrayAccess
	public inline function set(key:K, value:V) {
		this.set_Item(key, value);
	}
}
