import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { ImagesCollection } from "../../db/imagesCollection";

Meteor.methods({
  "images.insert"({ image, name }) {
    check(name, String);
    console.log(image, name);
    // let uploadInstance = ImagesCollection.insert(
    //   {
    //     file: image,
    //     meta: {
    //       good: name,
    //     },
    //     chunkSize: "dynamic",
    //     allowWebWorkers: true,
    //   },
    //   false
    // )

    // uploadInstance.start()
  },
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
