import React, { Component } from 'react'
import Home from './Pages/Home/Home'
import Register from './Pages/Validation/Register/Register'
import Login from './Pages/Validation/Login/Login'
import ProductDetails from './Pages/ProductDetails/ProductDetails'
import Cart from "./Pages/Cart/Cart"
import Payment from "./Pages/Payment/Payment"
import Navbar from "./Components/Navbar/Navbar"
import { StoreContext } from './Context/Store'
import { Routes, Route } from 'react-router-dom'
// import {  Route } from "wouter";
export default class App extends Component {
  componentDidMount() {
    localStorage.removeItem("is_payment")
  }

  render() {
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
          <Route path="Payment" element={<Payment />} />
        </Routes>
      </>

    )
  }
}
App.contextType = StoreContext