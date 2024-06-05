package dropecho.interop;

using Lambda;
using StringTools;

class Extender {
	public static function extendThis<T>(base:T, ?extension):Void {
		js.Syntax.code('base = Object.assign(base, extension)', base, extension);
	}

	public static function defaults<T>(base:T, ?extension:Any):T {
		if (Std.isOfType(extension, Array)) {
			return js.Syntax.code('Object.assign(base, ...extension)', base, extension);
		}
		return js.Syntax.code('Object.assign(base, extension)', base, extension);
	}
}
