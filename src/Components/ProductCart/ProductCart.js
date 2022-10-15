import React, { Component } from 'react'
import "./ProductCart.scss"
import { StoreContext } from "../../Context/Store"
import { Link } from "react-router-dom"
export default class ProductCart extends Component {

    render() {
        const ctx = this.context
        const { id, name, prices, gallery } = this.props.item
        const filteredPrices = prices.find(item => item.currency?.symbol === ctx.moneyType.icon)
        return (
            <div className="ProductCart">
                <Link to={`/ProductDetails/${id}`} className="productLink" onClick={() => ctx.fetchProductDetails(id)}>
                    <img src={gallery[0]} alt='' />
                    <h3>{name}</h3>
                    <p>{filteredPrices.currency.symbol} {filteredPrices.amount}</p>
                </Link>

            </div>
        )
    }
}
ProductCart.contextType = StoreContext