import React, { Component } from 'react'
import "./ProductDetails.scss"
import model from "../../assets/shirt.png"
import withRouter from "../../Components/HOC/withRouter"
import { data } from "../../Data"
import { StoreContext } from "../../Context/Store"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ProductDetails extends Component {
    render() {
        const { id } = this.props.params
        const elements = data.filter(el => el.id === Number(id))
        const ctx = this.context
        return (
            <>
                <div className="ProductDetails container" >
                    {elements.map(item => (
                        <>
                            <div className="ProductDetails__models">
                                <div><img src={model} alt="" /> </div>
                                <div><img src={model} alt="" /> </div>
                                <div><img src={model} alt="" /> </div>
                            </div>
                            <div className="ProductDetails__mainImg">
                                <img src={item.img} alt="" />
                            </div>
                            <div className="ProductDetails__details">

                                <h3>{item.title.split(" ")[0]}</h3>
                                <h2>{item.title.split(" ")[1]} {item.title.split(" ")[2]}</h2>
                                <div className="ProductDetails__details-divSizes">
                                    <p>SIZE:</p>
                                    <ul>
                                        <li
                                            onClick={(e) => ctx.handleActiveSize(e, item, "object")}
                                            className={`${item.size === "xs" && "borderActive"}`}
                                            data-size="xs"
                                        >
                                            XS
                                        </li>
                                        <li
                                            onClick={(e) => ctx.handleActiveSize(e, item, "object")}
                                            className={`${item.size === "s" && "borderActive"}`}
                                            data-size="s"
                                        >
                                            S
                                        </li>
                                        <li
                                            onClick={(e) => ctx.handleActiveSize(e, item, "object")}
                                            className={`${item.size === "m" && "borderActive"}`}
                                            data-size="m"
                                        >
                                            M
                                        </li>
                                        <li
                                            onClick={(e) => ctx.handleActiveSize(e, item, "object")}
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
                                            onClick={(e) => ctx.handleshadowColor(e, item, "object")}
                                            data-color="red"
                                            className={`${item.color === "red" && "shadowActive"}`}
                                        >
                                        </li>
                                        <li
                                            onClick={(e) => ctx.handleshadowColor(e, item, "object")}
                                            data-color="gold"
                                            className={`${item.color === "gold" && "shadowActive"}`}
                                        >

                                        </li>
                                        <li
                                            onClick={(e) => ctx.handleshadowColor(e, item, "object")}
                                            data-color="aqua"
                                            className={`${item.color === "aqua" && "shadowActive"}`}
                                        >

                                        </li>
                                    </ul>
                                </div>

                                <div className="ProductDetails__details-divPrice">
                                    <p>PRICE:</p>
                                    <p>${item.price.toFixed(2)}</p>
                                </div>

                                <div className="ProductDetails__details-divButton">
                                    <button onClick={(e) => ctx.addToCart(item, e)} disabled={ctx.isAdded} className={`${ctx.isAdded === true && "disabledButton"}`}> {ctx.isAdded ? "IN CART" : "ADD TO CART "} </button>
                                </div>

                                <div className="ProductDetails__details-divDiscription">
                                    <p>Find stunning women's cocktail dresses and party dresses. Stand out in lace
                                        and metallic cocktail dresses and party dresses from all your favorite brands.
                                    </p>
                                </div>
                            </div>
                            <ToastContainer />
                        </>
                    ))}

                </div>
            </>

        )
    }
}
export default withRouter(ProductDetails)
ProductDetails.contextType = StoreContext