import { Scanner } from './scan.js';
import { ITokenStream } from './stream/token-stream.js';
import { RouteNode, UnitNode } from './syntax-node.js';
import { TokenKind } from './token.js';
import { error } from './util/error.js';

export function parse(input: string): UnitNode {
  const s = new Scanner(input);

  const loc = s.getToken().loc;

  const decls = [];
  while (s.getKind() != TokenKind.EOF) {
    switch (s.getKind()) {
      case TokenKind.Route: {
        decls.push(parseRoute(s));
        break;
      }
      default: {
        throw error(`unexpected token: ${TokenKind[s.getKind()]}`, loc);
      }
    }
  }

  return new UnitNode(decls, loc);
}

function parseRoute(s: ITokenStream): RouteNode {
  const loc = s.getToken().loc;

  s.nextWith(TokenKind.Route);

  return new RouteNode('aaa', loc);
}
