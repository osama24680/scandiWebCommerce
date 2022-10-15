import React, { Component } from 'react'
import "./ProductDetails.scss"
import { StoreContext } from "../../Context/Store"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ProductDetails extends Component {
    componentWillUnmount() {
        localStorage.removeItem('choosenID')
        localStorage.removeItem('choosenSize')
        localStorage.removeItem('choosenColor')
        localStorage.removeItem('choosenCapacity')
    }
    componentDidMount() {

    }

    render() {

        const ctx = this.context
        const element = ctx.productDetailsData
        const filteredPrices = element.prices?.find(item => item.currency?.symbol === ctx.moneyType.icon)
        // const data = "<html><body><div class='myClass'><div id='myId'>Hello World!!</div></div></body></html>";

        // const parser = new DOMParser();
        // const doc = parser.parseFromString(data, 'text/html');

        // const myClass = doc.querySelector('.myClass');
        // const myId = doc.querySelector('#myId');

        // console.log(myClass, myId);
        // console.log(doc);
        console.log(element)
        console.log(ctx.cartList)


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

                                        <div className="ProductDetails__details-divSizes">
                                            {attr.name === "Size" && (
                                                <>
                                                    <p>{attr.name}:</p>
                                                    <ul>
                                                        {attr.items.map((item, index) => (
                                                            <li
                                                                key={index}
                                                                onClick={(e) => ctx.handleSizeOfDetails(e, element, item)}
                                                                className={`${localStorage.getItem("choosenSize") === item.value && "borderActive"}`}
                                                                data-size={item.value}
                                                            >
                                                                {item.value}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                        </div>


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
                                        </div>

                                        <div className="ProductDetails__details-divCapacity">
                                            {attr.name === "Capacity" && (
                                                <>
                                                    <p>{attr.name}:</p>
                                                    <ul>
                                                        {attr.items.map((item, index) => (
                                                            <li
                                                                key={index}
                                                                onClick={(e) => ctx.handleCapacityOfDetails(e, element)}
                                                                data-capacity={item.value}
                                                            // className={`${element.size === "xs" && "borderActive"}`}
                                                            >
                                                                {item.value}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}

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
                            {
                                element?.description?.[0] === "<" ?
                                    element?.description?.slice(3, element.description.length - 4)
                                    : element?.description
                            }
                        </div>
                    </div>
                    <ToastContainer />
                </>
            </div>
        )
    }
}
export default ProductDetails
ProductDetails.contextType = StoreContext