import { Meteor } from "meteor/meteor";
import { GoodsCollection } from "/imports/db/goodsCollection";
import { ImagesCollection } from "/imports/db/imagesCollection";
import { CartsCollection } from "/imports/db/cartdCollection";
import { Accounts } from "meteor/accounts-base";
import "/imports/api/server/goodsMethods";
import "/imports/api/server/goodsPublication";
import "/imports/api/server/cartsMethods";
import "/imports/api/server/cartsPublication";
import "/imports/api/server/usersPublication";
import "/imports/api/server/imagesMethod";
import { Roles } from "meteor/alanning:roles";

const SEED_USERNAME = "back2dev";
const SEED_PASSWORD = "back2dev";

Meteor.startup(() => {
  //create default admin user
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  } else {
    const user = Accounts.findUserByUsername(SEED_USERNAME);
    const id = user?._id;
    //@ts-ignore
    if (Meteor.roleAssignment.find({ "user._id": id }).count() === 0) {
      Roles.createRole("admin");
      Roles.addUsersToRoles(id!, "admin");
    }
  }
  //insert some goods...
  if (!ImagesCollection.find().count()) {
    ImagesCollection.load(
      "https://images.unsplash.com/photo-1618233736347-d86ab76d968e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      {
        fileName: "Demo.png",
        meta: {},
      },
      function (er: Error, fileObj: any) {
        if (er) {
          console.log(er, "cant load the mock product");
        }
        GoodsCollection.insert({
          name: "Demo",
          description: "A demo product",
          image_id: fileObj._id,
          image_path: ImagesCollection.link(fileObj),
          price: 9999,
          createdAt: new Date(),
        });
      }
    );
  }
});
