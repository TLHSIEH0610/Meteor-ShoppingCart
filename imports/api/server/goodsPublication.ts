import { Meteor } from "meteor/meteor";
import { ImagesCollection } from "/imports/db/imagesCollection";
import { GoodsCollection } from "/imports/db/goodsCollection";

Meteor.publish("files.images.all", function () {
  //   if (!this.userId) {
  //     throw new Meteor.Error("Not authorized.");
  //   }
  return ImagesCollection.find().cursor;
});

Meteor.publish("goods.all", function () {
  //   if (!this.userId) {
  //     throw new Meteor.Error("Not authorized.");
  //   }
  return GoodsCollection.find();
});
