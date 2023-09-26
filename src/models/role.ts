import { z } from "zod";

export enum Role {
  GUARDIAN = "GUARDIAN",
  EDUCATOR = "EDUCATOR",
}

export const roleSchema = z.enum([Role.GUARDIAN, Role.EDUCATOR]);

export function makeRole(role: unknown): Role {
  if (typeof role === "string") {
    return roleSchema.parse(role.toUpperCase());
  }
  throw new Error("Invalid role");
}
