import React, { Component } from 'react'
import "./Navbar.scss"
import logo from "../../assets/logo.png"
import cart from "../../assets/Cart.png"
import { StoreContext } from "../../Context/Store"
import { Link } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
export default class Navbar extends Component {

    render() {
        const ctx = this.context
        return (
            <div className="container">
                <div className="Navbar">
                    <ul className="categories">
                        {ctx.filterCategoriesData.map((cat, index) => (
                            <li key={index} onClick={(e) => ctx.handleActiveState(e)}>
                                <Link to="/home" className={`${ctx.active_state === cat.name && "active__navbar"}`}>{cat.name}</Link>
                            </li>
                        ))}
                    </ul>
                    <div className="logo">
                        <img src={logo} alt="" />
                    </div>
                    <ul className="navbar__options">
                        <li className="nameOption">
                            {(localStorage.getItem("userScandiwebCommerce")) ? ` Hello ${ctx.userName}` : "Welcome"}

                        </li>

                        {/* **************************Currencies***************************/}
                        <li className="toClose" onClick={() => ctx.handleDollarShow()} >
                            {ctx.moneyType.icon}^
                            <ul className={`prices toClose ${ctx.show_dollar === true && "show_dollar"}`} id="dollarMenu" >
                                {ctx.currenciesData.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={(e) => ctx.handleCurrencyHover(e)}
                                        className={`toClose ${ctx.moneyType.type === item.label && "focus_currunt"}`}
                                    >
                                        {item.symbol} {item.label}
                                    </li>
                                ))}
                            </ul>
                        </li>

                        {/* **************************Cart***************************/}
                        <li className="toClose">
                            <img className="toClose" src={cart} alt="" onClick={() => ctx.handleCartShow()} />
                            <span className="ordersNumber">{ctx.numberOfItems}</span>
                            <ul className={` toClose ${ctx.show_cart === true && "show_dollar"}`}>

                                <div className="Cart__elements toClose">
                                    <h3 className=' toClose bag'><span className="toClose">My Bag </span>{ctx.numberOfItems} items</h3>

                                    {ctx.cartList.map(element => {
                                        const filteredPrices = element.prices.find(item => item.currency?.symbol === ctx.moneyType.icon)

                                        return (
                                            <div className="Cart__elements-element toClose" key={element.id}>
                                                <div className="Cart__elements-element-leftSide toClose">
                                                    <h3 className="toClose">{element.name.split(" ")[0]}</h3>
                                                    <h2 className="toClose">{element.name.split(" ")[1]} {element.name.split(" ")[2]}</h2>
                                                    <p className="toClose">{filteredPrices.currency.symbol + " " + filteredPrices.amount}</p>

                                                    <div className="allAttributes toClose">
                                                        {element.attributes.map((attr, index) => (
                                                            <div key={index} className="toClose"    >
                                                                <p className="toClose">{attr.name}</p>
                                                                <div className="toClose AttributesOfElement" >
                                                                    {attr.items.map((item, index) => {
                                                                        return (
                                                                            <span
                                                                                key={index}
                                                                                name={item.value}
                                                                                data-color={item.value}
                                                                                // onClick={(e) => ctx.handleCartAttributesDetails(attr, item, element)}
                                                                                className={` toClose ProductDetails__details ${item.value === element.selectedAttributes[attr.name] && "shadowActive"} ${item.value}`}
                                                                                style={{ backgroundColor: `${item.value}` }}
                                                                            >
                                                                                {item.value.includes("#") ? "" : item.value}
                                                                            </span>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>

                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="Cart__elements-element-rightSide toClose">
                                                    <div className="Cart__elements-icons toClose">
                                                        <span className="toClose" onClick={() => ctx.handleQuantity(element, "add")}>+</span>
                                                        <p className="toClose">{element.quantity}</p>
                                                        <span className="toClose" onClick={() => ctx.handleQuantity(element, "remove")}>-</span>
                                                    </div>
                                                    <div className="Cart__elements__mainImg toClose">
                                                        <img className="toClose" src={element.gallery[0]} alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    <div className="totalCartNav toClose">
                                        <p className="toClose">Total</p>
                                        <p className="toClose">Total: <span className="toClose">{ctx.symbol} {ctx.totalPrice} </span> </p>
                                    </div>


                                    <div className="buttonsCartNav toClose">
                                        <Link className="toClose" to="cart" onClick={() => ctx.handleCartShow()}>view bag</Link>
                                        <div onClick={(e) => ctx.checkOut(e)} className="buttonsCartNav__btn toClose">
                                            {ctx.checkOutSuccess ? (
                                                <Link to="/payment" >check out</Link>
                                            ) : (
                                                <a href="" >Checkout</a>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </ul>
                        </li>

                        
                        {!localStorage.getItem("userScandiwebCommerce") ? (
                            <>
                                <li><Link to="Login">Login</Link></li>
                                <li><Link to="register">Signup</Link></li>
                            </>
                        ) : (
                            <li onClick={() => ctx.logout()}><Link to="/">Logout</Link></li>
                        )}

                    </ul>
                </div>
                <ToastContainer />
            </div>
        )
    }
}
Navbar.contextType = StoreContext