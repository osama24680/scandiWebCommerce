import React, { Component } from 'react'
import "./Cart.scss"
import { StoreContext } from "../../Context/Store"
import { ToastContainer } from 'react-toastify';
import { Link } from "react-router-dom"
export default class Cart extends Component {

    render() {
        this.singlePrice = null
        const ctx = this.context

        return (
            <>
                <div className="Cart container">
                    <h1>Cart</h1>
                    <div className="Cart__elements">
                        {ctx.cartList.map(element => {
                            this.singlePrice = element.prices.find(item => item.currency?.symbol === ctx.moneyType.icon)
                            return (
                                <div className="Cart__elements-element" key={element.id}>
                                    <div className="Cart__elements-element-leftSide">
                                        <h3>{element.name.split(" ")[0]} {element.name.split(" ")[1]} {element.name.split(" ")[2]}</h3>
                                        <p>{this.singlePrice.currency.symbol + this.singlePrice.amount}</p>

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
                                                                    // onClick={(e) => ctx.handleCartAttributesDetails(attr, item, element)}
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

                    </div>
                    <div className="Cart__elements-total">

                        <p>Price:<span> {ctx.symbol} {ctx.price}</span>  </p>
                        <p>tax 21%: <span> {ctx.symbol} {ctx.taxs}</span>  </p>
                        <p>Quantity: <span> {ctx.numberOfItems}</span>  </p>
                        <p>Total: <span>{ctx.symbol} {ctx.totalPrice} </span> </p>
                        <button onClick={(e) => ctx.checkOut(e)}>

                            {ctx.checkOutSuccess ? (
                                <Link to="/payment" >Order</Link>
                            ) : (
                                // eslint-disable-next-line
                                <a href="" >Order</a>
                            )}
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </>
        )
    }
}
Cart.contextType = StoreContext