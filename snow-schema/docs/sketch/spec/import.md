## 語彙
```abnf
string
  = %x22 *(ALPHA / DIGIT) %x22
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
