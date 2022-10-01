import React, { Component } from 'react';
import "./Home.scss"
import Products from '../../Components/Products/Products'
import Navbar from "../../Components/Navbar/Navbar"
// import { useQuery, useLazyQuery, useMutation } from "@apollo/client"
import { graphql } from "react-apollo"
import { gql } from "apollo-boost"

const QUERY_USERS = gql`


{    currencies{
    label
}}
`

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

export default graphql(QUERY_USERS)(Home); // bind 2 element to graphql queryUsers // it will be stored in the props
