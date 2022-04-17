import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { CartsCollection } from "/imports/db/cartdCollection";

Meteor.methods({
  "cart.insert"({ name, good_id }) {
    check(name, String);
    check(good_id, String);

    if (!this.userId) {
      return;
    }

    //if cart for the user doesn't exist, then create one
    const cart = CartsCollection.findOne({ userId: this.userId });

    if (!cart) {
      CartsCollection.insert({
        userId: this.userId,
        goods: [
          {
            name,
            good_id,
            quantities: 1,
          },
        ],
      });
    }

    //if good already in the cart, then just update the number. Otherwise, create the good in the cart
    const goodExist = CartsCollection.findOne({
      userId: this.userId,
      goods: { $elemMatch: { good_id } },
    });

    if (goodExist) {
      CartsCollection.update(
        { userId: this.userId, "goods.good_id": good_id },
        {
          $inc: {
            "goods.$.quantities": 1,
          },
        }
      );
    } else {
      const newGood = {
        name,
        good_id,
        quantities: 1,
      };

      CartsCollection.update(
        { userId: this.userId },
        {
          $set: {
            goods: [...cart!.goods, newGood],
          },
        }
      );
    }
  },
  "cart.add"(good_id) {
    if (!this.userId) {
      return;
    }

    CartsCollection.update(
      { userId: this.userId, "goods.good_id": good_id },
      {
        $inc: {
          "goods.$.quantities": 1,
        },
      }
    );
  },
  "cart.deduct"(good_id) {
    if (!this.userId) {
      return;
    }

    const numberEqualToOne = CartsCollection.findOne({
      userId: this.userId,
      "goods.good_id": good_id,
      "goods.quantities": { $eq: 1 },
    });

    if (numberEqualToOne) {
      CartsCollection.update(
        { userId: this.userId, "goods.good_id": good_id },
        { $pull: { goods: { good_id } } }
      );
    } else {
      CartsCollection.update(
        { userId: this.userId, "goods.good_id": good_id },
        {
          $inc: {
            "goods.$.quantities": -1,
          },
        }
      );
    }
  },
});
