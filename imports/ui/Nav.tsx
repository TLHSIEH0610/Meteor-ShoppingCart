import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import { useTracker } from "meteor/react-meteor-data";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useNavigate, useLocation } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CartsCollection } from "/imports/db/cartdCollection";
import { Roles } from "meteor/alanning:roles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const Nav = () => {
  const user = useTracker(() => Meteor.user());
  const isAdmin = useTracker(() => {
    if (!user) {
      return;
    }

    return Roles.userIsInRole(user._id, ["admin"]);
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElCart, setAnchorElCart] = useState<null | HTMLElement>(null);

  const { cart }: any = useTracker(() => {
    const handler = Meteor.subscribe("cart.all");

    if (!handler.ready()) {
      return { cart: [], isLoading: true };
    }

    const cart = CartsCollection.find().fetch();

    return { cart, isLoading: false };
  });
  console.log(cart);
  const auth = () => {
    if (user) {
      Meteor.logout();
    }
    navigate("/login");
  };

  const handleOpenCartMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!user) {
      navigate("/login");
    }
    setAnchorElCart(event.currentTarget);
  };

  const handleCloseCartMenu = () => {
    setAnchorElCart(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            Back2Cart
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              sx={{ my: 2, color: "white", display: "block" }}
              onClick={() => navigate("/")}
            >
              Goods
            </Button>
            {isAdmin && (
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={() => navigate("/admin")}
              >
                Admin
              </Button>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="View Cart">
              <IconButton onClick={handleOpenCartMenu} sx={{ p: 0 }}>
                <Avatar>
                  <ShoppingCartIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElCart}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElCart)}
              onClose={handleCloseCartMenu}
            >
              {cart[0]?.goods?.map((good: any) => (
                <MenuItem key={good.good_id}>
                  <Typography textAlign="center">
                    {good.name} {good.quantities}
                  </Typography>
                  <IconButton
                    onClick={() => Meteor.call("cart.add", good.good_id)}
                    sx={{ p: 0 }}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => Meteor.call("cart.deduct", good.good_id)}
                    sx={{ p: 0 }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {location?.pathname !== "/login" && (
            <Button
              onClick={auth}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              {user ? "logout" : "login"}
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Nav;
