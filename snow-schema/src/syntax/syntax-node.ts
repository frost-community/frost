export type SyntaxNode = Unit | SyntaxSpecifier | UnitMember | EndpointAttribute | TypeNode | TypeAttribute;

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
    public attributes: EndpointAttribute[],
    public loc: Loc,
  ) {}
}

export type EndpointAttribute = ParameterEndpointAttribute | ResponseEndpointAttribute | BodyEndpointAttribute;

export class ParameterEndpointAttribute {
  kind = 'ParameterEndpointAttribute' as const;
  constructor(
    public name: string,
    public type: TypeNode | undefined,
    public loc: Loc,
  ) {}
}

export class ResponseEndpointAttribute {
  kind = 'ResponseEndpointAttribute' as const;
  constructor(
    public statusCode: number,
    public type: TypeNode,
    public loc: Loc,
  ) {}
}

export class BodyEndpointAttribute {
  kind = 'BodyEndpointAttribute' as const;
  constructor(
    public type: TypeNode,
    public loc: Loc,
  ) {}
}

export class TypeNode {
  kind = 'TypeNode' as const;
  constructor(
    public name: string,
    public innerType: TypeNode | undefined,
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
