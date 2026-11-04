package dropecho.interop;

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

				if (bfIsArray) {
					var copy = AbstractArray.fromAny(extensionField);
					for (value in copy) {
						(cast baseField).push(value);
					}
				} else if (bfIsMap) {
					var extensionMap:haxe.Constraints.IMap<Dynamic, Dynamic> = extensionField;
					for (key => value in extensionMap.keyValueIterator()) {
						(cast baseField).set(key, value);
					}
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
