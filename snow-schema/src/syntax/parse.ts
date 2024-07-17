import { Scanner } from './scan.js';
import {
  BodyEndpointAttribute, EndpointAttribute, EndpointDecl, FieldTypeAttribute, ParameterEndpointAttribute, PrimitiveTypeAttribute,
  ResponseEndpointAttribute, SyntaxSpecifier, TypeAttribute, TypeDecl, TypeNode, Unit, UnitMember
} from './syntax-node.js';
import { TokenKind } from './token.js';
import { error } from './util/error.js';

export function parse(input: string): Unit {
  const s = new Scanner(input);
  const loc = s.getToken().loc;
  const decls: UnitMember[] = [];
  const syntaxSpecifier = parseSyntaxSpecifier(s);
  if (!['snow-schema-1.0'].includes(syntaxSpecifier.format)) {
    throw new Error('unsupported syntax specifier: ' + syntaxSpecifier.format);
  }
  while (!s.when(TokenKind.EOF)) {
    if (s.when('type')) {
      const decl = parseTypeDeclaration(s);
      decls.push(decl);
      continue;
    }
    if (s.when(['POST', 'GET', 'PATCH', 'PUT', 'DELETE'])) {
      const decl = parseEndpointDeclaration(s);
      decls.push(decl);
      continue;
    }
    throw error(`unexpected token: ${TokenKind[s.getKind()]}`, loc);
  }
  return new Unit(syntaxSpecifier, decls, loc);
}

function parseSyntaxSpecifier(s: Scanner): SyntaxSpecifier {
  const loc = s.getToken().loc;
  s.expect(TokenKind.SyntaxKeyword);
  s.next();
  s.expect(TokenKind.Eq);
  s.next();
  s.expect(TokenKind.StringLiteral);
  const format = s.getValue();
  s.next();
  s.expect(TokenKind.SemiColon);
  s.next();
  return new SyntaxSpecifier(format, loc);
}

function parseTypeDeclaration(s: Scanner): TypeDecl {
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

function parseEndpointDeclaration(s: Scanner): EndpointDecl {
  const loc = s.getToken().loc;
  s.expect(TokenKind.Identifier);
  const method = s.getValue();
  s.next();
  s.expect(TokenKind.EndpointPath);
  const path = s.getValue();
  s.next();
  s.expect(TokenKind.OpenBrace);
  s.next();
  const members = s.repeat(parseEndpointAttribute, x => (x.kind == TokenKind.CloseBrace));
  s.expect(TokenKind.CloseBrace);
  s.next();
  return new EndpointDecl(method, path, members, loc);
}

function parseEndpointAttribute(s: Scanner): EndpointAttribute {
  const loc = s.getToken().loc;
  if (s.when('parameter')) {
    return parseParameterEndpointAttribute(s);
  }
  if (s.when('response')) {
    return parseResponseEndpointAttribute(s);
  }
  if (s.when('body')) {
    return parseBodyEndpointAttribute(s);
  }
  throw error(`unexpected token: ${TokenKind[s.getKind()]}`, loc);
}

function parseParameterEndpointAttribute(s: Scanner): ParameterEndpointAttribute {
  const loc = s.getToken().loc;
  s.expect('parameter');
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
  return new ParameterEndpointAttribute(name, type, loc);
}

function parseResponseEndpointAttribute(s: Scanner): ResponseEndpointAttribute {
  const loc = s.getToken().loc;
  s.expect('response');
  s.next();
  s.expect(TokenKind.NumberLiteral);
  const status = Number(s.getValue());
  s.next();
  s.expect(TokenKind.Colon);
  s.next();
  const type = parseType(s);
  s.expect(TokenKind.SemiColon);
  s.next();
  return new ResponseEndpointAttribute(status, type, loc);
}

function parseBodyEndpointAttribute(s: Scanner): BodyEndpointAttribute {
  const loc = s.getToken().loc;
  s.expect('body');
  s.next();
  s.expect(TokenKind.Colon);
  s.next();
  const type = parseType(s);
  s.expect(TokenKind.SemiColon);
  s.next();
  return new BodyEndpointAttribute(type, loc);
}

function parseType(s: Scanner): TypeNode {
  const loc = s.getToken().loc;
  s.expect(TokenKind.Identifier);
  const typeName = s.getValue();
  s.next();
  let attributes: TypeAttribute[] | undefined = undefined;
  if (s.when(TokenKind.OpenBrace)) {
    s.next();
    attributes = s.repeat(parseTypeAttribute, x => (x.kind == TokenKind.CloseBrace));
    s.expect(TokenKind.CloseBrace);
    s.next();
  }
  return new TypeNode(typeName, attributes, loc);
}

function parseTypeAttribute(s: Scanner): TypeAttribute {
  const loc = s.getToken().loc;
  if (s.when("pattern")) {
    const attrName = s.getValue();
    s.next();
    s.expect(TokenKind.StringLiteral);
    const value = s.getValue();
    s.next();
    s.expect(TokenKind.SemiColon);
    s.next();
    return new PrimitiveTypeAttribute(attrName, 'string', value, loc);
  }
  if (s.when("caseSensitive")) {
    const attrName = s.getValue();
    s.next();
    s.expect(TokenKind.BooleanLiteral);
    const value = s.getValue();
    s.next();
    s.expect(TokenKind.SemiColon);
    s.next();
    return new PrimitiveTypeAttribute(attrName, 'boolean', value, loc);
  }
  if (s.when(["minValue", "maxValue", "minLength", "maxLength"])) {
    const attrName = s.getValue();
    s.next();
    s.expect(TokenKind.NumberLiteral);
    const value = s.getValue();
    s.next();
    s.expect(TokenKind.SemiColon);
    s.next();
    return new PrimitiveTypeAttribute(attrName, 'number', value, loc);
  }
  if (s.when("field")) {
    s.next();
    s.expect(TokenKind.Identifier);
    const name = s.getValue();
    s.next();
    s.expect(TokenKind.Colon);
    s.next();
    const type = parseType(s);
    s.expect(TokenKind.SemiColon);
    s.next();
    return new FieldTypeAttribute(name, type, loc);
  }
  throw error(`unexpected token: ${TokenKind[s.getKind()]}`, loc);
}
