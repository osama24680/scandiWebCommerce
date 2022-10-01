import React, { Component } from 'react';
import { Outlet, Navigate } from 'react-router-dom'

class ProtectedRouter extends Component {
    render() {
        return (
            <div>
                {localStorage.getItem("userScandiwebCommerce") ? <Outlet /> : <Navigate to="Login" />}
            </div>
        );
    }
}

export default ProtectedRouter;
