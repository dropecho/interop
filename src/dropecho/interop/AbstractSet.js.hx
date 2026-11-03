package dropecho.interop;

/**
A set of unique items, with an optional key function that decides which items are equal.

| Item type | JS backing | Equal when |
| --- | --- | --- |
| `String`, numbers, `Bool` | `ValueSet` (native `Map`) | same value |
| class, anonymous object | `ValueSet` (native `Map`) | same object |
| enum | `EnumSet` (`EnumValueMap`) | same value, e.g. `Floor(1)` |
| any, with a key function | either | same key |

The backing is picked while compiling, by `dropecho.interop.macro.AbstractSetBuilder`.
**/
@:genericBuild(dropecho.interop.macro.AbstractSetBuilder.build())
class AbstractSet<T> {}
