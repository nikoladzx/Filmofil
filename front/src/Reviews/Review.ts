export interface Review {
    id: string;
    authorID: string;
    movieID: string;
    text: string;
    time: string;
    upvotes: number;
    downvotes: number;
    rating: number;
  }