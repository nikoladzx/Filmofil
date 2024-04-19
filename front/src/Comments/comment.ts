export interface Comment {
    id: string;
    reviewID: string;
    authorID: string;
    text: string;
    time: string;
    upvotes: number;
    downvotes: number;
  }