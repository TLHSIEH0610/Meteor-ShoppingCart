export interface Goods {
  //   _id: string;
  name: string;
  description: string;
  image?: File;
  price: number;
  createdAt: Date;
}

export interface Cart {
  userId: string;
  goods: Goods[];
}
