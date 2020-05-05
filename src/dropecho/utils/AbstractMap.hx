package dropecho.utils;

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

	#if cs
	@:from
	public static function fromCsDict<V>(m:cs.system.collections.IDictionary):AbstractMap<V> {
		var map = new StringMap<V>();
		var e = m.GetEnumerator();
		while (e.MoveNext()) {
			map.set(e.Current.Key, e.Current.Value);
		}

		return new AbstractMap(map);
	}
	#end

	@:from
	public static function fromAny<V>(d:Any) {
		#if cs
		if (isCsDict(d)) {
			return fromCsDict(d);
		}
		#end

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

	public static function isCsDict(value:Any):Bool {
		#if !cs
		return false;
		#end
		var type = Type.getClass(value);
		var name = Type.getClassName(type);

		return name == "System.Collections.Generic.Dictionary";
	}
}

