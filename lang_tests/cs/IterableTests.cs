using System;
using System.Collections.Generic;
using System.Linq;
using dropecho.interop.test;

public static class IterableTests {
  public static void RunTests() {
    AcceptsList();
    AcceptsArray();
    AcceptsHashSet();
    AcceptsLinqQuery();
    AcceptsEmpty();
  }

  static void AssertItems(List<int> expected, List<int> actual) {
    Assert.areEqual(expected.Count, actual.Count);
    for (var i = 0; i < expected.Count; i++) {
      Assert.areEqual(expected[i], actual[i]);
    }
  }

  static void AcceptsList() {
    var list = new List<int> { 1, 2, 3 };
    AssertItems(list, TestIterable.collect(list));
  }

  static void AcceptsArray() {
    var array = new int[] { 1, 2, 3 };
    AssertItems(new List<int> { 1, 2, 3 }, TestIterable.collect(array));
  }

  static void AcceptsHashSet() {
    var set = new HashSet<int> { 4 };
    AssertItems(new List<int> { 4 }, TestIterable.collect(set));
  }

  static void AcceptsLinqQuery() {
    var query = Enumerable.Range(1, 3).Select(x => x * 2);
    AssertItems(new List<int> { 2, 4, 6 }, TestIterable.collect(query));
  }

  static void AcceptsEmpty() {
    AssertItems(new List<int>(), TestIterable.collect(new int[0]));
  }
}
