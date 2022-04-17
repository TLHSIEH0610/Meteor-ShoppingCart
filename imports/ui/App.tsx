import React from "react";
import LoginForm from "./LoginForm";
import Nav from "./Nav";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Container from "@mui/material/Container";
import GoodsList from "/imports/ui/Goods";
import Admin from "/imports/ui/Admin";

export const App = () => (
  <BrowserRouter>
    <Nav />
    <Container maxWidth="xl">
      <Routes>
        <Route path="/" element={<GoodsList />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/login" element={<LoginForm />}></Route>
      </Routes>
    </Container>
  </BrowserRouter>
);
