package dropecho.interop.macro;

#if macro
import dropecho.interop.macro.Backing;
import haxe.macro.Context;
import haxe.macro.Expr;

/**
Picks the JS backing for each use of `AbstractSet<T>` from its item type, while compiling.
Enum items use `EnumSet`, which compares them by value. Every other item type uses `ValueSet`, backed by a native JS `Map`.
**/
class AbstractSetBuilder {
	static final SET_PACKAGE = ["dropecho", "interop", "set"];

	/**
	Resolves the `AbstractSet<T>` being typed to its backing type.

	@return The backing type, with the same `T`.
	**/
	public static function build():ComplexType {
		return switch Context.getLocalType() {
			case TInst(_, [item]):
				var isEnum = Backing.kindOf(item) == EnumKey;
				Backing.typeOf(SET_PACKAGE, isEnum ? "EnumSet" : "ValueSet", [item]);
			case _:
				Context.fatalError("AbstractSet needs one type parameter: AbstractSet<T>.", Context.currentPos());
		}
	}
}
#end
