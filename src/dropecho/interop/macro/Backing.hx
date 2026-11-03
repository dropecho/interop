package dropecho.interop.macro;

#if macro
import haxe.macro.Expr;
import haxe.macro.Type;

using haxe.macro.TypeTools;

/** How a key or item type compares, which decides the JS backing a collection gets. **/
enum KeyKind {
	/** `String`, or an abstract over it. **/
	StringKey;

	/** `Int` or `Float`, or an abstract over one. **/
	NumberKey;

	/** An enum value, compared by value. **/
	EnumKey;

	/** A class, anonymous object, function or `Bool`, compared by identity (or by value for `Bool`). **/
	ObjectKey;

	/** A type parameter or other type that is still unknown while compiling. **/
	GenericKey;
}

/** Shared helpers for the `@:genericBuild` macros that pick a JS backing per use. **/
class Backing {
	/**
	Classifies a key or item type.

	@param type The type to classify.
	@return The kind of key it is.
	**/
	public static function kindOf(type:Type):KeyKind {
		return switch type.followWithAbstracts() {
			case TInst(_.get() => {pack: [], name: "String"}, _):
				StringKey;
			case TAbstract(_.get() => {pack: [], name: "Int" | "Float"}, _):
				NumberKey;
			case TEnum(_, _) | TAbstract(_.get() => {pack: [], name: "EnumValue"}, _):
				EnumKey;
			case TInst(_.get() => {kind: KTypeParameter(_)}, _) | TMono(_) | TDynamic(_):
				GenericKey;
			case _:
				ObjectKey;
		}
	}

	/**
	Builds a reference to a backing type, passing the use site's type parameters on.

	@param pack The backing type's package.
	@param name The backing type's name.
	@param params The type parameters to pass on.
	@return The backing type.
	**/
	public static function typeOf(pack:Array<String>, name:String, params:Array<Type>):ComplexType {
		return TPath({
			pack: pack,
			name: name,
			params: [for (param in params) TPType(toComplexType(param))]
		});
	}

	// An unresolved type can't be written as syntax, so it is left for the compiler to infer.
	static function toComplexType(type:Type):ComplexType {
		var complexType = type.toComplexType();
		if (complexType == null) {
			return TPath({pack: [], name: "Dynamic"});
		}
		return complexType;
	}
}
#end
