package dropecho.interop.macro;

#if macro
import haxe.macro.Context;
import haxe.macro.Expr;
import haxe.macro.Type;

using haxe.macro.TypeTools;

/**
Picks the JS backing for each use of `AbstractMap<K, V>` from its key type, while compiling.
`String` and number keys stay plain JS objects, enum keys use `EnumValueMap`, and object keys use a native JS `Map`.
A key type that is still generic (a type parameter) can't be checked, so it gets a plain object, as before.
**/
class AbstractMapBuilder {
	static final MAP_PACKAGE = ["dropecho", "interop", "map"];

	/**
	Resolves the `AbstractMap<K, V>` being typed to its backing type.

	@return The backing type, with the same `K` and `V`.
	**/
	public static function build():ComplexType {
		return switch Context.getLocalType() {
			case TInst(_, [key, value]):
				TPath({
					pack: MAP_PACKAGE,
					name: backingName(key),
					params: [TPType(toComplexType(key)), TPType(toComplexType(value))]
				});
			case _:
				Context.fatalError("AbstractMap needs two type parameters: AbstractMap<K, V>.", Context.currentPos());
		}
	}

	static function backingName(key:Type):String {
		return switch key.followWithAbstracts() {
			case TInst(_.get() => {pack: [], name: "String"}, _):
				"StringKeyMap";
			case TAbstract(_.get() => {pack: [], name: "Int" | "Float"}, _):
				"NumberKeyMap";
			case TEnum(_, _) | TAbstract(_.get() => {pack: [], name: "EnumValue"}, _):
				"EnumKeyMap";
			case TInst(_.get() => {kind: KTypeParameter(_)}, _) | TMono(_) | TDynamic(_):
				"StringKeyMap";
			case _:
				"IdentityKeyMap";
		}
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
