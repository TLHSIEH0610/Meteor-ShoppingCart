export interface Goods {
  //   _id: string;
  name: string;
  description: string;
  image_id?: string;
  image_path?: string;
  price: number;
  createdAt: Date;
}

interface GoodInCart {
  name?: string;
  good_id?: string;
  quantities?: number;
}

export interface Cart {
  userId?: string;
  goods: GoodInCart[];
  // total_price: number
}
