import { ConnectionLayers } from "../modules/database";

export type AccessContext = {
  userId: string,
  db: ConnectionLayers,
};
