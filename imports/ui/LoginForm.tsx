import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Meteor.loginWithPassword(username, password, () => navigate("/"));
  };

  return (
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
        id="outlined-required"
        label="username"
        placeholder="admin/user"
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        required
        id="outlined-required"
        label="password"
        placeholder="admin/user"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </Box>
  );
};

export default Login;
