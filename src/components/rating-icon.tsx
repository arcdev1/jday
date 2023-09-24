import { Rating } from "~/models/rating";

export default function RatingIcon({ rating }: { rating: Rating }) {
  switch (rating) {
    case Rating.BAD:
      return "👎";
    case Rating.GOOD:
      return "👍";
    case Rating.UNKNOWN:
      return "";
    default:
      return "";
  }
}
