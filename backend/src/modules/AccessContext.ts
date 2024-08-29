import { ConnectionLayers } from "./database";

export type AccessContext = {
  userId: string,
  db: ConnectionLayers,
};
