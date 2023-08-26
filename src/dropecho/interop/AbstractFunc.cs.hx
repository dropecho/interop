package dropecho.interop;

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

@:dce
@:generic
@:nativeGen
abstract Action_0(Action__0) from Action__0 {
	@:from
	public static inline function fromHaxe(f:Void->Void):Action_0 {
		return cs.Syntax.code('() => {0}.__hx_invokeDynamic(new object[]{})', f);
	}

	@:to public inline function toAction():Void->Void {
		return call;
	}

	@:op(a())
	inline function call():Void {
		return this.Invoke();
	}
}

@:dce
@:generic
@:nativeGen
abstract Action_1<T1>(Action__1<T1>) from Action__1<T1> {
	@:from
	public static inline function fromHaxe<T1>(f:T1->Void):Action_1<T1> {
		return cs.Syntax.code('(p1) => {0}.__hx_invokeDynamic(new object[]{p1})', f);
	}

	@:to public inline function toAction():T1->Void {
		return call;
	}

	@:op(a())
	inline function call(p1:T1):Void {
		return this.Invoke(p1);
	}
}

@:dce
@:generic
@:nativeGen
abstract Action_2<T1, T2>(Action__2<T1, T2>) from Action__2<T1, T2> {
	@:from
	public static inline function fromHaxe<T1, T2>(f:T1->T2->Void):Action_2<T1, T2> {
		return cs.Syntax.code('(p1,p2) => {0}.__hx_invokeDynamic(new object[]{p1,p2})', f);
	}

	@:to public inline function toAction():(T1, T2) -> Void {
		return call;
	}

	@:op(a())
	inline function call(p1:T1, p2:T2):Void {
		this.Invoke(p1, p2);
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_0<R>(Func__0<R>) from Func__0<R> {
	@:from
	public static inline function fromHaxe<R>(f:Void->R):Func_0<R> {
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

	}

	@:to public inline function toFunc():Void->R {
		return call;
	}

	@:op(a())
	inline function call():R {
		return untyped __cs__('{0}()', this);
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_1<T1, R>(Func__1<T1, R>) from Func__1<T1, R> {
	@:from
	public static inline function fromHaxe<T1, R>(f:T1->R):Func_1<T1, R> {
		return cs.Syntax.code('(p1) => {
        var func = {0};
        var val = func.__hx_invokeDynamic(new object[]{p1});
        var methodInfo = System.Reflection.MethodBase.GetCurrentMethod() as System.Reflection.MethodInfo;
        var type = methodInfo.ReturnType;

        if(type.IsGenericParameter) {
          type = typeof(object);
        }
        
        return (dynamic)System.Convert.ChangeType(val, type ?? typeof(object));
 
      }', (i1) -> cast f(i1));

	}

	@:to public inline function toFunc():T1->R {
		return call;
	}

	@:op(a())
	inline function call(p1:T1):R {
		return this.Invoke(p1);
	}
}

@:dce
@:generic
@:nativeGen
abstract Func_2<T1, T2, R>(Func__2<T1, T2, R>) from Func__2<T1, T2, R> {
	@:from
	public static inline function fromHaxe<T1, T2, R>(f:T1->T2->R):Func_2<T1, T2, R> {
		return cs.Syntax.code('(p1, p2) => {
        var func = {0};
        var val = func.__hx_invokeDynamic(new object[]{p1, p2});
        var methodInfo = System.Reflection.MethodBase.GetCurrentMethod() as System.Reflection.MethodInfo;
        var type = methodInfo.ReturnType;

        if(type.IsGenericParameter) {
          type = typeof(object);
        }
        
        return (dynamic)System.Convert.ChangeType(val, type ?? typeof(object));
 
      }', (i1, i2) -> cast f(i1, i2));

	}

	@:to public inline function toFunc():(T1, T2) -> R {
		return call;
	}

	@:op(a())
	inline function call(p1:T1, p2:T2):R {
		return this.Invoke(p1, p2);
	}
}
