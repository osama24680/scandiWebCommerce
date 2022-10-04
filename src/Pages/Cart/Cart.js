import React, { Component } from 'react'
import "./Cart.scss"
import { StoreContext } from "../../Context/Store"
import { ToastContainer } from 'react-toastify';
export default class Cart extends Component {
    render() {
        const ctx = this.context
        return (
            <>
                <div className="Cart container">
                    <h1>Cart</h1>
                    <div className="Cart__elements">
                        {ctx.cartList.map(item => (
                            <div className="Cart__elements-element" key={item.id}>
                                <div className="Cart__elements-element-leftSide">
                                    <h3>{item.title.split(" ")[0]}</h3>
                                    <h2>{item.title.split(" ")[1]} {item.title.split(" ")[2]}</h2>

                                    <div className="ProductDetails__details-divPrice">
                                        <p>${item.price.toFixed(2)}</p>
                                    </div>

                                    <div className="ProductDetails__details-divSizes">
                                        <p>SIZE:</p>
                                        <ul>
                                            <li
                                                onClick={(e) => ctx.handleActiveSize(e, item, "array")}
                                                className={`${item.size === "xs" && "borderActive"}`}
                                                data-size="xs"
                                            >
                                                XS
                                            </li>
                                            <li
                                                onClick={(e) => ctx.handleActiveSize(e, item, "array")}
                                                className={`${item.size === "s" && "borderActive"}`}
                                                data-size="s"
                                            >
                                                S
                                            </li>
                                            <li
                                                onClick={(e) => ctx.handleActiveSize(e, item, "array")}
                                                className={`${item.size === "m" && "borderActive"}`}
                                                data-size="m"
                                            >
                                                M
                                            </li>
                                            <li
                                                onClick={(e) => ctx.handleActiveSize(e, item, "array")}
                                                className={`${item.size === "l" && "borderActive"}`}
                                                data-size="l"
                                            >
                                                L
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="ProductDetails__details-divColors">
                                        <p>COLOR:</p>
                                        <ul>
                                            <li
                                                onClick={(e) => ctx.handleshadowColor(e, item, "array")}
                                                data-color="red"
                                                className={`${item.color === "red" && "shadowActive"}`}
                                            >

                                            </li>
                                            <li
                                                onClick={(e) => ctx.handleshadowColor(e, item, "array")}
                                                data-color="gold"
                                                className={`${item.color === "gold" && "shadowActive"}`}
                                            >

                                            </li>
                                            <li
                                                onClick={(e) => ctx.handleshadowColor(e, item, "array")}
                                                data-color="aqua"
                                                className={`${item.color === "aqua" && "shadowActive"}`}
                                            >

                                            </li>
                                        </ul>
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

                    </div>




                    <div className="Cart__elements-total">
                        <p>Price:<span> ${ctx.price}</span>  </p>
                        <p>tax 21%: <span> ${ctx.taxs}</span>  </p>
                        <p>Quantity: <span> {ctx.numberOfItems}</span>  </p>
                        <p>Total: <span> ${ctx.totalPrice} </span> </p>
                        <button onClick={(e) => ctx.checkOut(e)}>Order</button>
                    </div>
                </div>
                <ToastContainer />
            </>
        )
    }
}
Cart.contextType = StoreContext