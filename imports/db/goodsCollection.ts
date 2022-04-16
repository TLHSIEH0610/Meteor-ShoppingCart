import { Mongo } from "meteor/mongo";
import { Goods } from "../model/index";

export const GoodsCollection = new Mongo.Collection<Goods>("goods");
