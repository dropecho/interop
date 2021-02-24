package dropecho.interop;

import haxe.Constraints;
import haxe.ds.IntMap;
import haxe.ds.StringMap;
import cs.system.collections.generic.IDictionary_2;
import cs.system.collections.generic.Dictionary_2;
import cs.system.collections.Hashtable;
import cs.system.collections.IEnumerator;

using StringTools;

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

abstract AbstractMap<K, V>(IDictionary_2<K, V>) from IDictionary_2<K, V> to IDictionary_2<K, V> {
	public function new(s:IDictionary_2<K, V> = null) {
		if (s != null) {
			this = s;
		} else {
			this = new Dictionary_2<K, V>();
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

	public function iterator() {
		return new CSDictValueIterator<K, V>(this);
	}

	public function keys() {
		return new CSDictKeyIterator<K, V>(this);
	}

	public function keyValueIterator() {
		return new CSDictKeyValueIterator<K, V>(this);
	}

	public function set(key:K, value:V) {
		this.Add(key, value);
	}

	public function exists(key:K):Bool {
		return this.ContainsKey(key);
	}

	@:op([])
	public function get(key:K):V {
		return this.get_Item(key);
	}
}
