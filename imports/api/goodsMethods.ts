import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { GoodsCollection } from "../db/goodsCollection";
import Images from "../db/imagesCollection";

Meteor.methods({
  "goods.insert"({ name, description, image, price }) {
    check(name, String);
    check(description, String);

    check(price, Number);

    let uploadInstance = Images.write(
      {
        file: image,
        meta: {
          // locator: self.props.fileLocator,
          // userId: this.userId(), // Optional, used to check on server for file tampering
        },
        chunkSize: "dynamic",
        allowWebWorkers: false, // If you see issues with uploads, change this to false
      },
      false
    );

    uploadInstance.start();

    GoodsCollection.insert({
      name,
      description,
      image,
      price,
      createdAt: new Date(),
    });
  },
});
