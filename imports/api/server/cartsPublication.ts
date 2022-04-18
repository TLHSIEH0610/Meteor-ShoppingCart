import { Meteor } from "meteor/meteor";
import { CartsCollection } from "/imports/db/cartdCollection";

Meteor.publish("cart.all", function () {
  if (!this.userId) {
    throw new Meteor.Error("Please Login");
  }
  return CartsCollection.find({ userId: this.userId });
});
