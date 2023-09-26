import { z } from "zod";

export enum Rating {
  GOOD = "GOOD",
  BAD = "BAD",
  UNKNOWN = "UNKNOWN",
}

export const ratingSchema = z.enum([Rating.BAD, Rating.GOOD, Rating.UNKNOWN]);

export function makeRating(rating: unknown): Rating {
  if (typeof rating === "string") {
    return ratingSchema.parse(rating.toUpperCase());
  }
  throw new Error("Invalid rating");
}
