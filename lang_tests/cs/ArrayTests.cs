using System;
using System.Collections.Generic;
using dropecho.interop.test;

public static class ArrayTests {
  public static void RunTests() {
    TypesAreSame();
    SetValuesAreSame();
    CanCreateFromList();
  }

  static void TypesAreSame() {
    var list = new List<int>();
    var testArray = new TestArray<int>();
    Assert.areEqual(testArray.array.GetType(), list.GetType());
  }

  static void SetValuesAreSame() {
    var list = new List<int>();
    list.Add(1);

    var testArray = new TestArray<int>();
    testArray.array.Add(1);

    Assert.areEqual(testArray.array[0], list[0]);
  }

  static void CanCreateFromList() {
    var list = new List<int>();
    var testArray = new TestArray<int>();
    testArray.fromList(list);

    Assert.areEqual(testArray.array.GetType(), list.GetType());
  }
}

