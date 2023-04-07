package dropecho.interop;

#if !cs
typedef Action__0 = Void->Void;
typedef Action__1<T1> = T1->Void;
typedef Action__2<T1, T2> = (T1, T2) -> Void;
typedef Func__0<R> = Void->R;
typedef Func__1<T1, R> = T1->R;
typedef Func__2<T1, T2, R> = (T1, T2) -> R;
#elseif cs
@:native("System.Action")
extern class Action__0 {
	public function Invoke():Void;
}

@:native("System.Action")
extern class Action__1<T1> {
	public function Invoke(p1:T1):Void;
}

@:native("System.Action")
extern class Action__2<T1, T2> {
	public function Invoke(p1:T1, p2:T2):Void;
}

@:native('System.Func') extern class Func__0<R> {
	public function Invoke():R;
}

@:native('System.Func') extern class Func__1<T1, R> {
	public function Invoke(p1:T1):R;
}

@:native('System.Func') extern class Func__2<T1, T2, R> {
	public function Invoke(p1:T1, p2:T2):R;
}
#end

@:dce
@:generic
@:nativeGen
abstract Action_0(Action__0) from Action__0 {
	@:from
	public static inline function fromHaxe(f:Void->Void):Action_0 {
		return #if cs
			cs.Syntax.code('() => {0}.__hx_invokeDynamic(new object[]{})', f);
		#else
			f;
		#end
	}

	@:to public inline function toAction():Void->Void {
		return #if cs call #else this #end;
	}

	@:op(a())
	inline function call():Void {
		#if cs this.Invoke(); #else this(); #end
	}
}

@:dce
@:generic
@:nativeGen
abstract Action_1<T1>(Action__1<T1>) from Action__1<T1> {
	@:from
	public static inline function fromHaxe<T1>(f:T1->Void):Action_1<T1> {
		return #if cs
			cs.Syntax.code('(p1) => {0}.__hx_invokeDynamic(new object[]{p1})', f);
		#else
			f;
		#end
	}

	@:to public inline function toAction():T1->Void {
		return #if cs call #else this #end;
	}

	@:op(a())
	inline function call(p1:T1):Void {
		#if cs
		this.Invoke(p1);
		#else
		this(p1);
		#end
	}
}

@:dce
@:generic
@:nativeGen
abstract Action_2<T1, T2>(Action__2<T1, T2>) from Action__2<T1, T2> {
	@:from
	public static inline function fromHaxe<T1, T2>(f:T1->T2->Void):Action_2<T1, T2> {
		return #if cs
			cs.Syntax.code('(p1,p2) => {0}.__hx_invokeDynamic(new object[]{p1,p2})', f);
		#else
			f;
		#end
	}

	@:to public inline function toAction():(T1, T2) -> Void {
		return #if cs call #else this #end;
	}

	@:op(a())
	inline function call(p1:T1, p2:T2):Void {
		#if cs
		this.Invoke(p1, p2);
		#else
		this(p1, p2);
		#end
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_0<R>(Func__0<R>) from Func__0<R> {
	@:from
	public static inline function fromHaxe<R>(f:Void->R):Func_0<R> {
		#if cs
		return cs.Syntax.code('() => {
        var func = {0};
        var val = func.__hx_invokeDynamic(new object[]{});
        var methodInfo = System.Reflection.MethodBase.GetCurrentMethod() as System.Reflection.MethodInfo;
        var type = methodInfo.ReturnType;

        if(type.IsGenericParameter) {
          type = typeof(object);
        }
        
        return (dynamic)System.Convert.ChangeType(val, type ?? typeof(object));
      }', () -> cast f());

		#else
		return f;
		#end
	}

	@:to public inline function toFunc():Void->R {
		return #if cs call #else this #end;
	}

	@:op(a())
	inline function call():R {
		return #if cs untyped __cs__('{0}()', this); #else this(); #end
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_1<T1, R>(Func__1<T1, R>) from Func__1<T1, R> {
	@:from
	public static inline function fromHaxe<T1, R>(f:T1->R):Func_1<T1, R> {
		return #if cs
			cs.Syntax.code('(p1) => {
        var func = {0};
        var val = func.__hx_invokeDynamic(new object[]{p1});
        var methodInfo = System.Reflection.MethodBase.GetCurrentMethod() as System.Reflection.MethodInfo;
        var type = methodInfo.ReturnType;

        if(type.IsGenericParameter) {
          type = typeof(object);
        }
        
        return (dynamic)System.Convert.ChangeType(val, type ?? typeof(object));
 
      }', (i1) -> cast f(i1));

		#else
			f;
		#end
	}

	@:to public inline function toFunc():T1->R {
		return #if cs call #else this #end;
	}

	@:op(a())
	inline function call(p1:T1):R {
		return #if cs
			this.Invoke(p1);
		#else
			this(p1);
		#end
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_2<T1, T2, R>(Func__2<T1, T2, R>) from Func__2<T1, T2, R> {
	@:from
	public static inline function fromHaxe<T1, T2, R>(f:T1->T2->R):Func_2<T1, T2, R> {
		return #if cs
			cs.Syntax.code('(p1, p2) => {
        var func = {0};
        var val = func.__hx_invokeDynamic(new object[]{p1, p2});
        var methodInfo = System.Reflection.MethodBase.GetCurrentMethod() as System.Reflection.MethodInfo;
        var type = methodInfo.ReturnType;

        if(type.IsGenericParameter) {
          type = typeof(object);
        }
        
        return (dynamic)System.Convert.ChangeType(val, type ?? typeof(object));
 
      }', (i1, i2) -> cast f(i1, i2));

		#else
			f;
		#end
	}

	@:to public inline function toFunc():(T1, T2) -> R {
		return #if cs call #else this #end;
	}

	@:op(a())
	inline function call(p1:T1, p2:T2):R {
		return #if cs
			this.Invoke(p1, p2);
		#else
			this(p1, p2);
		#end
	}
}
