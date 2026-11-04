## A haxe library with utils used by other dropecho libs.

Mostly for internal use.

This libary contains "abstract" classes that allow easier interop with
native code for dropecho libraries.

For example:

#### AbstractArray

in C# acts as a List<T>.
in JS acts as a native array.

#### AbstractIterable

in C# acts as an IEnumerable<T> (accepts List<T>, arrays, HashSet<T>, LINQ queries, ...).
in JS acts as a haxe Iterable.

#### AbstractMap

in C# acts as a native dictionary<K,V>.
in JS the shape depends on the key type, picked while compiling:

| Key type | JS shape |
| --- | --- |
| `String` | plain object (ref by `obj[key]`) |
| `Int`, `Float` | plain object; keys come back as numbers when iterated |
| enum | Haxe `EnumValueMap`; keys compare by value |
| class, anonymous object, `Bool` | native `Map`; objects compare by identity, like C# |
| a type parameter | plain object; keys come back as strings when iterated |

#### AbstractSet

A set of unique items. Pass a key function to decide which items are equal:

```haxe
var seen = new AbstractSet<String>();
var tiles = new AbstractSet<Tile>(t -> t.y * width + t.x); // same position = same tile
```

in C# acts as a native HashSet<T> (a key function becomes its comparer).
in JS is a small wrapper, picked while compiling from the item type:

| Item type | JS backing | Equal when |
| --- | --- | --- |
| `String`, numbers, `Bool` | native `Map` | same value |
| class, anonymous object | native `Map` | same object |
| enum | Haxe `EnumValueMap` | same value, e.g. `Floor(1)` |
| any, with a key function | either | same key |

#### AbstractFunc
in C# will convert to action_X or func_X where X is # of inputs/type params.
in JS is a function.

In C#, a Haxe function passed as a `Func_N`/`Action_N` becomes a delegate that calls it with typed arguments. Turning that delegate back into a Haxe function gives back the original function.

Add `-D dropecho-interop-unboxed` to also pass `Int`/`Float` arguments and results without boxing, which makes numeric calls about 2–5x faster. It relies on internals of the Haxe C# target, so it's off by default.
