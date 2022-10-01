import React, { Component } from 'react'
import Home from './Pages/Home/Home'
import Register from './Pages/Validation/Register/Register'
import Login from './Pages/Validation/Login/Login'
import ProductDetails from './Pages/ProductDetails/ProductDetails'
import Cart from "./Pages/Cart/Cart"
import Navbar from "./Components/Navbar/Navbar"
import { StoreContext } from './Context/Store'
import { Routes, Route } from 'react-router-dom'
// import {  Route } from "wouter";
export default class App extends Component {
  render() {
    const ctx = this.context
    return (
      <>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="ProductDetails/:id" element={<ProductDetails />} />
          <Route path="Cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="Register" element={<Register />} />
        </Routes>
      </>

    )
  }
}
// 15cb98
// nav dropdown =>  z-index: 10;
App.contextType = StoreContext