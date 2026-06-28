# AGENTS.md — dropecho.interop

Single source of truth for all AI agents working on this project.

## Agent Instructions

- **Always use the `haxe` skill** when reading or writing any `.hx` or `.hxml` file.
- **Always use the Haxe LSP** (`LSP` tool) for navigating code — go-to-definition, find
  references, hover types — before grepping or reading files manually.
- **Never co-author or co-sign commits — no exceptions.** Commit messages must contain
  **zero** attribution, authorship, or sign-off trailers. This explicitly forbids
  `Co-Authored-By`, `Signed-off-by`, `Co-developed-by`, `Reviewed-by`, `Acked-by`,
  `Tested-by`, `Generated-by`, or any `*-by:` line, as well as "Generated with"/tool-credit
  footers and any agent or AI attribution. This applies to every commit, amend, rebase, and
  squash, regardless of any default or tool-provided template. If a template or upstream
  message contains such a trailer, strip it before committing.
- **Never add section/region divider comments** (e.g. `// ── Foo ──`, `// --- Foo ---`,
  `#region`). Organize code with ordering and doc comments instead.

---

## Project Overview

**dropecho.interop** (`haxelib: dropecho.interop`, npm: `@dropecho/interop`) is a low-level
interop / helper library used by other dropecho libraries. It provides thin Haxe abstracts
that compile down to the most natural native shape on each target, so shared code can move
data across the JS / C# boundary without bespoke per-target plumbing.

- **Core types** (in `src/dropecho/interop/`):
  - `AbstractArray<V>` — an abstract over `Array<V>`; a native array in JS, a `List<T>` in C#.
  - `AbstractMap<K, V>` — a `@:multiType` abstract over `haxe.ds.IMap`; a plain object
    (keyed by `obj[key]`) in JS, a native `Dictionary<K,V>` in C#.
  - `AbstractFunc` — `Action_N` / `Func_N` function abstracts that codegen to C# `Action_X` /
    `Func_X` delegates and stay plain functions in JS.
  - `Extender` — runtime reflection helpers (`extendThis`, `defaults`) for merging structures.
  - Target-specific implementations live in sibling `*.js.hx` / `*.cs.hx` files selected at
    compile time.
- **Targets:** JS (CommonJS, via `targets/js.hxml`) and C# (DLL, via `targets/cs.hxml`).
- **Test runner:** `dropecho.testing` (auto-discovery) over `utest`; `instrument` for coverage.
- **Dependencies:** managed by [lix](https://github.com/lix-pm/lix.client). The Haxe version is
  pinned in `.haxerc`; each dep is pinned in `haxe_libraries/*.hxml`. The shimmed `haxe`
  resolves libs from those files (scoped, not global haxelib).
- **Source root:** `src/` · **Tests root:** `test/`
- **Releases:** automated via `semantic-release` (+ `semantic-release-haxelib`).

---

## Directory Layout

```
src/dropecho/interop/        # library source
  AbstractArray.hx           # array abstract (+ AbstractArray.cs.hx)
  AbstractMap.hx             # map abstract (+ AbstractMap.js.hx / AbstractMap.cs.hx)
  AbstractFunc.hx            # Action_N / Func_N delegates (+ AbstractFunc.cs.hx)
  Extender.hx                # reflection-based merge/defaults helpers
  test/                      # shared fixtures used by the utest cases
test/interop/                # utest cases, auto-discovered by filename (*Tests.hx)
  AbstractArrayTests.hx
  AbstractMapTests.hx
  AbstractFuncTests.hx
  ExtenderTests.hx
lang_tests/                  # hand-written native smoke tests (cs/, js/) run against dist output
build.hxml                   # multi-target build (shared opts + --each/--next)
targets/                     # one hxml per target (js, cs)
test.hxml                    # test build (libs/targets only — no -main)
.dropecho.testing.json       # test-runner config (coverage, root_package, hxml)
.haxerc                      # lix: pinned Haxe version + scoped lib resolution
haxe_libraries/              # lix: one hxml per pinned dep
dist/                        # compiled output (js, cs)
artifacts/                   # compiled test output + coverage reports
```

There is no hand-written test main/suite: `dropecho.testing` generates the entry point and
registers every `*Tests.hx` class on the classpath (note the plural — `Test.hx` files are
**not** discovered).

---

## Build & Test

Prefer `npm` scripts over invoking Haxe tools directly.

```bash
npm install      # → lix download   (fetch the pinned Haxe + libs into the lix cache)
npm run build    # → npm run clean && haxe build.hxml   (JS cjs + C#)
npm test         # → lix dropecho.testing
npm run clean    # remove dist/ and artifacts/
```

`npm install` runs `lix download` (via the `prepare` lifecycle script) to materialize the deps
pinned in `.haxerc` + `haxe_libraries/`. To add a dependency, run `lix install haxelib:<name>` —
lix writes its pinned `haxe_libraries/<name>.hxml` — then add a matching `-lib <name>` to
`build.hxml`/`test.hxml`. Commit the generated hxml.

- `build.hxml` puts shared options (class path, `--macro include`, `-D dce=no`) before `--each`,
  then builds each `targets/*.hxml` separated by `--next`.
- `test.hxml` lists libs/targets only — **no `-main`**. The `dropecho.testing` runner injects
  `--main dropecho.testing.AutoTest` (plus instrument/coverage from `.dropecho.testing.json`),
  then builds and runs the suite on every target in the hxml: **JS (Node)**.
- A **C#** test run is present but commented out in `test.hxml`. C# is a real build target
  (`targets/cs.hxml`), but the runner execs the built `.exe` directly, so it needs `mono`
  registered for `.exe` (Windows, or a `binfmt_misc` mono entry on Linux). Uncomment the C#
  block where that is set up.
- `lang_tests/` holds hand-written native smoke tests (C# and JS) that exercise the compiled
  `dist/` output directly; they are separate from the `dropecho.testing` suite.

To type-check quickly without generating output: `haxe build.hxml --no-output`.

---

## Key Conventions

- Target-specific implementations use the `<Type>.<target>.hx` filename convention
  (`AbstractMap.js.hx`, `AbstractMap.cs.hx`); the compiler picks the right one per target.
- Keep the abstracts thin and `inline` where possible — they exist to vanish into native code.
- Give every public function a full doc comment with `@param`/`@return`.
- Tests are `utest` cases: each class is named `*Tests.hx`, `extends utest.Test`, with
  `test_`-prefixed methods using `utest.Assert` (use `Assert.floatEquals` for floats).
