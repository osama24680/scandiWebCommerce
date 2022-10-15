import React, { Component } from 'react'
import "./Products.scss"
import ProductCart from "../ProductCart/ProductCart"
import { data } from "../../Data"
import { StoreContext } from "../../Context/Store"
export default class Products extends Component {

    render() {
        const ctx = this.context
        // console.log(ctx.ProductsTypesDataAll[0].gallery)
        return (
            <>
                <div className="products">
                    <h1>Category name</h1>
                    <div className="all__products">
                        {ctx.active_state.toLowerCase() === "all" ? ctx.ProductsTypesDataAll.map(item => (
                            <ProductCart item={item} key={item.id} />
                        )) : ctx.active_state.toLowerCase() === "clothes" ? ctx.ProductsTypesDataClothes.map(item => (
                            <ProductCart item={item} key={item.id} />
                        )) : ctx.ProductsTypesDataTech.map(item => (
                            <ProductCart item={item} key={item.id} />
                        ))}
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