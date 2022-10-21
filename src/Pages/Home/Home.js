import React, { Component } from 'react'
import "./Home.scss"
import ProductCart from "../../Components/ProductCart/ProductCart"
import { StoreContext } from "../../Context/Store"
export default class Home extends Component {

    render() {
        const ctx = this.context
        return (
            <>
                <div className="Home container">
                    <h1>Category name</h1>
                    <div className="all__products">
                        {ctx.active_state.toLowerCase() === "all" ? ctx.ProductsTypesDataAll.map(item => (
                            <ProductCart item={item} key={item.id} />
                        )) : ctx.active_state.toLowerCase() === "clothes" ? ctx.ProductsTypesDataClothes.map(item => (
                            <ProductCart item={item} key={item.id} />
                        )) : ctx.ProductsTypesDataTech.map(item => (
                            <ProductCart item={item} key={item.id} />
                        ))}
                    </div>
                </div>
            </>
        )
    }
}
Home.contextType = StoreContext