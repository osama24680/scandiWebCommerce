import React, { Component } from 'react'
import "./Cart.scss"
import { StoreContext } from "../../Context/Store"
import { ToastContainer } from 'react-toastify';
export default class Cart extends Component {
    render() {
        const ctx = this.context
        console.log(ctx.cartList[0]?.newObject)
        return (
            <>
                <div className="Cart container">
                    <h1>Cart</h1>
                    <div className="Cart__elements">
                        {ctx.cartList.map(item => (
                            <div className="Cart__elements-element" key={item.id}>
                                <div className="Cart__elements-element-leftSide">
                                    <h3>{item.name.split(" ")[0]}</h3>
                                    <h2>{item.name.split(" ")[1]} {item.name.split(" ")[2]}</h2>

                                    <div className="ProductDetails__details-divPrice">
                                        {/* <p>${item.price.toFixed(2)}</p> */}
                                    </div>


                                    {/* 
                                    <div className="ProductDetails__details-divColors">
                                            {attr.name === "Color" && (
                                                <>
                                                    <p>{attr.name}:</p>
                                                    <ul>
                                                        {attr.items.map((item, index) => (
                                                            <li
                                                                key={index}
                                                                onClick={(e) => ctx.handleColorOfDetails(e, element)}
                                                                data-color={item.value}
                                                                className={`${element.color === "red" && "shadowActive"} ${item.value}`}
                                                                style={{ backgroundColor: `${item.value}` }}
                                                            >
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                        </div> */}
                                    <div className="allAttributes">
                                        {item.attributes.map((attr, index) => (
                                            <>
                                                <p>{attr.name}</p>
                                                <div className="AttributesOfElement" key={index}>
                                                    {attr.items.map((attrElement, index) => {
                                                        {/* console.log(item.newArray)
                                                        console.log(attrElement.value ) */}
                                                        return (
                                                            <span
                                                                name={attrElement.value}
                                                                data-color={attrElement.value}
                                                                onClick={(e) => ctx.handleColorOfDetails(e, item)}
                                                                // className={`ProductDetails__details ${attrElement.color === "red" && "shadowActive"} ${item.value}`}
                                                                className={`ProductDetails__details ${item.newArray?.map(el => el === `${attrElement.value}` && "shadowActive")} ${item.value}`}
                                                                style={{ backgroundColor: `${attrElement.value}` }}
                                                            >
                                                                {attrElement.value.includes("#") ? "" : attrElement.value}
                                                            </span>
                                                        )
                                                    })}
                                                </div>
                                            </>

                                        ))}
                                    </div>

                                    {/* <div className="ProductDetails__details-divSizes">
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
                                    </div> */}

                                </div>

                                <div className="Cart__elements-element-rightSide">
                                    <div className="Cart__elements-icons">
                                        <span onClick={() => ctx.handleQuantity(item, "add")}>+</span>
                                        <p>{item.quantity}</p>
                                        <span onClick={() => ctx.handleQuantity(item, "remove")}>-</span>
                                    </div>
                                    <div className="Cart__elements__mainImg">
                                        <img src={item.gallery[0]} alt="" />
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