import { Scanner } from './scan.js';
import { ITokenStream } from './stream/token-stream.js';
import { EndpointDecl, EndpointMember, TopLevelDecl, TypeDecl, TypeNode, UnitNode } from './syntax-node.js';
import { TokenKind } from './token.js';
import { error } from './util/error.js';

export function parse(input: string): UnitNode {
  const s = new Scanner(input);

  const loc = s.getToken().loc;

  const decls: TopLevelDecl[] = [];
  while (s.getKind() != TokenKind.EOF) {
    if (s.getKind() == TokenKind.SyntaxKeyword) {
      s.next();
      s.nextWith(TokenKind.Eq);
      s.expect(TokenKind.StringLiteral);
      const format = s.getToken().value!;
      s.next();
      s.nextWith(TokenKind.SemiColon);
      if (!['snow-schema-1.0'].includes(format)) {
        throw new Error('unsupported format');
      }
      continue;
    }
    if (s.thenKeyword('type')) {
      const decl = parseTypeDecl(s);
      decls.push(decl);
      continue;
    }
    if (s.thenKeyword('POST') || s.thenKeyword('GET') || s.thenKeyword('PATCH') || s.thenKeyword('PUT') || s.thenKeyword('DELETE')) {
      const decl = parseEndpointDecl(s);
      decls.push(decl);
      continue;
    }
    throw error(`unexpected token: ${TokenKind[s.getKind()]}`, loc);
  }

  return new UnitNode(decls, loc);
}

function parseTypeDecl(s: ITokenStream): TypeDecl {
  const loc = s.getToken().loc;

  s.next();

  s.expect(TokenKind.StringLiteral);
  const name = s.getToken().value!;
  s.next();

  // TODO: type
  const type = parseTypeNode(s);

  return new TypeDecl(name, type, loc);
}

function parseEndpointDecl(s: ITokenStream): EndpointDecl {
  const loc = s.getToken().loc;

  const method = s.getToken().value!;
  s.next();

  // TODO: path
  const path = '/';

  s.nextWith(TokenKind.OpenBrace);

  // TODO: members
  const members: EndpointMember[] = [];

  s.nextWith(TokenKind.CloseBrace);

  return new EndpointDecl(method, path, members, loc);
}

function parseTypeNode(s: ITokenStream): TypeNode {
  const loc = s.getToken().loc;

  // TODO
  throw new Error('not implement');
}
