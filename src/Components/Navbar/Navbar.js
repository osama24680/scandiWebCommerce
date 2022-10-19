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


                                    {ctx.cartList.map(element => {
                                        const filteredPrices = element.prices.find(item => item.currency?.symbol === ctx.moneyType.icon)
                                        
                                        return (
                                            <div className="Cart__elements-element" key={element.id}>
                                                <div className="Cart__elements-element-leftSide">
                                                    <h3>{element.name.split(" ")[0]}</h3>
                                                    <h2>{element.name.split(" ")[1]} {element.name.split(" ")[2]}</h2>
                                                    <p>{filteredPrices.currency.symbol + " "+  filteredPrices.amount}</p>

                                                    <div className="allAttributes">
                                                        {element.attributes.map((attr, index) => (
                                                            <div key={index}>
                                                                <p>{attr.name}</p>
                                                                <div className="AttributesOfElement" >
                                                                    {attr.items.map((item, index) => {
                                                                        return (
                                                                            <span
                                                                                key={index}
                                                                                name={item.value}
                                                                                data-color={item.value}
                                                                                onClick={(e) => ctx.handleCartAttributesDetails(attr, item, element)}
                                                                                className={`ProductDetails__details ${item.value === element.selectedAttributes[attr.name] && "shadowActive"} ${item.value}`}
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

                                                <div className="Cart__elements-element-rightSide">
                                                    <div className="Cart__elements-icons">
                                                        <span onClick={() => ctx.handleQuantity(element, "add")}>+</span>
                                                        <p>{element.quantity}</p>
                                                        <span onClick={() => ctx.handleQuantity(element, "remove")}>-</span>
                                                    </div>
                                                    <div className="Cart__elements__mainImg">
                                                        <img src={element.gallery[0]} alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    <div className="totalCartNav">
                                        <p>Total</p>
                                        <p>Total: <span>{ctx.symbol} {ctx.totalPrice} </span> </p>
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