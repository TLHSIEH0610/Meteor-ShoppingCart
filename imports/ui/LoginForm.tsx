import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Meteor.loginWithPassword(username, password, () => navigate("/"));
  };

  return (
    <Card
      sx={{
        width: 500,
        height: 250,
        padding: 3,
        ml: "auto",
        mr: "auto",
      }}
    >
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, mb: 3 },
        }}
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          fullWidth
          required
          id="outlined-required"
          label="username"
          placeholder="back2dev"
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          fullWidth
          required
          id="outlined-required"
          label="password"
          placeholder="back2dev"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" type="submit" sx={{ marginLeft: "8px" }}>
          Submit
        </Button>
      </Box>
    </Card>
  );
};

export default Login;
