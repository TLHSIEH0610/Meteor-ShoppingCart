import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { GoodsCollection } from "/imports/db/goodsCollection";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import SimpleBackdrop from "./BackDrop";

const GoodsList = () => {
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
    if (!user) {
      return navigate("/login");
    }

    Meteor.call("cart.insert", { name, good_id });
  };

  return isLoading ? (
    <SimpleBackdrop isLoading={isLoading} />
  ) : (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      {goods.map((good: any) => (
        <Card sx={{ maxWidth: 345, mr: 2 }} key={good._id}>
          <CardMedia
            width={300}
            height={200}
            component="img"
            image={good.image_path}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {good.name}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              {good.price}$
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {good.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => addToCart(good.name, good._id)}>
              Add
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default GoodsList;
