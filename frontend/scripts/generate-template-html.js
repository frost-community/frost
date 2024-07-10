// @ts-check

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { routeTree } from "../src/routeTree.gen";
import { BACKEND_EJS_VARIABLE_KEYS } from "../src/staticDataRouteOption";

// Constants

/** 書き出すHTMLファイルのパス */
const distFile = path.resolve(process.cwd(), "index.html");

// Utilities

/**
 * 半角スペースとそれに続く `|` がある行はそれらを取り除き\
 * ない行は行ごと取り除く
 *
 * @param {string} text
 */
const trimMargin = (text) =>
  text
    .split("\n")
    // 行頭が半角スペース (ない or 任意個数)と | ではない行を取り除く
    .filter((line) => line.match(/^\s*\|/))
    // 行頭の半角スペース (ない or 任意個数)と | を取り払う
    .map((line) => line.replace(/^\s*\|/, ""))
    .join("\n");

/**
 * 全ての行にインデントを付与した文字列を返す
 * @param {string} indentChar
 * @param {number} indentLevel インデントの個数
 * @param {string} sourceText
 */
const withIndent = (indentChar, indentLevel, sourceText) =>
  sourceText
    .split("\n")
    .map((line) =>
      line !== "" //
        ? indentChar.repeat(indentLevel) + line
        : line,
    )
    .join("\n");

/** @typedef {import("../src/staticDataRouteOption").CustomStaticDataRouteOption} CustomStaticDataRouteOption */

/**
 * @typedef {{
 *   isRoot: boolean;
 *   options: {
 *     path?: string;
 *     staticData: CustomStaticDataRouteOption;
 *   }
 *   children?: RouteTree[];
 * }} RouteTree TanStack Router の `routeTree.children` の型が謎なのでとりあえず想定の型
 */

/**
 * @typedef {{
 *   fullPath: string;
 *   openGraph: CustomStaticDataRouteOption["openGraph"];
 * }} FlattenRoute
 */

/**
 * `RouteTree[]` を `FlattenRoute` の一次元配列にフラット化したものを返す
 *
 * ネストされた `children` を収集する
 * @param {Readonly<RouteTree[]>} routes
 * @param {string} [pathPrefix='']
 * @return {FlattenRoute[]}
 */
const getFlattenRoutes = (routes, pathPrefix = "") =>
  routes.flatMap((route) => {
    const fullPath = pathPrefix + route.options.path;
    return [
      {
        fullPath: fullPath,
        openGraph: route.options.staticData.openGraph,
      },
      // 子ルートを収集
      ...(route.children != null
        ? getFlattenRoutes(route.children, fullPath)
        : []),
    ];
  });
const flattenRoutes = getFlattenRoutes(
  /** @type {RouteTree[]} */ (/** @type {unknown} */ (routeTree.children)),
);

const html = (() => {
  const INDENT = "  ";

  const ogs = trimMargin(`
    |<!-- % switch (${BACKEND_EJS_VARIABLE_KEYS.path}) {
    ${flattenRoutes
      .map(
        (route) => `
          |  case "${route.fullPath}": % -->
          |<meta property="og:title" content="${route.openGraph.title}" />
          |<meta property="og:type" content="${route.openGraph.type}" />
          |<meta property="og:description" content="${route.openGraph.description}" />
          |<meta property="og:url" content="<%- ${BACKEND_EJS_VARIABLE_KEYS.origin} + '${route.fullPath}' %>" />${
            route.openGraph.imageUrl != null
              ? `|
                 |<meta property="og:image" content="${route.openGraph.imageUrl}" />`
              : ""
          }
          |  <!-- % break;`,
      )
      .join("\n")}
    |} % -->
    |
  `);
  return (
    trimMargin(`
      |<!doctype html>
      |<html lang="ja">
      |<head>
      |  <meta charset="UTF-8" />
      |  <link rel="icon" type="image/png" href="/logo192.png" />
      |  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      |  <title>Frost</title>
      |
    `) +
    withIndent(INDENT, 1, ogs) +
    trimMargin(`
      |</head>
      |<body>
      |  <div id="root"></div>
      |  <script type="module" src="/src/main.tsx"></script>
      |</body>
      |</html>
      |
    `)
  );
})();

// htmlファイルへ書き込み
fs.writeFileSync(distFile, html);
