export type SyntaxNode = UnitNode | TypeDecl | EndpointDecl | ParameterDecl | ResponseDecl | TypeNode;

export type Loc = {
  line: number;
  column: number;
};

// SyntaxNode

export class UnitNode {
  kind = 'UnitNode' as const;
  constructor(
    public decls: TopLevelDecl[],
    public loc: Loc,
  ) {}
}

export type TopLevelDecl = TypeDecl | EndpointDecl;

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
  kind = 'ResponseDeclNode' as const;
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
    public loc: Loc,
  ) {}
}
