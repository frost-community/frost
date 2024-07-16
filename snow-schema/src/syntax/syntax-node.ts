export type SyntaxNode = Unit | SyntaxSpecifier | UnitMember | EndpointMember | TypeNode | TypeAttribute;

export type Loc = {
  line: number;
  column: number;
};

// SyntaxNode

export class Unit {
  kind = 'Unit' as const;
  constructor(
    public syntaxSpecifier: SyntaxSpecifier,
    public decls: UnitMember[],
    public loc: Loc,
  ) {}
}

export class SyntaxSpecifier {
  kind = 'SyntaxSpecifier' as const;
  constructor(
    public format: string,
    public loc: Loc,
  ) {}
}

export type UnitMember = TypeDecl | EndpointDecl;

export class TypeDecl {
  kind = 'TypeDecl' as const;
  constructor(
    public name: string,
    public type: TypeNode,
    public loc: Loc,
  ) {}
}

export class EndpointDecl {
  kind = 'EndpointDecl' as const;
  constructor(
    public method: string,
    public path: string,
    public members: EndpointMember[],
    public loc: Loc,
  ) {}
}

export type EndpointMember = ParameterDecl | ResponseDecl;

export class ParameterDecl {
  kind = 'ParameterDecl' as const;
  constructor(
    public name: string,
    public type: TypeNode | undefined,
    public loc: Loc,
  ) {}
}

export class ResponseDecl {
  kind = 'ResponseDecl' as const;
  constructor(
    public statusCode: number,
    public type: TypeNode,
    public loc: Loc,
  ) {}
}

export class TypeNode {
  kind = 'TypeNode' as const;
  constructor(
    public name: string,
    public attributes: TypeAttribute[] | undefined,
    public loc: Loc,
  ) {}
}

export type TypeAttribute = PrimitiveTypeAttribute | FieldTypeAttribute;

export class PrimitiveTypeAttribute {
  kind = 'PrimitiveTypeAttribute' as const;
  constructor(
    public attrName: string,
    public primitiveKind: 'string' | 'number' | 'boolean',
    public value: string,
    public loc: Loc,
  ) {}
}

export class FieldTypeAttribute {
  kind = 'FieldTypeAttribute' as const;
  constructor(
    public name: string,
    public type: TypeNode,
    public loc: Loc,
  ) {}
}
