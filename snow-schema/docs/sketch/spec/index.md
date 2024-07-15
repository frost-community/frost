# snow-schema 1.0 Specification
この文書では、文法をできるだけ厳密に記述するためにABNF記法(RFC 5234)を用いて説明します。\
https://datatracker.ietf.org/doc/html/rfc5234 

<br />

## 語彙
```abnf
identifier
  = ALPHA *(ALPHA / DIGIT)

number
  = +DIGIT

string
  = %x22 *(ALPHA / DIGIT) %x22
```

<br />

## 構文指定子 (Syntax specifier)
```abnf
syntax-specifier
  = "syntax" "=" %x22 syntax-id %x22 ";"

syntax-id
  = "snow-schema-1.0"
```
ファイルの最初に記載することで、そのファイルがsnow-schema 1.0のファイルであることを示す。

例:
```
syntax = "snow-schema-1.0";
```

<br />

## Import宣言 (Import declaration)
```abnf
import-declaration
  = "import" filepath ";"

filepath
  = string
```
他のファイルの内容を参照する。\
この操作によって、snow-schemaのコンパイラはファイル同士の関係を認識する。\
ただし、他のファイルの中身がそこに展開されるわけではない。

例:
```
import "./types.snow";
```

<br />

## 型宣言 (Type declaration)
```abnf
type-declaration
  = "type" identifier "=" type
```
型に名前をつけるための構文。\
あらかじめ複雑な型を作成しておき、後で使用することができる。

例:
```
type A = string;
```

<br />

## エンドポイント宣言 (Endpoint declaration)
```abnf
endpoint-declaration
  = method path "{" *endpoint-member "}"

method
  = "POST"
  / "GET"
  / "PATCH"
  / "PUT"
  / "DELETE"

path
  = +("/" path-segment)
  / "/"

path-segment
  = +(ALPHA / DIGIT)
  / ":" identifier

endpoint-member
  = parameter-declaration
  / response-declaration
```
エンドポイントを宣言するための構文。\
そのエンドポイントに関する情報も一緒に宣言する。

例:
```
POST /cats {
  response 201: Cat;
}
```
```
GET /cats/:id {
  parameter id: string;
  response 200: Cat;
}
```
```
PUT /cats/:id {
  parameter id: string;
  response 204: void;
}
```
```
PATCH /cats/:id {
  parameter id: string;
  response 204: void;
}
```
```
DELETE /cats/:id {
  parameter id: string;
  response 204: void;
}
```

<br />

## 型 (Type)
```abnf
type
  = "string"
  / "object"
  / "void"
  / identifier
```
フィールドやレスポンスの型情報。

<br />

## パラメータ宣言 (Parameter declaration)
```abnf
parameter-declaration
  = "parameter" identifier ":" type ";"
  / "parameter" identifier ";"
```
エンドポイントパスに指定されるパラメータに関する情報を記述します。\
パラメータの型は省略することができます。その場合はデフォルトのstringとなります。\
パラメータの型はstringを継承した型である必要があります。

例:
```
parameter id: string;
```

<br />

## レスポンス宣言 (Response declaration)
```abnf
response-declaration
  = "response" status-code ":" type ";"

status-code
  = number
```
返し得るレスポンスの内容を記述します。

例:
```
response 200: Cat;
```
```
response 204: void;
```

<br />
