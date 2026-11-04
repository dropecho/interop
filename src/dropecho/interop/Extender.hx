package dropecho.interop;

import haxe.Constraints.IMap;

using StringTools;

// @:expose('Extender')
class Extender {
	public static function extendThis<T>(base:T, ?extension):Void {
		if (extension == null) {
			return;
		}
		for (f in Reflect.fields(base)) {
			var def = Reflect.field(base, f);
			var opt = Reflect.field(extension, f);
			Reflect.setField(base, f, opt != null ? opt : def);
		}
	}

	public static function defaults<T>(base:T, ?extension:Any):T {
		if (base == null) {
			throw "Base cannot be null.";
		}
		if (extension == null) {
			return base;
		}

		var extensions:Array<Any> = new Array<Any>();

		if (Std.isOfType(extension, Array)) {
			extensions = (cast extension).filter(x -> x != null);
		} else {
			extensions.push(extension);
		}

		// The base's fields don't change between extensions, so look them up once.
		var baseClass = Type.getClass(base);
		var baseFields = new Map<String, Bool>();
		if (baseClass != null) {
			for (field in Type.getInstanceFields(baseClass)) {
				baseFields.set(field, true);
			}
		}

		for (extension in extensions) {
			var fields = Reflect.fields(extension);
			if (fields.length == 0) {
				fields = typeFieldsOf(extension);
			}

			for (field in fields) {
				#if cs
				// If base is strong typed, and does not have field, skip it for C#.
				if (baseClass != null && !baseFields.exists(field)) {
					continue;
				}
				#end

				var baseField = Reflect.field(base, field);
				var extensionField = Reflect.field(extension, field);

				var bfIsArray = isArray(baseField);
				var bfIsMap = isMap(baseField);
				var bfIsObject = !bfIsArray && !bfIsMap && isObject(baseField);

				// A null array or map in the extension leaves the base's one as it is.
				var isMissingCollection = extensionField == null && (bfIsArray || bfIsMap);
				if (isMissingCollection) {
					continue;
				}

				if (bfIsArray) {
					var copy = AbstractArray.fromAny(extensionField);
					for (value in copy) {
						(cast baseField).push(value);
					}
				} else if (bfIsMap) {
					mergeMap(baseField, extensionField);
				} else if (bfIsObject) {
					defaults(baseField, extensionField);
				} else {
					try {
						Reflect.setField(base, field, extensionField);
					} catch (extension:Dynamic) {
						trace("FAILED SETTING PROP: " + field + " error: " + extension);
					}
				}
			}
		}
		return base;
	}

	// Copies a map's entries into another map. Either can be a Haxe map or, in JS, a native `Map`;
	// the extension can also be a plain object, whose fields become string keys.
	private static function mergeMap(base:Dynamic, extension:Dynamic):Void {
		#if js
		if (Std.isOfType(extension, js.lib.Map)) {
			var nativeMap:js.lib.Map<Dynamic, Dynamic> = extension;
			nativeMap.forEach((value, key, _) -> setMapEntry(base, key, value));
			return;
		}
		#end
		if (Std.isOfType(extension, IMap)) {
			var haxeMap:IMap<Dynamic, Dynamic> = extension;
			for (key => value in haxeMap.keyValueIterator()) {
				setMapEntry(base, key, value);
			}
			return;
		}
		for (field in Reflect.fields(extension)) {
			setMapEntry(base, field, Reflect.field(extension, field));
		}
	}

	// Sets one entry. Calls go through `IMap`, so dead code elimination keeps the map's `set`.
	private static function setMapEntry(map:Dynamic, key:Dynamic, value:Dynamic):Void {
		#if js
		if (Std.isOfType(map, js.lib.Map)) {
			var nativeMap:js.lib.Map<Dynamic, Dynamic> = map;
			nativeMap.set(key, value);
			return;
		}
		#end
		var haxeMap:IMap<Dynamic, Dynamic> = map;
		haxeMap.set(key, value);
	}

	// The fields of an object's class, with property accessors (`get_x`, `set_x`) named after their property.
	private static function typeFieldsOf(object:Any):Array<String> {
		var type = Type.getClass(object);
		if (type == null) {
			return [];
		}
		return Type.getInstanceFields(type).map(f -> {
			var isAccessor = f.startsWith("get_") || f.startsWith("set_");
			if (isAccessor) {
				var parts = f.split('_');
				parts.shift();
				return parts.join('_');
			}
			return f;
		});
	}

	private static function isObject(obj):Bool {
		var stdis = Reflect.isObject(obj);
		var type = Type.getClass(obj);
		var name = type != null ? Type.getClassName(type) : "";

		var refis = name != "String";

		return stdis && refis;
	}

	private static function isArray(obj):Bool {
		return Std.isOfType(obj, Array);
	}

	private static function isMap(obj):Bool {
		#if js
		if (Std.isOfType(obj, js.lib.Map)) {
			return true;
		}
		#end

		var type = Type.getClass(obj);
		var name = type != null ? Type.getClassName(type) : "";
		name = name != null ? name : "";
		return name.startsWith("haxe.ds.") && name.endsWith("Map");
	}
}
