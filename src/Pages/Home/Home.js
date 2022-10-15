import React, { Component } from 'react';
import "./Home.scss"
import Products from '../../Components/Products/Products'
class Home extends Component {

    render() {

        return (
            <>
                <div className="container">
                    <Products />
                </div>
            </>
        );
    }
}

export default Home; // bind 2 element to graphql queryUsers // it will be stored in the props
