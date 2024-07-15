type SemanticNode = Unit;

export type Loc = {
  line: number;
  column: number;
};

export class Unit {
  kind = 'Unit' as const;
  constructor(
    public loc: Loc,
  ) {}
}
