# snow-schema 1.0 Specification
この文書では、文法をできるだけ厳密に記述するためにABNF記法(RFC 5234)を用いて説明します。\
https://datatracker.ietf.org/doc/html/rfc5234 

スペースや改行については構文の説明からは省いています。

<br />

## 語彙
```abnf
identifier
  = ALPHA *(ALPHA / DIGIT)

number
  = +DIGIT

string
  = %x22 *(ALPHA / DIGIT) %x22

boolean
  = "true" / "false"
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

## 型宣言 (Type declaration)
```abnf
type-declaration
  = "type" identifier "=" type ";"
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
  = method path "{" *endpoint-attribute "}"

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

endpoint-attribute
  = parameter-endpoint-attribute
  / response-endpoint-attribute
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

### TODO
- Bodyエンドポイント属性 (Body endpoint attribute)

<br />

## Parameterエンドポイント属性 (Parameter endpoint attribute)
```abnf
parameter-endpoint-attribute
  = "parameter" identifier [":" type] ";"
```
エンドポイントパスに指定されるパラメータに関する情報を記述します。\
パラメータの型は省略することができます。その場合はデフォルトのstringとなります。\
パラメータの型はstringを継承した型である必要があります。

例:
```
parameter id: string;
```

<br />

## Responseエンドポイント属性 (Response endpoint attribute)
```abnf
response-endpoint-attribute
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

## 型 (Type)
```abnf
type
  = type-name ["{" *type-attribute "}"]

type-name
  = "number"
  / "string"
  / "object"
  / "boolean"
  / "void"
  / identifier

type-attribute
  = "pattern" string ";"
  / "caseSensitive" boolean ";"
  / "minValue" number ";"
  / "maxValue" number ";"
  / "minLength" number ";"
  / "maxLength" number ";"
  / "field" identifier ":" type ";"
```
フィールドやレスポンスの型情報。

例:
```
object {
  field id: string;
}
```
```
string
```
```
string {
  pattern "[A-Za-z0-9-]*";
  minLength 1;
  maxLength 2;
}
```
```
number {
  minValue 0;
  maxValue 10;
}
```
```
void
```

### TODO
- 配列型 (Array types)

<br />
