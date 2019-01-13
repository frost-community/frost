# 命名規則

## **識別子の命名規則**

### **クラス名、インターフェイス名**
クラスやインターフェイスを export default する場合は、名前に `UpperCamelCase` を使用します。

### **変数名、function名、その他**
変数名、function名、その他を export default する場合は、名前に `lowerCamelCase` を使用します。

## **ファイル名やディレクトリ名の命名規則**

基本的には `lowerCamelCase` を使用します。

node_modulesなど、 `snake_case` で生成されるディレクトリがあります。

クラスやインターフェイス、変数名、function名、その他を export default する場合は、
それぞれの識別子をファイル名として使います。

リポジトリ直下のフォルダ名はnpmモジュール名と対応しており、
その命名規則に沿って、例外的に `kebab-case` になっています。

/component-api/src/endpoints ディレクトリ下はAPIエンドポイントのパスと対応しており、
その命名規則に沿って、例外的に `kebab-case` になっています。
