## A haxe library with utils used by other dropecho libs.

Mostly for internal use.

Documentation to come.

This libaray contains "abstract" classes that allow easier interop with
native code for dropecho libraries.

For example:

#### AbstractArray

in C# acts to a native array.
in JS acts as a native array.

#### AbstractMap

in C# acts as a native dictionary<K,V>.
in JS acts as a native object. (ref by obj[key])
