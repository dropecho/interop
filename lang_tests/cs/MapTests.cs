using System;
using System.Collections.Generic;
using dropecho.interop.test;

public static class MapTests {
  public static void RunTests() {
    TypesAreSame();
    SetValuesAreSame();
    WhenCreatedFromDictonary_TypesMatch();
    WhenCreatedFromDictonary_SetValuesAreSame();
  }

  static void TypesAreSame() {
    var dict = new Dictionary<int, int>();
    var testMap = new TestMap<int, int>();

    Assert.areEqual(testMap.map.GetType(), dict.GetType());
  }

  static void SetValuesAreSame() {
    var dict = new Dictionary<int, int>();
    dict[1] = 1;
    var testMap = new TestMap<int, int>();
    testMap.map[1] = 1;

    Assert.areEqual(testMap.map.GetType(), dict.GetType());
    Assert.areEqual(testMap.map[1], dict[1]);
  }

  static void WhenCreatedFromDictonary_TypesMatch() {
    var dict = new Dictionary<int, int>();
    var testMap = new TestMap<int, int>();
    testMap.createMapFromDictionary(dict);

    Assert.areEqual(testMap.map.GetType(), dict.GetType());
  }

  static void WhenCreatedFromDictonary_SetValuesAreSame() {
    var dict = new Dictionary<int, int>();
    dict[1] = 1;
    var testMap = new TestMap<int, int>();
    testMap.createMapFromDictionary(dict);

    Assert.areEqual(testMap.map[1], dict[1]);
  }

}
