# zane-code-highlighter

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `format` | `format` | Format the code snippet. | `boolean` | `undefined` |
| `hideCopy` | `hide-copy` | Hide the copy button. | `boolean` | `false` |
| `inline` | `inline` | Display the code snippet inline. | `boolean` | `false` |
| `language` | `language` | The language of the code snippet. | `"json" \| "html" \| "q" \| "d" \| "r" \| "http" \| "c" \| "abap" \| "actionscript" \| "ada" \| "apacheconf" \| "apl" \| "applescript" \| "arduino" \| "arff" \| "asciidoc" \| "asm6502" \| "aspnet" \| "autohotkey" \| "autoit" \| "bash" \| "basic" \| "batch" \| "bison" \| "brainfuck" \| "bro" \| "clike" \| "clojure" \| "coffeescript" \| "cpp" \| "crystal" \| "csharp" \| "csp" \| "css" \| "css-extras" \| "dart" \| "diff" \| "django" \| "docker" \| "eiffel" \| "elixir" \| "elm" \| "erb" \| "erlang" \| "flow" \| "fortran" \| "fsharp" \| "gedcom" \| "gherkin" \| "git" \| "glsl" \| "go" \| "graphql" \| "groovy" \| "haml" \| "handlebars" \| "haskell" \| "haxe" \| "hpkp" \| "hsts" \| "ichigojam" \| "icon" \| "inform7" \| "ini" \| "io" \| "j" \| "java" \| "javascript" \| "jolie" \| "jsx" \| "julia" \| "keyman" \| "kotlin" \| "latex" \| "less" \| "lilypond" \| "liquid" \| "lisp" \| "livescript" \| "lolcode" \| "lua" \| "makefile" \| "markdown" \| "markup" \| "markup-templating" \| "matlab" \| "mel" \| "mizar" \| "monkey" \| "n4js" \| "nasm" \| "nginx" \| "nim" \| "nix" \| "nsis" \| "objectivec" \| "ocaml" \| "opencl" \| "oz" \| "parigp" \| "parser" \| "pascal" \| "perl" \| "php" \| "php-extras" \| "plsql" \| "powershell" \| "processing" \| "prolog" \| "properties" \| "protobuf" \| "pug" \| "puppet" \| "pure" \| "python" \| "qore"` | `'javascript'` |
| `lineNumbers` | `line-numbers` | Display line numbers. | `boolean` | `false` |
| `value` | `value` | The code snippet to highlight. | `string` | `''` |

## CSS Custom Properties

| Name                                 | Description                       |
| ------------------------------------ | --------------------------------- |
| `--zane-code-highlighter-background` | Code Highlighter background color |

## Dependencies

### Depends on

- [zane-tooltip](../tooltip)
- [zane-button](../button/button)
- [zane-spinner](../spinner)

### Graph

```mermaid
graph TD;
  zane-code-highlighter --> zane-tooltip
  zane-code-highlighter --> zane-button
  zane-code-highlighter --> zane-spinner
  zane-tooltip --> zane-popover
  zane-tooltip --> zane-popover-content
  zane-button --> zane-spinner
  zane-button --> zane-icon
  style zane-code-highlighter fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
