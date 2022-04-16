import { Meteor } from "meteor/meteor";
import { GoodsCollection } from "/imports/db/goodsCollection";
import "/imports/api/goodsMethods";
// import Images from "/imports/db/imagesCollection";
import { Accounts } from "meteor/accounts-base";

// function insertLink(title: string, url: string) {
//   LinksCollection.insert({ title, url, createdAt: new Date() });
// }
const SEED_USERNAME = "back2dev";
const SEED_PASSWORD = "back2dev";
Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  if (GoodsCollection.find().count() === 0) {
    GoodsCollection.insert({
      name: "test",
      description: "test",
      price: 444,
      createdAt: new Date(),
    });
  }

  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
  // if (!Images.find().count()) {
  //   Images.load(
  //     "https://raw.githubusercontent.com/VeliovGroup/Meteor-Files/master/logo.png",
  //     {
  //       fileName: "logo.png",
  //       meta: {},
  //     }
  //   );
  // }
});
