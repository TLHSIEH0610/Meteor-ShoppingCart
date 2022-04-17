import { Mongo } from "meteor/mongo";
import { Cart } from "../model/index";

export const CartsCollection = new Mongo.Collection<Cart>("carts");
