using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

namespace Frost.Api.v1;

model CreateLeafParam {
  content: string;
}

interface Leafs {
  // POST /leaf
  @route("/leaf")
  @tag("Leaf")
  @post op CreateLeaf(@body body: CreateLeafParam): Leaf;

  // GET /leaf/:leafId
  @tag("Leaf") @tag("ChatRoom")
  @get op GetLeaf(...LeafId): Leaf;

  // DELETE /leaf/:leafId
  @tag("Leaf") @tag("ChatRoom")
  @delete op DeleteLeaf(...LeafId): void;

  // GET /leaf/search
  @route("/leaf")
  @action("search")
  @tag("Leaf")
  @get op SearchLeaf(@body body: CreateLeafParam): Leaf;

  // GET /user/:userId/home-timeline
  @action("home-timeline")
  @tag("User") @tag("Leaf")
  @get op FetchHomeTimeline(
    ...UserId,
    @query kind: string,
    @query prevCursor?: string,
    @query nextCursor?: string,
    @query limit?: string
  ): Leaf[];
}
