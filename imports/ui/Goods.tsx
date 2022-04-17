import React, { Fragment, useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import Box from "@mui/material/Box";
import { ImagesCollection } from "/imports/db/imagesCollection";
import { GoodsCollection } from "/imports/db/goodsCollection";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Input = styled("input")({
  display: "none",
});

export default function GoodsList() {
  const user = useTracker(() => Meteor.user());
  let navigate = useNavigate();

  const { goods, isLoading }: any = useTracker(() => {
    const handler = Meteor.subscribe("goods.all");

    if (!handler.ready()) {
      return { goods: [], isLoading: true };
    }

    const goods = GoodsCollection.find().fetch();

    return { goods, isLoading: false };
  });

  const addToCart = (name: string, good_id: string) => {
    console.log(user);
    if (!user) {
      return navigate("/login");
    }

    Meteor.call("cart.insert", { name, good_id });
  };

  return (
    <Fragment>
      {goods.map((good: any) => (
        <Card sx={{ maxWidth: 345 }} key={good._id}>
          <CardMedia
            component="img"
            height="140"
            image={good.image_path}
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {good.name} {good.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {good.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => addToCart(good.name, good._id)}>
              Add
            </Button>
            <Button size="small">Favoriate</Button>
          </CardActions>
        </Card>
      ))}
    </Fragment>
  );
}

export interface NewGoodsProps {
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

export const initialFormData = {
  _id: "",
  name: "",
  price: 0,
  description: "",
  image_path: "",
  image_id: "",
};

export const NewGoods = ({ open, setOpen, data }: NewGoodsProps) => {
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

    if (formData.image_id !== "") {
      Meteor.call("images.delete", formData.image_id);
    }

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

    uploadInstance.on("uploaded", function (error: Error, fileObj: any) {
      if (error) {
        return console.log(error);
      }
      console.log("uploaded: ", fileObj);
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
    const reader = new FileReader();
    reader.onload = (e: any) => {
      setPreviewIMG(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onClose = () => {
    setFormData(initialFormData);
    setFile(null);
    setPreviewIMG(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Admin - Good</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={onSubmit}
        >
          <TextField
            required
            label="Good Name"
            placeholder="Apple"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextField
            required
            label="Description"
            placeholder="admin/user"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <TextField
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
              multiple
              type="file"
              onChange={onChange}
            />
            <Button variant="contained" component="span">
              Upload
            </Button>
          </label>

          {(formData.image_path !== "" || previewIMG) && (
            <img
              src={previewIMG ?? formData.image_path}
              width={300}
              height={300}
            />
          )}
        </Box>
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
