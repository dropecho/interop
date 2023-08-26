package dropecho.interop;

typedef Action__0 = Void->Void;
typedef Action__1<T1> = T1->Void;
typedef Action__2<T1, T2> = (T1, T2) -> Void;
typedef Func__0<R> = Void->R;
typedef Func__1<T1, R> = T1->R;
typedef Func__2<T1, T2, R> = (T1, T2) -> R;

@:dce
@:generic
@:nativeGen
abstract Action_0(Action__0) from Action__0 {
	@:from
	public static inline function fromHaxe(f:Void->Void):Action_0 {
		return f;
	}

	@:to public inline function toAction():Void->Void {
		return this;
	}

	@:op(a())
	inline function call():Void {
		this();
	}
}

@:dce
@:generic
@:nativeGen
abstract Action_1<T1>(Action__1<T1>) from Action__1<T1> {
	@:from
	public static inline function fromHaxe<T1>(f:T1->Void):Action_1<T1> {
		return f;
	}

	@:to public inline function toAction():T1->Void {
		return this;
	}

	@:op(a())
	inline function call(p1:T1):Void {
		this(p1);
	}
}

@:dce
@:generic
@:nativeGen
abstract Action_2<T1, T2>(Action__2<T1, T2>) from Action__2<T1, T2> {
	@:from
	public static inline function fromHaxe<T1, T2>(f:T1->T2->Void):Action_2<T1, T2> {
		return f;
	}

	@:to public inline function toAction():(T1, T2) -> Void {
		return this;
	}

	@:op(a())
	inline function call(p1:T1, p2:T2):Void {
		return this(p1, p2);
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_0<R>(Func__0<R>) from Func__0<R> {
	@:from
	public static inline function fromHaxe<R>(f:Void->R):Func_0<R> {
		return f;
	}

	@:to public inline function toFunc():Void->R {
		return this;
	}

	@:op(a())
	inline function call():R {
		return this();
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_1<T1, R>(Func__1<T1, R>) from Func__1<T1, R> {
	@:from
	public static inline function fromHaxe<T1, R>(f:T1->R):Func_1<T1, R> {
		return f;
	}

	@:to public inline function toFunc():T1->R {
		return this;
	}

	@:op(a())
	inline function call(p1:T1):R {
		return this(p1);
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_2<T1, T2, R>(Func__2<T1, T2, R>) from Func__2<T1, T2, R> {
	@:from
	public static inline function fromHaxe<T1, T2, R>(f:T1->T2->R):Func_2<T1, T2, R> {
		return f;
	}

	@:to public inline function toFunc():(T1, T2) -> R {
		return this;
	}

	@:op(a())
	inline function call(p1:T1, p2:T2):R {
		return this(p1, p2);
	}
}
