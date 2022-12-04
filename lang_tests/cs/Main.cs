using System;
using System.Collections.Generic;
using dropecho.interop.test;

public struct config {
  public int x;
  public int y;
}

public class CSharpTests {
  static int Main(string[] args) {
    int returnVal = 0;
    try {
      MapTests.RunTests();
      ArrayTests.RunTests();
      FuncTests.RunTests();
    } catch (Exception e) {
      Assert.ShortMessage(e);
      returnVal = Assert.failedCount;
    }

    Assert.PrintResults();
    return returnVal;
  }

  // var config = new {
  //   i = 2,
  //   f = 3,
  //   m = new Dictionary<string, int>() { { "x", 1 } },
  //   a = new int[] { 1, 2, 3 },
  //   subarr = new[] { new TestClassConfig() { i = 1, f = 2 } }
  // };
  //
  //
  // Console.WriteLine("config.subarr:" + config.subarr.Length);
  //
  // var ttc = new TestThisClass(config);
  //
  // Console.WriteLine("TestThisClass.i:" + ttc.i);
  // Console.WriteLine("TestThisClass.f:" + ttc.f);
  // Console.WriteLine("TestThisClass.map.x:" + ttc.m.get("x"));
  // Console.WriteLine("TestThisClass.map.a:" + ttc.a);
  // Console.WriteLine("TestThisClass.subarr: " + ttc.subarr[0].i);
  //
  // var anotherconfig = new { f = 4 };
  // TestAnotherClass.doSomething(anotherconfig);

  // Console.WriteLine("TestThisClass.test", ttc.test());

  // var x = new { x = 1, y = 2 };
  // TestMap.setMap(x);
  // Console.WriteLine(TestMap.map.get("x"));
  // Console.WriteLine(TestMap.map.get("y"));
  //
  // var dict = new Dictionary<string, int>();
  // dict.Add("test", 120);
  // TestMap.setMap(dict);
  // Console.WriteLine(TestMap.map.get("test"));
}
