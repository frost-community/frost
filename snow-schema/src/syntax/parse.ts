import { Scanner } from './scan.js';
import { EndpointDecl, EndpointMember, ParameterDecl, ResponseDecl, TopLevelDecl, TypeDecl, TypeNode, Unit } from './syntax-node.js';
import { TokenKind } from './token.js';
import { error } from './util/error.js';

export function parse(input: string): Unit {
  const s = new Scanner(input);

  const loc = s.getToken().loc;

  const decls: TopLevelDecl[] = [];
  while (!s.when(TokenKind.EOF)) {
    if (s.when(TokenKind.SyntaxKeyword)) {
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
    if (s.when('type')) {
      const decl = parseTypeDecl(s);
      decls.push(decl);
      continue;
    }
    if (s.when(['POST', 'GET', 'PATCH', 'PUT', 'DELETE'])) {
      const decl = parseEndpointDecl(s);
      decls.push(decl);
      continue;
    }
    throw error(`unexpected token: ${TokenKind[s.getKind()]}`, loc);
  }

  return new Unit(decls, loc);
}

function parseTypeDecl(s: Scanner): TypeDecl {
  const loc = s.getToken().loc;

  s.next();

  s.expect(TokenKind.Identifier);
  const name = s.getToken().value!;
  s.next();

  s.nextWith(TokenKind.Eq);

  const type = parseType(s);

  s.nextWith(TokenKind.SemiColon);

  return new TypeDecl(name, type, loc);
}

function parseEndpointDecl(s: Scanner): EndpointDecl {
  const loc = s.getToken().loc;

  const method = s.getToken().value!;
  s.next();

  s.expect(TokenKind.EndpointPath);
  const path = s.getToken().value!;
  s.next();

  s.nextWith(TokenKind.OpenBrace);
  const members = s.repeat(parseEndpointMember, x => (x.kind == TokenKind.CloseBrace));
  s.nextWith(TokenKind.CloseBrace);

  return new EndpointDecl(method, path, members, loc);
}

function parseType(s: Scanner): TypeNode {
  const loc = s.getToken().loc;

  s.expect(TokenKind.Identifier);
  const typeName = s.getToken().value!;
  s.next();

  if (s.when(TokenKind.OpenBrace)) {
    s.next();

    // TODO

    s.nextWith(TokenKind.CloseBrace);
  }

  return new TypeNode(typeName, loc);
}

function parseEndpointMember(s: Scanner): EndpointMember {
  const loc = s.getToken().loc;

  if (s.when('parameter')) {
    s.next();

    s.expect(TokenKind.Identifier);
    const name = s.getToken().value!;
    s.next();

    let type = undefined;
    if (s.when(TokenKind.Colon)) {
      s.next();
      type = parseType(s);
    }

    s.nextWith(TokenKind.SemiColon);

    return new ParameterDecl(name, type, loc);
  }

  if (s.when('response')) {
    s.next();

    s.expect(TokenKind.NumberLiteral);
    const status = Number(s.getToken().value!);
    s.next();

    s.nextWith(TokenKind.Colon);
    const type = parseType(s);

    s.nextWith(TokenKind.SemiColon);

    return new ResponseDecl(status, type, loc);
  }

  throw error(`unexpected token: ${TokenKind[s.getKind()]}`, loc);
}
