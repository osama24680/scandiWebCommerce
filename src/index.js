import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from "./Context/Store"

// import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo"
const client = new ApolloClient({
  // cache: new InMemoryCache(),
  uri: "http://localhost:4000/graphql"
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <StoreContextProvider>
          <App />
        </StoreContextProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);


