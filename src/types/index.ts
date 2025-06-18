export type Meal = {
  id: number;
  name: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likes: {
    userId: string;
    userName: string;
    userAvatar: string;
  }[];
};

export type GroupedHistory = Record<
  number,
  {
    id: number;
    meal: string | undefined;
    date: Date;
    eaten: string[];
  }
>;

export type Member = {
  id: string;
  name: string;
  avatar: string;
};
