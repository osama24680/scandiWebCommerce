import React, { Component } from 'react'
import "./ProductCart.scss"
import { Link } from "react-router-dom"
export default class ProductCart extends Component {

    render() {

        const { id, type, img, title, price } = this.props.item
        return (
            <div className="ProductCart">
                <Link to={`/ProductDetails/${id}`} className="productLink">
                    <img src={img} alt='' />
                    <h3>{title}</h3>
                    <p>${price}</p>
                </Link>

            </div>
        )
    }
}
