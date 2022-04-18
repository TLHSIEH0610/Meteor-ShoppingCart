import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { ImagesCollection } from "../../db/imagesCollection";

Meteor.methods({
  "images.delete"(_id) {
    check(_id, String);

    ImagesCollection.remove(
      {
        _id,
      },
      (error: Error) => console.log(error)
    );
  },
});
