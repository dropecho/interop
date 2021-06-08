using System;

public static class Assert {
  public static int totalCount = 0;
  public static int passedCount = 0;
  public static int failedCount = 0;

  public static void areEqual(object actual, object expected) {
    totalCount++;
    if (!actual.Equals(expected)) {
      failedCount++;
      throw new Exception($"Expected {actual} to equal {expected}.");
    } else {
      passedCount++;
    }
  }

  public static void isNotNull(object actual) {
    totalCount++;
    if (actual == null) {
      failedCount++;
      throw new Exception($"Expected {actual} to not be null.");
    } else {
      passedCount++;
    }
  }

  public static void PrintResults() {
    Console.WriteLine(failedCount == 0 ? "PASSED" : "FAILED");
    Console.Write($"Tests: {totalCount} ");
    Console.Write($"Passed: {passedCount} ");
    Console.Write($"Failed: {failedCount} ");
    Console.WriteLine("");
  }

  public static void ShortMessage(Exception e) {
    var lines = e.StackTrace.Split('\n');
    var testName = "";
    if (lines.Length > 0 && lines[0].Contains("at Assert.")) {
      var at = lines[1].IndexOf("at") + 2;
      var paren = lines[1].IndexOf("(");

      testName = lines[1].Substring(at, paren - at).Trim();
    }

    Console.WriteLine($"TEST FAILED ({testName}): {e.Message}");
  }

  public static void NiceMessage(Exception e) {
    var lines = e.StackTrace.Split('\n');
    string output = "";

    foreach (var line in lines) {
      if (line.Contains("at Assert.")) {
        continue;
      }
      output += line.Substring(0, line.IndexOf("(")) + "\n";
    }
    Console.WriteLine($"TEST FAILED: {e.Message}\n{output}");
  }
}

