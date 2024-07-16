import { Scanner } from './scan.js';
import { EndpointDecl, EndpointMember, ParameterDecl, ResponseDecl, UnitMember, TypeDecl, TypeNode, Unit } from './syntax-node.js';
import { TokenKind } from './token.js';
import { error } from './util/error.js';

export function parse(input: string): Unit {
  const s = new Scanner(input);
  const loc = s.getToken().loc;
  const decls: UnitMember[] = [];
  while (!s.when(TokenKind.EOF)) {
    if (s.when(TokenKind.SyntaxKeyword)) {
      s.next();
      s.expect(TokenKind.Eq);
      s.next();
      s.expect(TokenKind.StringLiteral);
      const format = s.getValue();
      if (!['snow-schema-1.0'].includes(format)) {
        throw new Error('unsupported syntax specifier: ' + format);
      }
      s.next();
      s.expect(TokenKind.SemiColon);
      s.next();
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
  s.expect('type');
  s.next();
  s.expect(TokenKind.Identifier);
  const name = s.getValue();
  s.next();
  s.expect(TokenKind.Eq);
  s.next();
  const type = parseType(s);
  s.expect(TokenKind.SemiColon);
  s.next();
  return new TypeDecl(name, type, loc);
}

function parseEndpointDecl(s: Scanner): EndpointDecl {
  const loc = s.getToken().loc;
  const method = s.getValue();
  s.next();
  s.expect(TokenKind.EndpointPath);
  const path = s.getValue();
  s.next();
  s.expect(TokenKind.OpenBrace);
  s.next();
  const members = s.repeat(parseEndpointMember, x => (x.kind == TokenKind.CloseBrace));
  s.expect(TokenKind.CloseBrace);
  s.next();
  return new EndpointDecl(method, path, members, loc);
}

function parseEndpointMember(s: Scanner): EndpointMember {
  const loc = s.getToken().loc;
  if (s.when('parameter')) {
    s.next();
    s.expect(TokenKind.Identifier);
    const name = s.getValue();
    s.next();
    let type = undefined;
    if (s.when(TokenKind.Colon)) {
      s.next();
      type = parseType(s);
    }
    s.expect(TokenKind.SemiColon);
    s.next();
    return new ParameterDecl(name, type, loc);
  }
  if (s.when('response')) {
    s.next();
    s.expect(TokenKind.NumberLiteral);
    const status = Number(s.getValue());
    s.next();
    s.expect(TokenKind.Colon);
    s.next();
    const type = parseType(s);
    s.expect(TokenKind.SemiColon);
    s.next();
    return new ResponseDecl(status, type, loc);
  }
  throw error(`unexpected token: ${TokenKind[s.getKind()]}`, loc);
}

function parseType(s: Scanner): TypeNode {
  const loc = s.getToken().loc;
  s.expect(TokenKind.Identifier);
  const typeName = s.getValue();
  s.next();
  if (s.when(TokenKind.OpenBrace)) {
    s.next();

    // TODO

    s.expect(TokenKind.CloseBrace);
    s.next();
  }
  return new TypeNode(typeName, loc);
}
