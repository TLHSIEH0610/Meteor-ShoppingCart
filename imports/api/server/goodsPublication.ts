import { Meteor } from "meteor/meteor";
import { ImagesCollection } from "/imports/db/imagesCollection";
import { GoodsCollection } from "/imports/db/goodsCollection";

Meteor.publish("files.images.all", function () {
  return ImagesCollection.find().cursor;
});

Meteor.publish("goods.all", function () {
  return GoodsCollection.find();
});
