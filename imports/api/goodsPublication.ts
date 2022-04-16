import { Meteor } from "meteor/meteor";
import Images from "/imports/db/imagesCollection";

Meteor.publish("files.images.all", function () {
  //   if (!this.userId) {
  //     throw new Meteor.Error("Not authorized.");
  //   }
  return Images.find().cursor;
});
