import { parse } from "./syntax/parse";
import fs from "node:fs";
import process from "node:process";

const sourcePath = process.cwd() + "/debug/main.snow";
const source = fs.readFileSync(sourcePath, { encoding: "utf8" });

const tree = parse(source);

console.log(JSON.stringify(tree, null, "  "));
