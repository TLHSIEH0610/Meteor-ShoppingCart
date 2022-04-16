import React from "react";
import LoginForm from "./LoginForm";
import Nav from "./Nav";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Container from "@mui/material/Container";
import NewGoods from "./Goods";

export const App = () => (
  <BrowserRouter>
    <Nav />
    <Container maxWidth="xl">
      <Routes>
        <Route path="/" element={<NewGoods />}></Route>
        <Route path="/login" element={<LoginForm />}></Route>
      </Routes>
    </Container>
  </BrowserRouter>
);
