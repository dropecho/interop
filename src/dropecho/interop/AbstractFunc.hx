package dropecho.interop;

// #if (js || php7)
#if !cs
typedef Action__0 = Void->Void;
typedef Action__1<T1> = T1->Void;
typedef Action__2<T1, T2> = (T1, T2) -> Void;
typedef Func__0<R> = Void->R;
typedef Func__1<T1, R> = T1->R;
typedef Func__2<T1, T2, R> = (T1, T2) -> R;
#elseif cs
@:native('System.Action') extern class Action__0 {}
@:native('System.Action') extern class Action__1<T1> {}
@:native('System.Action') extern class Action__2<T1, T2> {}
@:native('System.Func') extern class Func__0<R> {}
@:native('System.Func') extern class Func__1<T1, R> {}
@:native('System.Func') extern class Func__2<T1, T2, R> {}
#end

@:dce
abstract Action_0(Action__0) from Action__0 {
	@:from
	public static inline function fromHaxe(f:Void->Void):Action_0 {
		return #if cs
			cs.Syntax.code('() => {0}.__hx_invokeDynamic(new object[]{})', f);
		#else
			f;
		#end
	}

	@:to
	public inline function toHaxe():Void->Void {
		return #if cs call #else this #end;
	}

	public inline function call():Void {
		#if cs
		cs.Syntax.code('{0}()', this);
		#else
		this();
		#end
	}
}

//     public virtual object __hx_invokeDynamic(object[] __fn_dynargs) {

@:dce
abstract Action_1<T1>(Action__1<T1>) from Action__1<T1> {
	@:from
	public static inline function fromHaxe<T1>(f:T1->Void):Action_1<T1> {
		return #if cs
			cs.Syntax.code('(p1) => {0}.__hx_invokeDynamic(new object[]{p1})', f);
		#else
			f;
		#end
	}

	@:to
	public inline function toHaxe():T1->Void {
		return #if cs call #else this #end;
	}

	public inline function call(p1:T1):Void {
		#if cs
		untyped __cs__('{0}({1})', this, p1);
		#else
		this(p1);
		#end
	}
}

@:dce
abstract Action_2<T1, T2>(Action__2<T1, T2>) from Action__2<T1, T2> {
	@:from
	public static inline function fromHaxe<T1, T2>(f:T1->T2->Void):Action_2<T1, T2> {
		return #if cs
			cs.Syntax.code('(p1,p2) => {0}.__hx_invokeDynamic(new object[]{p1,p2})', f);
		#else
			f;
		#end
	}

	@:to
	public inline function toHaxe():T1->T2->Void {
		return #if cs call #else this #end;
	}

	public inline function call(p1:T1, p2:T2):Void {
		#if cs
		untyped __cs__('{0}({1}, {2})', this, p1, p2);
		#else
		this(p1, p2);
		#end
	}
}

@:dce
abstract Func_0<R>(Func__0<R>) from Func__0<R> {
	@:from
	public static inline function fromHaxe<R>(f:Void->R):Func_0<R> {
		return #if cs untyped __cs__('() => {0}', f()); #else f; #end
	}

	@:to
	public inline function toHaxe():Void->R {
		return #if cs call #else this #end;
	}

	@:op("()")
	public inline function call():R {
		return #if cs untyped __cs__('{0}()', this); #else this(); #end
	}
}

@:dce
abstract Func_1<T1, R>(Func__1<T1, R>) from Func__1<T1, R> {
	@:from
	public static inline function fromHaxe<T1, R>(f:T1->R):Func_1<T1, R> {
		return #if cs
			cs.Syntax.code('(p1) => {
        return (dynamic){0}.__hx_invokeDynamic(new object[]{p1});
      }', f);
		#else
			f;
		#end
	}

	@:to
	public inline function toHaxe():T1->R {
		return call;
	}

	// @:functionCode("return this(p1);")
	public inline function call(p1:T1):R {
		// return #if cs null #else this(p1) #end;
		return #if cs untyped __cs__('{0}({1})', this, p1); #else this(p1); #end
	}
}

@:dce
abstract Func_2<T1, T2, R>(Func__2<T1, T2, R>) from Func__2<T1, T2, R> {
	@:from
	public static inline function fromHaxe<T1, T2, R>(f:T1->T2->R):Func_2<T1, T2, R> {
		return #if cs
			cs.Syntax.code('(p1,p2) => {
        return (dynamic){0}.__hx_invokeDynamic(new object[]{p1,p2});
      }', f);
		#else
			f;
		#end
	}

	@:to
	public inline function toHaxe():T1->T2->R {
		return #if cs call #else this #end;
	}

	public inline function call(p1:T1, p2:T2):R {
		return #if cs untyped __cs__('{0}({1}, {2})', this, p1, p2); #else this(p1, p2); #end
	}
}
