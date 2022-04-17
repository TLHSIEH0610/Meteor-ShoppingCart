import { Meteor } from "meteor/meteor";

Meteor.publish(null, function () {
  if (this.userId) {
    //@ts-ignore
    return Meteor.roleAssignment.find({ "user._id": this.userId });
  } else {
    this.ready();
  }
});
