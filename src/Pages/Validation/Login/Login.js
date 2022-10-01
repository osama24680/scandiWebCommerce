import React, { Component } from 'react';
import "../Register/Register.scss"
import { StoreContext } from '../../../Context/Store';
import modelLogo from "../../../assets/modelLogo.png"
import { Navigate ,Link} from 'react-router-dom';
class Login extends Component {
    render() {
        const ctx = this.context
        return (
            <>
                {ctx.successLogin ? <Navigate to="/home" /> : (
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
                                <form onSubmit={(e) => ctx.handleSubmitLogin(e)} className="Register__card--formSide-inputs loginForm">
                                    <input onChange={ctx.handleInputLogin} type="email" name="email" placeholder='Email' />
                                    <p className="inputError">{ctx.joiErrors.email && ctx.joiErrors.email}</p>
                                    <input onChange={ctx.handleInputLogin} type="password" name="password" placeholder='Password' />
                                    <p className="inputError">{ctx.joiErrors.password && ctx.joiErrors.password}</p>
                                    <button className="FormBtn">{ctx.isLoading ? "Loading..." : `Confirm`}</button>
                                    {ctx.registered && <h3 className="registeredError" style={{ color: "#ff0808d1" }}>{ctx.registered}</h3>}
                                    <p className="have">You do not have an account? <Link to="/Register">Register</Link></p>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </>

        );
    }
}

export default Login;
Login.contextType = StoreContext