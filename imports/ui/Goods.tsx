import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import Box from "@mui/material/Box";
import Images from "/imports/db/imagesCollection";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

const Input = styled("input")({
  display: "none",
});

// export default function MediaCard() {
//   return (
//     <Card sx={{ maxWidth: 345 }}>
//       <CardMedia
//         component="img"
//         height="140"
//         image="/static/images/cards/contemplative-reptile.jpg"
//         alt="green iguana"
//       />
//       <CardContent>
//         <Typography gutterBottom variant="h5" component="div">
//           Lizard
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Lizards are a widespread group of squamate reptiles, with over 6,000
//           species, ranging across all continents except Antarctica
//         </Typography>
//       </CardContent>
//       <CardActions>
//         <Button size="small">Share</Button>
//         <Button size="small">Learn More</Button>
//       </CardActions>
//     </Card>
//   );
// }

const NewGoods = () => {
  const user = useTracker(() => Meteor.user());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setFile] = useState<File | null>(null);

  useEffect(() => {
    Meteor.loginWithPassword("back2dev", "back2dev");
  }, []);

  const { goods, isLoading }: any = useTracker(() => {
    const handler = Meteor.subscribe("files.images.all");

    if (!handler.ready()) {
      return { goods: undefined, isLoading: true };
    }

    const goods = Images.findOne({ _id: "JSQPGGo99J9nzGGcd" }).link();
    return { goods, isLoading: false };
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!image || !user) {
      return;
    }

    let uploadInstance = Images.insert(
      {
        file: image,
        meta: {
          userId: user._id, // Optional, used to check on server for file tampering
          // test: "dsa",
          // productID: 321312312,
        },
        chunkSize: "dynamic",
        allowWebWorkers: true, // If you see issues with uploads, change this to false
      },
      false
    );

    uploadInstance.start();
  };

  const onChange = (e: any) => {
    setFile(e.currentTarget.files[0]);
  };

  return (
    <>
      <img
        src={goods}
        // alt="..."
        width={300}
        height={300}
      />
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
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          required
          label="Description"
          placeholder="admin/user"
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          id="outlined-number"
          label="Price"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setPrice(Number(e.target.value))}
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

        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </>
  );
};

export default NewGoods;
