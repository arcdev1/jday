import { Rating } from "~/models/rating";

export function areNotesRequired({ rating }: { rating: Rating }) {
  return rating === Rating.BAD;
}
