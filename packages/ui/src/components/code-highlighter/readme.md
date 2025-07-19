# zane-code-highlighter

<!-- Auto Generated Below -->

## Overview

代码高亮组件

## Properties

| Property | Attribute | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `format` | `format` | 是否格式化代码 | `boolean` | `undefined` |
| `hideCopy` | `hide-copy` | 是否隐藏复制按钮 | `boolean` | `false` |
| `inline` | `inline` | 是否为内联模式（非块级显示） | `boolean` | `false` |
| `language` | `language` | 代码语言类型 | `"json" \| "html" \| "q" \| "d" \| "r" \| "http" \| "c" \| "abap" \| "actionscript" \| "ada" \| "apacheconf" \| "apl" \| "applescript" \| "arduino" \| "arff" \| "asciidoc" \| "asm6502" \| "aspnet" \| "autohotkey" \| "autoit" \| "bash" \| "basic" \| "batch" \| "bison" \| "brainfuck" \| "bro" \| "clike" \| "clojure" \| "coffeescript" \| "cpp" \| "crystal" \| "csharp" \| "csp" \| "css" \| "css-extras" \| "dart" \| "diff" \| "django" \| "docker" \| "eiffel" \| "elixir" \| "elm" \| "erb" \| "erlang" \| "flow" \| "fortran" \| "fsharp" \| "gedcom" \| "gherkin" \| "git" \| "glsl" \| "go" \| "graphql" \| "groovy" \| "haml" \| "handlebars" \| "haskell" \| "haxe" \| "hpkp" \| "hsts" \| "ichigojam" \| "icon" \| "inform7" \| "ini" \| "io" \| "j" \| "java" \| "javascript" \| "jolie" \| "jsx" \| "julia" \| "keyman" \| "kotlin" \| "latex" \| "less" \| "lilypond" \| "liquid" \| "lisp" \| "livescript" \| "lolcode" \| "lua" \| "makefile" \| "markdown" \| "markup" \| "markup-templating" \| "matlab" \| "mel" \| "mizar" \| "monkey" \| "n4js" \| "nasm" \| "nginx" \| "nim" \| "nix" \| "nsis" \| "objectivec" \| "ocaml" \| "opencl" \| "oz" \| "parigp" \| "parser" \| "pascal" \| "perl" \| "php" \| "php-extras" \| "plsql" \| "powershell" \| "processing" \| "prolog" \| "properties" \| "protobuf" \| "pug" \| "puppet" \| "pure" \| "python" \| "qore"` | `'javascript'` |
| `lineNumbers` | `line-numbers` | 是否显示行号 | `boolean` | `false` |
| `value` | `value` | 代码内容 | `string` | `''` |

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
