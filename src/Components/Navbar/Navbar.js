import React, { Component } from 'react'
import "./Navbar.scss"
import logo from "../../assets/logo.png"
import cart from "../../assets/Cart.png"
import { StoreContext } from "../../Context/Store"
import { Link, Navigate } from "react-router-dom"
export default class Navbar extends Component {


    render() {
        let userName = ""
        if (localStorage.getItem("userScandiwebCommerce")) {
            let data = JSON.parse(localStorage.getItem("userScandiwebCommerce"))
            userName = data.first_name
        }
        const ctx = this.context

        const printHello = () => {
            if (ctx.successLogout) {
                return <Navigate to="/login" />
            }
            else {
                return "LogOut"
            }
        }

        return (


            <div className="container">
                <div className="Navbar">
                    <ul className="categories">
                        <li onClick={(e) => ctx.handleActiveState(e)}>
                            <Link to="/home" className={` ${ctx.active_state === "Women" && "active__navbar"}`}>Women</Link>
                        </li>
                        <li onClick={(e) => ctx.handleActiveState(e)} >
                            <Link to="/home" className={`${ctx.active_state === "Men" && "active__navbar"}`}>Men</Link>
                        </li>
                        <li onClick={(e) => ctx.handleActiveState(e)} >
                            <Link to="/home" className={`${ctx.active_state === "Kids" && "active__navbar"}`}>Kids</Link>
                        </li>

                    </ul>
                    <div className="logo">
                        <Link to="/cart">
                            <img src={logo} alt="" />
                        </Link>

                    </div>
                    <ul className="navbar__options">
                        <li className="nameOption">
                        {!ctx.welcome? "Welcome" :` Hello ${userName}` }
                            
                        </li>
                        <li onClick={() => ctx.handleDollarShow()} >
                            $
                            <ul className={`${ctx.show_dollar === true && "show_dollar"}`}>
                                <li>$ USD</li>
                                <li>&euro; Euro</li>
                                <li>&#165; JPY</li>
                            </ul>
                        </li>
                        <li>
                            <img src={cart} alt="" onClick={() => ctx.handleCartShow()} />
                            <ul className={`${ctx.show_cart === true && "show_dollar"}`}>

                                <div className="Cart__elements">
                                    <h3 className='bag'><span>My Bag </span>{ctx.numberOfItems} items</h3>
                                    {ctx.cartList.map(item => (
                                        <div className="Cart__elements-element" key={item.id}>
                                            <div className="Cart__elements-element-leftSide">
                                                <h3>{item.title.split(" ")[0]}</h3>
                                                <h2>{item.title.split(" ")[1]} {item.title.split(" ")[2]}</h2>

                                                <div className="ProductDetails__details-divPrice">
                                                    <p>${item.price.toFixed(2)}</p>
                                                </div>

                                                <div className="ProductDetails__details-divSizes">
                                                    <p>Size:</p>
                                                    <div className="listOfSizes">
                                                        <p
                                                            onClick={(e) => ctx.handleActiveSize(e)}
                                                            className={`${ctx.datasetSize === "xs" && "borderActive"}`}
                                                            data-size="xs"
                                                        >
                                                            XS
                                                        </p>
                                                        <p
                                                            onClick={(e) => ctx.handleActiveSize(e)}
                                                            className={`${ctx.datasetSize === "s" && "borderActive"}`}
                                                            data-size="s"
                                                        >
                                                            S
                                                        </p>
                                                        <p
                                                            onClick={(e) => ctx.handleActiveSize(e)}
                                                            className={`${ctx.datasetSize === "m" && "borderActive"}`}
                                                            data-size="m"
                                                        >
                                                            M
                                                        </p>
                                                        <p
                                                            onClick={(e) => ctx.handleActiveSize(e)}
                                                            className={`${ctx.datasetSize === "l" && "borderActive"}`}
                                                            data-size="l"
                                                        >
                                                            L
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="ProductDetails__details-divColors">
                                                    <p>Color:</p>
                                                    <div className="listOfColor">
                                                        <p
                                                            onClick={(e) => ctx.handleshadowColor(e)} data-color="red"
                                                            className={`${ctx.datasetColor === "red" && "shadowActive"}`}
                                                        >

                                                        </p>
                                                        <p
                                                            onClick={(e) => ctx.handleshadowColor(e)} data-color="gold"
                                                            className={`${ctx.datasetColor === "gold" && "shadowActive"}`}
                                                        >

                                                        </p>
                                                        <p
                                                            onClick={(e) => ctx.handleshadowColor(e)} data-color="aqua"
                                                            className={`${ctx.datasetColor === "aqua" && "shadowActive"}`}
                                                        >

                                                        </p>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="Cart__elements-element-rightSide">
                                                <div className="Cart__elements-icons">
                                                    <span onClick={() => ctx.handleQuantity(item, "add")}>+</span>
                                                    <p>{item.quantity}</p>
                                                    <span onClick={() => ctx.handleQuantity(item, "remove")}>-</span>
                                                </div>
                                                <div className="Cart__elements__mainImg">
                                                    <img src={item.img} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="totalCartNav">
                                        <p>Total</p>
                                        <p>$ {ctx.totalPrice}</p>
                                    </div>
                                    <div className="buttonsCartNav">
                                        <Link to="cart" onClick={() => ctx.handleCartShow()}>view bag</Link>
                                        <Link to="">check out</Link>
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
                            <li onClick={()=>ctx.logout()}><Link to="/">Logout</Link></li>
                        )}

                    </ul>
                </div>
            </div>


        )
    }
}
Navbar.contextType = StoreContext