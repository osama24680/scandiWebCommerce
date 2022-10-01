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
        const element = data.find(el => el.id === Number(id))
        const ctx = this.context
        return (
            <>
                <div className="ProductDetails container" >
                    <div className="ProductDetails__models">
                        <div><img src={model} alt="" /> </div>
                        <div><img src={model} alt="" /> </div>
                        <div><img src={model} alt="" /> </div>
                    </div>
                    <div className="ProductDetails__mainImg">
                        <img src={element.img} alt="" />
                    </div>
                    <div className="ProductDetails__details">

                        <h3>{element.title.split(" ")[0]}</h3>
                        <h2>{element.title.split(" ")[1]} {element.title.split(" ")[2]}</h2>
                        <div className="ProductDetails__details-divSizes">
                            <p>SIZE:</p>
                            <ul>
                                <li
                                    onClick={(e) => ctx.handleActiveSize(e)}
                                    className={`${ctx.datasetSize === "xs" && "borderActive"}`}
                                    data-size="xs"
                                >
                                    XS
                                </li>
                                <li
                                    onClick={(e) => ctx.handleActiveSize(e)}
                                    className={`${ctx.datasetSize === "s" && "borderActive"}`}
                                    data-size="s"
                                >
                                    S
                                </li>
                                <li
                                    onClick={(e) => ctx.handleActiveSize(e)}
                                    className={`${ctx.datasetSize === "m" && "borderActive"}`}
                                    data-size="m"
                                >
                                    M
                                </li>
                                <li
                                    onClick={(e) => ctx.handleActiveSize(e)}
                                    className={`${ctx.datasetSize === "l" && "borderActive"}`}
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
                                    onClick={(e) => ctx.handleshadowColor(e)}
                                    data-color="red"
                                    className={`${ctx.datasetColor === "red" && "shadowActive"}`}
                                >

                                </li>
                                <li
                                    onClick={(e) => ctx.handleshadowColor(e)}
                                    data-color="gold"
                                    className={`${ctx.datasetColor === "gold" && "shadowActive"}`}
                                >

                                </li>
                                <li
                                    onClick={(e) => ctx.handleshadowColor(e)}
                                    data-color="aqua"
                                    className={`${ctx.datasetColor === "aqua" && "shadowActive"}`}
                                >

                                </li>
                            </ul>
                        </div>

                        <div className="ProductDetails__details-divPrice">
                            <p>PRICE:</p>
                            <p>${element.price.toFixed(2)}</p>
                        </div>

                        <div className="ProductDetails__details-divButton">
                            <button onClick={(e) => ctx.addToCart(element, e)} disabled={ctx.isAdded} className={`${ctx.isAdded === true && "disabledButton"}`}> {ctx.isAdded ? "IN CART" : "ADD TO CART "} </button>
                        </div>

                        <div className="ProductDetails__details-divDiscription">
                            <p>Find stunning women's cocktail dresses and party dresses. Stand out in lace
                                and metallic cocktail dresses and party dresses from all your favorite brands.
                            </p>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </>

        )
    }
}
export default withRouter(ProductDetails)
ProductDetails.contextType = StoreContext