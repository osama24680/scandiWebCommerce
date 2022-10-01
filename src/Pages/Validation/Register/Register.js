import React, { Component } from 'react';
import "./Register.scss"
import { StoreContext } from '../../../Context/Store';
import modelLogo from "../../../assets/modelLogo.png"
import { Link, Navigate } from "react-router-dom";

class Register extends Component {
    render() {
        const ctx = this.context
        return (
            <>
                {ctx.successSignUp === true ? <Navigate to="/login" /> : (
                    <div className="Register">
                        <div className="Register__card">
                            <div className="Register__card--logoSide">
                                <div className="Register__card--logoSide-img">
                                    <img src={modelLogo} alt="" />
                                </div>

                                <h3>get your modern fashion</h3>
                            </div>
                            <div className="Register__card--formSide">
                                <h3>Create Your Account</h3>
                                <form onSubmit={(e) => ctx.HandleSubmit(e)} className="Register__card--formSide-inputs">
                                    <input onChange={ctx.handleInput} type="text" name="first_name" placeholder='First Name' />
                                    <p className="inputError">{ctx.joiErrors.first_name && ctx.joiErrors.first_name}</p>
                                    <input onChange={ctx.handleInput} type="text" name="last_name" placeholder='Last Name' />
                                    <p className="inputError">{ctx.joiErrors.last_name && ctx.joiErrors.last_name}</p>
                                    <input onChange={ctx.handleInput} type="number" name="age" placeholder='Age' />
                                    <p className="inputError">{ctx.joiErrors.age && ctx.joiErrors.age}</p>
                                    <input onChange={ctx.handleInput} type="email" name="email" placeholder='Email' />
                                    <p className="inputError">{ctx.joiErrors.email && ctx.joiErrors.email}</p>
                                    <input onChange={ctx.handleInput} type="password" name="password" placeholder='Password' />
                                    <p className="inputError">{ctx.joiErrors.password && ctx.joiErrors.password}</p>
                                    <button className="FormBtn">{ctx.isLoading ? "Loading..." : `Confirm`}</button>
                                    {ctx.registered && <h3 className="registeredError" style={{ color: "#ff0808d1" }}>{ctx.registered}</h3>}
                                    <p className="have">You have an account? <Link to="/login">Log In</Link></p>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </>

        );
    }
}

export default Register;
Register.contextType = StoreContext