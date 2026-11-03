package dropecho.interop;

/**
A map that compiles to the most natural JS shape for its key type.

| Key type | JS shape |
| --- | --- |
| `String` | plain object (`obj[key]`, JSON-friendly) |
| `Int`, `Float` | plain object; keys come back as numbers when iterated |
| enum | Haxe `EnumValueMap`; keys compare by value |
| class, anonymous object, `Bool` | native `Map`; objects compare by identity |
| a type parameter | plain object; keys come back as strings when iterated |

The choice is made while compiling, by `dropecho.interop.macro.AbstractMapBuilder`.
**/
@:genericBuild(dropecho.interop.macro.AbstractMapBuilder.build())
class AbstractMap<K, V> {}
