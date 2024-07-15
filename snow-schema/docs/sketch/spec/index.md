# snow-schema 1.0 Specification

## 構文指定子 (Syntax specifier)
```abnf
<syntax specifier>
  = "syntax" "=" <syntax identifier> ";"
<syntax identifier>
  = "\"snow-schema1\""
```
ファイルの最初に記載することで、そのファイルがsnow-schema 1.0のファイルであることを示す。

## import宣言 (Import declaration)
```abnf
<import declaration>
  = "import" <path string> ";"
```
他のファイルの内容を参照する。
この操作によって、snow-schemaのコンパイラはファイル同士の関係を認識する。
ただし、他のファイルの中身がそこに展開されるわけではない。

例:
```
import "./types.snow";
```

## type宣言 (Type declaration)
```abnf
<type declaration>
  = "type" <name> "=" <type>
```
型に名前をつけるための構文。
あらかじめ複雑な型を作成しておき、後で使用することができる。

例:
```
type A = string;
```

## エンドポイント宣言 (Endpoint declaration)
```abnf
<endpoint declaration>
  = <method> <path> "{" <endpoint info>? "}"
```
エンドポイントを宣言するための構文。
そのエンドポイントに関する情報も一緒に宣言する。

例:
```
POST / {
}

GET / {
}

PUT / {
}

PATCH / {
}

DELETE / {
}
```

## 型 (Type)
```
<type>
  = "string"
  / "object"
```
フィールドやレスポンスの型情報。
