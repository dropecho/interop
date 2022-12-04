using System;
using System.Collections.Generic;
using dropecho.interop.test;

public static class FuncTests {
  public static void RunTests() {
    TypesAreSame();
    CanCreateFromAction0();
    CanReturnAction0FromHaxe();

    CanCreateFromAction1();
    CanReturnAction1FromHaxe();

    CanCreateFromAction2();
    CanReturnAction2FromHaxe();

    CanCreateFromFunc0();
    CanReturnFunc0FromHaxe();

    CanCreateFromFunc1();
    CanReturnFunc1FromHaxe();

    CanCreateFromFunc2();
    CanReturnFunc2FromHaxe();
  }

  static void TypesAreSame() {
    Action func = () => Console.Write("test");
    var testFunc = new TestFunc<int, int, int>();
    Assert.areEqual(testFunc.Action0.GetType(), func.GetType());
  }

  static void CanReturnAction0FromHaxe() {
    var testFunc = new TestFunc<int, int, int>();
    testFunc.Action0();
    Assert.isNotNull(testFunc.Action0);
  }

  static void CanReturnAction1FromHaxe() {
    var testFunc = new TestFunc<int, int, int>();
    testFunc.Action1(1);
    Assert.isNotNull(testFunc.Action1);
  }

  static void CanReturnAction2FromHaxe() {
    var testFunc = new TestFunc<int, int, int>();
    testFunc.Action2(1,2);
    Assert.isNotNull(testFunc.Action2);
  }

  static void CanCreateFromAction0() {
    Action func = () => Console.Write("test");
    var testFunc = new TestFunc<int, int, int>();
    testFunc.createAction0(func);

    Assert.areEqual(testFunc.Action0.GetType(), func.GetType());
  }

  static void CanCreateFromAction1() {
    Action<int> func = (a) => Console.Write("test:" + a);
    var testFunc = new TestFunc<int, int, int>();
    testFunc.createAction1(func);

    Assert.areEqual(testFunc.Action1.GetType(), func.GetType());
  }

  static void CanCreateFromAction2() {
    Action<int, int> func = (a, b) => Console.Write("test:" + a + b);
    var testFunc = new TestFunc<int, int, int>();
    testFunc.createAction2(func);

    Assert.areEqual(testFunc.Action2.GetType(), func.GetType());
  }

  static void CanCreateFromFunc0() {
    var val = 32;
    Func<int> func = () => val;
    var testFunc = new TestFunc<int, int, int>();
    testFunc.createFunc0(func);

    var output = func();

    Assert.areEqual(testFunc.Func0.GetType(), func.GetType());
    Assert.areEqual(output, val);
  }

  static void CanReturnFunc0FromHaxe() {
    var testFunc = new TestFunc<int, int, int>();
    var val = 32;
    var output = testFunc.Func0();

    Assert.areEqual(testFunc.Func0.GetType(), typeof(Func<int>));
    Assert.areEqual(output, val);
  }

  static void CanCreateFromFunc1() {
    Func<int, int> func = (a) => a;
    var testFunc = new TestFunc<int, int, int>();
    testFunc.createFunc1(func);

    Assert.areEqual(testFunc.Func1.GetType(), func.GetType());
  }

  static void CanReturnFunc1FromHaxe() {
    var testFunc = new TestFunc<int, int, int>();
    var val = 32;
    var output = testFunc.Func1(val);

    Assert.areEqual(testFunc.Func1.GetType(), typeof(Func<int,int>));
    Assert.areEqual(output, val);
  }

  static void CanCreateFromFunc2() {
    Func<int, int, int> func = (a, b) => a + b;
    var testFunc = new TestFunc<int, int, int>();
    testFunc.createFunc2(func);

    Assert.areEqual(testFunc.Func2.GetType(), func.GetType());
  }

  static void CanReturnFunc2FromHaxe() {
    var testFunc = new TestFunc<int, int, int>();
    var val = 32;
    var output = testFunc.Func2(val, val);

    Assert.areEqual(testFunc.Func2.GetType(), typeof(Func<int,int,int>));
    Assert.areEqual(output, val);
  }


}

