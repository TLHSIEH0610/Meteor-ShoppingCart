import { Meteor } from "meteor/meteor";
//@ts-ignore
import { FilesCollection } from "meteor/ostrio:files";

export const ImagesCollection = new FilesCollection({
  collectionName: "Images",
  storagePath: "public/images",
  // downloadRoute: "public/images",
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file: any) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return "Please upload image, with size equal or less than 10MB";
  },

  // downloadCallback(fileObj: any) {
  //   if (this.params.query.download == "true") {
  //     // Increment downloads counter
  //     Images.update(fileObj._id, { $inc: { "meta.downloads": 1 } });
  //   }
  //   // Must return true to continue download
  //   return true;
  // },
  // protected(fileObj: any) {
  //   // Check if current user is owner of the file
  //   if (fileObj.meta.owner === this.userId) {
  //     return true;
  //   }
  //   return false;
  // },
});

// if (Meteor.isClient) {
//   Meteor.subscribe("files.images.all");
// }

// if (Meteor.isServer) {
//   Meteor.publish("files.images.all", function () {
//     return Images.find().cursor;
//   });
// }
