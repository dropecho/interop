package dropecho.interop;

import haxe.iterators.DynamicAccessKeyValueIterator;
import haxe.DynamicAccess;
import haxe.Constraints.IMap;

class JSAbstractMapKeyValueIterator<K, V> {
	var _iter:DynamicAccessKeyValueIterator<V>;

	public function new(map:AbstractMap<K, V>) {
		_iter = new DynamicAccessKeyValueIterator(map);
	}

	public function hasNext():Bool {
		return _iter.hasNext();
	}

	public function next():{key:K, value:V} {
		return cast _iter.next();
	}
}

@:forward
abstract AbstractMap<K, V>(DynamicAccess<Dynamic>) from DynamicAccess<Dynamic> to DynamicAccess<Dynamic> {
	public function new(?s:DynamicAccess<Dynamic>) {
		if (s != null) {
			this = s;
		} else {
			this = new DynamicAccess<Dynamic>();
		}
	}

	//   @:from
	//   public static inline function fromDynamic(map:Dynamic):AbstractMap<String, Dynamic> {
	//     return fromDynamicAccess(map);
	//   }
	//   @:from
	//   public static inline function fromDynamicAccess(map:DynamicAccess<Dynamic>):AbstractMap<String, Dynamic> {
	//     return new AbstractMap<String, Dynamic>(map);
	//   }
	public inline function keyValueIterator() {
		return new JSAbstractMapKeyValueIterator<K, V>(this);
	}

	@:from
	public static inline function fromMap<K, V>(map:Map<K, V>):AbstractMap<K, V> {
		return fromIMap(cast map);
	}

	@:from public static inline function fromIMap<K, V>(map:IMap<K, V>):AbstractMap<K, V> {
		var abs = new AbstractMap<K, V>();
		for (k => v in map.keyValueIterator()) {
			abs[k] = v;
		}
		return abs;
	}

	public inline function exists(key:K):Bool {
		return this.exists(Std.string(key));
	}

	@:arrayAccess
	public inline function get(key:K):V {
		return this.get(Std.string(key));
	}

	@:arrayAccess
	public inline function set(key:K, value:V):V {
		this.set(Std.string(key), value);
		return value;
	}

	public inline function clear() {
		for (key in this.keys()) {
			this.remove(key);
		}
	}
}
