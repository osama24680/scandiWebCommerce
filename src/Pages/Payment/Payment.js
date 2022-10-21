import React, { Component } from 'react';
import "./Payment.scss"
import { StoreContext } from "../../Context/Store"
import { Link, Navigate } from "react-router-dom"
class Payment extends Component {
    componentWillUnmount() {
        localStorage.removeItem("is_payment")
    }
    render() {
        this.singlePrice = null
        const ctx = this.context
        localStorage.setItem('is_payment', JSON.stringify("osama"))

        return (
            <>
                {!ctx.successPayment ? (
                    <div className="payment_page">
                        <h3 onClick={() => localStorage.removeItem("is_payment")}><Link to="/">Go Home</Link></h3>
                        <div className="payment container">

                            <div className="payment__products">
                                <h2>Pay Now</h2>
                                <h1>{ctx.symbol} {ctx.totalPrice} </h1>
                                <div className="payment__products-productDetails">
                                    {ctx.cartList.map(element => {
                                        this.singlePrice = element.prices.find(item => item.currency?.symbol === ctx.moneyType.icon)
                                        return (
                                            <div key={element.id} className="payment__products-productDetails-element">
                                                <div className="productImgDiv">
                                                    <img src={element.gallery[0]} alt="" />
                                                    <p>
                                                        <span>{element.id}</span>
                                                        <span>Qty {element.quantity}</span>
                                                    </p>
                                                </div>
                                                <div className="productPrice">
                                                    <p>{this.singlePrice.currency.symbol + this.singlePrice.amount}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="payment__form">
                                <h2>Pay with card</h2>
                                <form onSubmit={(e) => ctx.handleSubmitPayment(e)} className="payment__form-formInputs">
                                    <div>
                                        <label>Email</label>
                                        <input onChange={(e) => ctx.handleChangePayment(e)} name="email" type="email" />
                                        <p className="inputError">{ctx.joiErrorsPayment.email && ctx.joiErrorsPayment.email}</p>
                                    </div>

                                    <div className="Card_information">
                                        <label>Card information</label>
                                        <input onChange={(e) => ctx.handleChangePayment(e)} name="cardNumber" type="number" placeholder="1234 1234 1234 1234" />
                                        <p className="inputError">{ctx.joiErrorsPayment.cardNumber && ctx.joiErrorsPayment.cardNumber}</p>
                                        <div className="cardPrivateData">
                                            <div className="inputGroup">
                                                <input onChange={(e) => ctx.handleChangePayment(e)} name="MM" type="number" placeholder="MM" />
                                                <p className="inputError">{ctx.joiErrorsPayment.MM && ctx.joiErrorsPayment.MM}</p>
                                            </div>
                                            <div className="inputGroup">
                                                <input onChange={(e) => ctx.handleChangePayment(e)} name="YY" type="number" placeholder="YY" />
                                                <p className="inputError">{ctx.joiErrorsPayment.YY && ctx.joiErrorsPayment.YY}</p>
                                            </div>

                                            <div className="inputGroup">
                                                <input onChange={(e) => ctx.handleChangePayment(e)} name="CVC" type="number" placeholder="CVC" />
                                                <p className="inputError">{ctx.joiErrorsPayment.CVC && ctx.joiErrorsPayment.CVC}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label>Name on card</label>
                                        <input onChange={(e) => ctx.handleChangePayment(e)} name="Name" type="text" />
                                        <p className="inputError">{ctx.joiErrorsPayment.Name && ctx.joiErrorsPayment.Name}</p>
                                    </div>
                                    <div>
                                        <label>Countery</label>
                                        <input onChange={(e) => ctx.handleChangePayment(e)} name="Countery" type="text" />
                                        <p className="inputError">{ctx.joiErrorsPayment.Countery && ctx.joiErrorsPayment.Countery}</p>
                                    </div>
                                    <button><span>{ctx.isLoading ? "Processing..." : `Pay`}</span></button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : <Navigate to="/" />}

            </>
        );
    }
}

export default Payment;
Payment.contextType = StoreContext