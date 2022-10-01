import React, { Component } from 'react'
import "./Products.scss"
import ProductCart from "../ProductCart/ProductCart"
import Navbar from '../Navbar/Navbar'
import { data } from "../../Data"
import { StoreContext } from "../../Context/Store"
import { Link } from "react-router-dom"

export default class Products extends Component {

    render() {
        const ctx = this.context
        return (
            <>
               
                <div className="products">
                    <h1>Category name</h1>
                    <div className="all__products">
                        {data.filter(el => el.type === ctx.active_state.toLowerCase()).map(item => (
                            <ProductCart item={item} key={item.id} />
                        ))}
                    </div>
                </div>
            </>
        )
    }
}
Products.contextType = StoreContext