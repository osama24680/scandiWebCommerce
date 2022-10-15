import React, { Component } from 'react'
import "./Navbar.scss"
import logo from "../../assets/logo.png"
import cart from "../../assets/Cart.png"
import { StoreContext } from "../../Context/Store"
import { Link } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
export default class Navbar extends Component {
    userName = ""
    componentDidMount() {
        if (localStorage.getItem("userScandiwebCommerce")) {
            let data = JSON.parse(localStorage.getItem("userScandiwebCommerce"))
            this.userName = data.first_name
        }
    }
    render() {
        const ctx = this.context
        let x="Osama Megahed"
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
                        <Link to="/cart">
                            <img src={logo} alt="" />
                        </Link>
                    </div>
                    <ul className="navbar__options">
                        <li className="nameOption">
                            {!ctx.welcome ? "Welcome" : ` Hello ${this.userName}`}

                        </li>
                        <li onClick={() => ctx.handleDollarShow()} >
                            {ctx.moneyType.icon} 
                            {/* {ctx.moneyType === {} ? "$"  : ctx.moneyType.icon
                            } */}
                            <ul className={`prices ${ctx.show_dollar === true && "show_dollar"}`}>
                                {ctx.currenciesData.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={(e) => ctx.handleCurrencyHover(e)}
                                        className={`${ctx.moneyType.type === item.label && "focus_currunt"}`}
                                    >
                                        {item.symbol} {item.label}
                                    </li>
                                ))}
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
                                                <h3>{item.name.split(" ")[0]}</h3>
                                                <h2>{item.name.split(" ")[1]} {item.name.split(" ")[2]}</h2>

                                                <div className="ProductDetails__details-divPrice">
                                                    {/* <p>${item.price.toFixed(2)}</p> */}
                                                </div>

                                                <div className="ProductDetails__details-divSizes">
                                                    <p>Size:</p>
                                                    <div className="listOfSizes">
                                                        <p
                                                            onClick={(e) => ctx.handleActiveSize(e, item, "array")}
                                                            className={`${item.size === "xs" && "borderActive"}`}
                                                            data-size="xs"
                                                        >
                                                            XS
                                                        </p>
                                                        <p
                                                            onClick={(e) => ctx.handleActiveSize(e, item, "array")}
                                                            className={`${item.size === "s" && "borderActive"}`}
                                                            data-size="s"
                                                        >
                                                            S
                                                        </p>
                                                        <p
                                                            onClick={(e) => ctx.handleActiveSize(e, item, "array")}
                                                            className={`${item.size === "m" && "borderActive"}`}
                                                            data-size="m"
                                                        >
                                                            M
                                                        </p>
                                                        <p
                                                            onClick={(e) => ctx.handleActiveSize(e, item, "array")}
                                                            className={`${item.size === "l" && "borderActive"}`}
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
                                                            onClick={(e) => ctx.handleshadowColor(e, item, "array")}
                                                            data-color="red"
                                                            className={`${item.color === "red" && "shadowActive"}`}
                                                        >

                                                        </p>
                                                        <p
                                                            onClick={(e) => ctx.handleshadowColor(e, item, "array")}
                                                            data-color="gold"
                                                            className={`${item.color === "gold" && "shadowActive"}`}
                                                        >

                                                        </p>
                                                        <p
                                                            onClick={(e) => ctx.handleshadowColor(e, item, "array")}
                                                            data-color="aqua"
                                                            className={`${item.color === "aqua" && "shadowActive"}`}
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
                                        <a href="" onClick={(e) => ctx.checkOut(e)}>check out</a>
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