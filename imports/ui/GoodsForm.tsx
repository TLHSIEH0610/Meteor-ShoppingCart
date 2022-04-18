import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Meteor } from "meteor/meteor";
import Box from "@mui/material/Box";
import { ImagesCollection } from "/imports/db/imagesCollection";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";

export interface GoodsProps {
  open: boolean;
  setOpen: (arg: boolean) => void;
  data: {
    _id: string;
    name: string;
    price: number;
    description: string;
    image_path: string;
    image_id?: string;
  };
}

const Input = styled("input")({
  display: "none",
});

export const initialFormData = {
  _id: "",
  name: "",
  price: 0,
  description: "",
  image_path: "",
  image_id: "",
};

const GoodsFrom = ({ open, setOpen, data }: GoodsProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const [image, setFile] = useState<File | null>(null);

  const [previewIMG, setPreviewIMG] = useState();

  useEffect(() => {
    setFormData({ ...formData, ...data });
  }, [data.name, data.price, data.description, data.image_path]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!image) {
      return;
    }

    //remove old image from DB
    if (formData.image_id !== "") {
      Meteor.call("images.delete", formData.image_id);
    }

    //insert new image
    Meteor.call("images.insert", { image, name: formData.name });
    let uploadInstance = ImagesCollection.insert(
      {
        file: image,
        meta: {
          good: formData.name,
        },
        chunkSize: "dynamic",
        allowWebWorkers: true,
      },
      false
    );

    uploadInstance.start();

    //insert good after image has been created
    uploadInstance.on("uploaded", function (error: Error, fileObj: any) {
      if (error) {
        return console.log(error);
      }

      Meteor.call("goods.insert", {
        _id: formData._id,
        name: formData.name,
        description: formData.description,
        image_id: fileObj._id,
        image_path: ImagesCollection.link(fileObj),
        price: formData.price,
      });
    });
  };

  const onChange = (e: any) => {
    const file = e.currentTarget.files[0];
    setFile(file);

    //for image display
    const reader = new FileReader();
    reader.onload = (e: any) => {
      setPreviewIMG(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onClose = () => {
    //reset all status after dialog is closed
    setFormData(initialFormData);
    setFile(null);
    setPreviewIMG(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New/Update Good</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { mt: 1, mb: 3 },
          }}
          //   noValidate
          autoComplete="off"
          onSubmit={onSubmit}
        >
          <TextField
            fullWidth
            required
            label="Good Name"
            placeholder="Apple"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextField
            fullWidth
            required
            label="Description"
            placeholder="admin/user"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <TextField
            fullWidth
            id="outlined-number"
            label="Price"
            type="number"
            value={formData.price}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
          />

          <label htmlFor="contained-button-file">
            <Input
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={onChange}
            />
            <Button variant="contained" sx={{ mb: 1 }} component="span">
              Upload
            </Button>
          </label>
        </Box>
        {(formData.image_path !== "" || previewIMG) && (
          <img
            src={previewIMG ?? formData.image_path}
            width="100%"
            height="auto"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button
          onClick={(e) => {
            onSubmit(e);
            setOpen(false);
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoodsFrom;
