export type SyntaxNode = UnitNode | RouteNode | RefNode;

export type Loc = {
  line: number;
  column: number;
};

// SyntaxNode

export class UnitNode {
  kind = 'UnitNode' as const;
  constructor(
    public decls: RouteNode[],
    public loc: Loc,
  ) {}
}

export class RouteNode {
  kind = 'RouteNode' as const;
  constructor(
    public name: string,
    public loc: Loc,
  ) {}
}

export class RefNode {
  kind = 'RefNode' as const;
  constructor(
    public name: string,
    public loc: Loc,
  ) {}
}
