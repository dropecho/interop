package dropecho.utils;

using StringTools;

@:expose('Extender')
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
		if (extension == null) {
			return base;
		}

		var extensions:Array<Any> = new Array<Any>();

		if (Std.is(extension, Array)) {
			extensions = (cast extension).filter(x -> x != null);
		} else {
			extensions.push(extension);
		}

		for (ex in extensions) {
			var fields = Reflect.fields(ex);
			var exType = Type.getClass(ex);
			var typeFields = exType != null ? Type.getInstanceFields(exType).map(f -> f.split('_')[1]) : [];
			fields = fields.length == 0 ? typeFields : fields;

			for (ff in fields) {
				var exField = Reflect.field(ex, ff);
				var baseField = Reflect.field(base, ff);

				var bfIsArray = isArray(baseField);
				var bfIsMap = isMap(baseField);
				var bfIsObject = !bfIsArray && !bfIsMap && isObject(baseField);

				if (bfIsArray) {
					var copy = AbstractArray.fromAny(exField);
					for (v in copy) {
						(cast baseField).push(v);
					}
				} else if (bfIsMap) {
					var copy = AbstractMap.fromAny(exField);
					for (k => v in copy.keyValueIterator()) {
						(cast baseField).set(k, v);
					}
				} else if (bfIsObject) {
					defaults(baseField, exField);
				} else {
					Reflect.setField(base, ff, exField);
				}
			}
		}
		return base;
	}

	private static function isObject(obj):Bool {
		var stdis = Reflect.isObject(obj);
		var type = Type.getClass(obj);
		var name = type != null ? Type.getClassName(type) : "";

		var refis = name != "String";

		return stdis && refis;
	}

	private static function isArray(obj):Bool {
		return Std.is(obj, Array);
	}

	private static function isMap(obj):Bool {
		#if js
		if (Std.is(obj, js.lib.Map)) {
			return true;
		}
		#end

		var type = Type.getClass(obj);
		var name = type != null ? Type.getClassName(type) : "";
		name = name != null ? name : "";
		var isMap = name.startsWith("haxe.ds.") && name.endsWith("Map");
		return isMap;
	}
}
