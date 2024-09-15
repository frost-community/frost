import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi";
import "@typespec/openapi3";

import "./api/v0.2";

using TypeSpec.Http;
using TypeSpec.Rest;

@service({
  title: "Frost",
  version: "0.1.0"
})
@server("http://localhost:3000", "local server")
namespace Frost;
