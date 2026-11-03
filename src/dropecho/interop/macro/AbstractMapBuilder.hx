package dropecho.interop.macro;

#if macro
import dropecho.interop.macro.Backing;
import haxe.macro.Context;
import haxe.macro.Expr;

/**
Picks the JS backing for each use of `AbstractMap<K, V>` from its key type, while compiling.
`String` and number keys stay plain JS objects, enum keys use `EnumValueMap`, and object keys use a native JS `Map`.
A key type that is still generic (a type parameter) can't be checked, so it gets a plain object, as before.
**/
class AbstractMapBuilder {
	static final MAP_PACKAGE = ["dropecho", "interop", "map"];

	static final BACKING_BY_KIND = [
		StringKey => "StringKeyMap",
		NumberKey => "NumberKeyMap",
		EnumKey => "EnumKeyMap",
		ObjectKey => "IdentityKeyMap",
		GenericKey => "StringKeyMap"
	];

	/**
	Resolves the `AbstractMap<K, V>` being typed to its backing type.

	@return The backing type, with the same `K` and `V`.
	**/
	public static function build():ComplexType {
		return switch Context.getLocalType() {
			case TInst(_, [key, value]):
				Backing.typeOf(MAP_PACKAGE, BACKING_BY_KIND[Backing.kindOf(key)], [key, value]);
			case _:
				Context.fatalError("AbstractMap needs two type parameters: AbstractMap<K, V>.", Context.currentPos());
		}
	}
}
#end
