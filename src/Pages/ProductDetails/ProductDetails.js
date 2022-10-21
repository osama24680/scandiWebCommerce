import React, { Component } from 'react'
import "./ProductDetails.scss"
import { StoreContext } from "../../Context/Store"
import 'react-toastify/dist/ReactToastify.css';
import { Interweave } from 'interweave';

class ProductDetails extends Component {
    render() {
        const ctx = this.context
        const element = ctx.productDetailsData
        const filteredPrices = element.prices?.find(item => item.currency?.symbol === ctx.moneyType.icon)

        const parser = new DOMParser(); //convert XML to HTML
        const doc = parser.parseFromString(element.description, 'text/html');

        

        return (
            <div className="ProductDetails container" >
                <>
                    <div className="ProductDetails__models">
                        {element.gallery?.map((image, index) => (
                            <div key={index}><img src={image} alt="" /> </div>
                        ))}
                    </div>
                    <div className="ProductDetails__mainImg">
                        <img src={element.gallery?.[0]} alt="" />
                    </div>
                    <div className="ProductDetails__details">
                        <h3>{element.brand}</h3>
                        <h2>{element.name}</h2>
                        {element.attributes?.length > 0 && (
                            <>
                                {element.attributes.map((attr, index) => (
                                    <div key={index}>
                                        <div className="ProductDetails__details-divDetails">
                                            <p>{attr.name}:</p>
                                            <ul>
                                                {attr.items.map((item, index) => {
                                                    return (
                                                        <li
                                                            key={index}
                                                            onClick={(e) => ctx.handlePorductAttributesDetails(attr, item)}
                                                            data-valuename={item.value}
                                                            className={`${item.value === ctx.secondAttributes[attr.name] && "shadowActive"} ${item.value}`}
                                                            style={{ backgroundColor: `${item.value.includes("#") ? item.value : ""}` }}
                                                        >
                                                            {item.value.includes("#") ? "" : item.value}
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>

                                    </div>
                                ))}
                            </>
                        )}


                        <div className="ProductDetails__details-divPrice">
                            <p>PRICE:</p>
                            <p>{filteredPrices?.currency?.symbol} {filteredPrices?.amount}</p>
                        </div>

                        <div className="ProductDetails__details-divButton">
                            <button onClick={(e) => ctx.addToCart(element, e)} disabled={ctx.isAdded} className={`${ctx.isAdded === true && "disabledButton"}`}> {ctx.isAdded ? "IN CART" : "ADD TO CART "} </button>
                        </div>

                        <div className="ProductDetails__details-divDiscription">
                            <Interweave content={element.description} />;
                        </div>
                    </div>
                </>
            </div>
        )
    }
}
export default ProductDetails
ProductDetails.contextType = StoreContext