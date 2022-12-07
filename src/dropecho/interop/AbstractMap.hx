package dropecho.interop;

import haxe.Constraints;
import haxe.ds.StringMap;
import haxe.ds.IntMap;
import haxe.ds.EnumValueMap;
import haxe.ds.ObjectMap;

using StringTools;

@:forward
@:transitive
@:multiType(@:followWithAbstracts K)
abstract AbstractMap<K, V>(Map<K, V>) from Map<K, V> to Map<K, V> {
	public function new();

  @:arrayAccess
  public inline function set(key:K, value:V) this.set(key,value);
  @:arrayAccess
  public inline function get(key:K) this.get(key);

  public inline function clear() this.clear();

  @:to static inline function toStringMap<K:String, V>(t:IMap<K, V>):StringMap<V> {
    return new StringMap<V>();
  }

  @:to static inline function toIntMap<K:Int, V>(t:IMap<K, V>):IntMap<V> {
    return new IntMap<V>();
  }

  @:to static inline function toEnumValueMapMap<K:EnumValue, V>(t:IMap<K, V>):EnumValueMap<K, V> {
    return new EnumValueMap<K, V>();
  }

  @:to static inline function toObjectMap<K:{}, V>(t:IMap<K, V>):ObjectMap<K, V> {
    return new ObjectMap<K, V>();
  }

  @:from static inline function fromStringMap<V>(map:StringMap<V>):AbstractMap<String, V> {
    return cast map;
  }

  @:from static inline function fromIntMap<V>(map:IntMap<V>):AbstractMap<Int, V> {
    return cast map;
  }

  @:from static inline function fromObjectMap<K:{}, V>(map:ObjectMap<K, V>):AbstractMap<K, V> {
    return cast map;
  }

  // CUSTOM STUFF

  @:to
  public static inline function toMap<K, V>(map:IMap<K, V>):Map<K, V> {
    return cast map;
  }

  @:from
  public static inline function fromMap<K, V>(map:IMap<K, V>):AbstractMap<K, V> {
    return map;
  }
}
