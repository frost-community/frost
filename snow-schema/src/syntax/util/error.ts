import type { Loc } from "../syntax-node";

export function error(message: string, loc: Loc) {
  return new Error(`${message} (${loc.line}:${loc.column})`);
}
