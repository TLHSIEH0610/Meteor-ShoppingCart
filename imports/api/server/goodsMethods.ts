import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { GoodsCollection } from "../../db/goodsCollection";
// import Images from "../../db/imagesCollection";

Meteor.methods({
  "goods.insert"({ _id,name, description, price, image_id, image_path }) {
    check(name, String);
    check(description, String);
    check(image_id, String);
    check(price, Number);

    GoodsCollection.update({_id:_id},{
      name,
      description,
      image_id,
      image_path,
      price,
      createdAt: new Date(),
    },{
      upsert:true
    });
  },
  "goods.delete"(_id) {
    check(_id, String);

    GoodsCollection.remove({
      _id,
    });
  },
});
