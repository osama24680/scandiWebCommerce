
import React, { Component, createContext } from 'react'
import { toast } from 'react-toastify';
import { data } from "../Data"
import joi from "joi"
import axios from "axios"
// import { Navigate, useNavigate, Redirect } from "react-router-dom";
import { Redirect } from 'wouter';
import { Navigate } from "react-router-dom"

export const StoreContext = createContext(0)


class StoreContextProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active_state: "Women",
            show_dollar: false,
            show_cart: false,
            show_name: false,
            // product states
            datasetColor: "",
            datasetSize: "",
            cartList: [],
            isAdded: false,
            price: 0,
            taxs: 0,
            quantity: 0,
            totalPrice: 0,

            // Validation states
            joiErrors: {},
            registered: null,
            isLoading: false,
            formData: {},
            formDataLogin: {},
            isLoggedIn: false,
            successLogin: false,
            successSignUp: false,
            successLogout: false,
            welcome: false,
        }
        this.questionsData = []
        if (localStorage.getItem("storageCartList") !== null) {
            this.questionsData = JSON.parse(localStorage.getItem("storageCartList"))
        } else {
            this.questionsData = []
        }
    }

    componentDidMount() {
        this.setState({ cartList: [...this.questionsData] })
        this.handlePrice()

    }
    componentDidUpdate(prevProps) {
        if ((this.state.cartList !== prevProps.cartList) || (this.state.cartList?.quantity !== prevProps.cartList?.quantity)) {
            localStorage.setItem("storageCartList", JSON.stringify(this.state.cartList));
        }

    }

    // ************Navbar Functions*********************
    handleActiveState = (e) => {
        this.setState({ active_state: e.target.textContent })
    }
    handleDollarShow = () => {
        this.setState({ show_dollar: !this.state.show_dollar })
        this.setState({ show_cart: false, show_name: false })
    }
    handleCartShow = () => {
        this.setState({ show_cart: !this.state.show_cart })
        this.setState({ show_dollar: false, show_name: false })
    }
    handleNameShow = () => {
        this.setState({ show_name: !this.state.show_name })
        this.setState({ show_dollar: false, show_cart: false })
    }

    // ************ProductDetails Functions*********************


    addToCart = (element, e) => {
        if (element.size === null || element.color === null) {
            toast.error("you must choose color and size")
        } else {
            if (this.questionsData?.find(item => item.id === element.id) === undefined) {
                const newElement = { ...element, quantity: 1 }
                this.questionsData.push(newElement)
                this.setState({ cartList: [...this.questionsData] }, () => { this.handlePrice() })
                toast.success("added to cart successfully")
            } else {
                toast.info("already added to cart")
            }
        }

    }


    handleQuantity = (item, operation) => {
        let tempCartList = this.state.cartList;
        const foundElement = tempCartList.find(el => el.id === item.id)
        if (operation === "add") {
            foundElement.quantity = foundElement.quantity + 1
            this.setState({ cartList: [...tempCartList] })
        } else {
            if (foundElement.quantity <= 1) {
                tempCartList = tempCartList.filter(el => el.id !== item.id)
                this.setState(() => {
                    return { cartList: [...tempCartList] }
                }, () => {
                    this.handlePrice()
                })

            } else {
                foundElement.quantity = foundElement.quantity - 1
                this.setState({ cartList: [...tempCartList] })
            }

        }
        this.handlePrice()
    }



    handlePrice = () => {
        let price = [...this.questionsData].reduce((previous, current) => previous + (current.quantity * current.price), 0)
        let taxs = price * (21 / 100)
        let numberOfItems = [...this.questionsData].reduce((previous, current) => previous + current.quantity, 0)
        const totalPrice = price + taxs
        this.setState({ price, taxs, numberOfItems, totalPrice })
    }
    resetCart = () => {
        this.setState({ cartList: [], datasetColor: "", datasetSize: "", isAdded: false, price: 0, taxs: 0, quantity: 0, totalPrice: 0 })
    }
    checkOut = (e) => {
        e.preventDefault()
        if (localStorage.getItem("userScandiwebCommerce")) {
            toast.info("Redirecting to Payment Page")
        } else {
            toast.error("You have to login first")
        }
    }

    handleshadowColor = (e, item, type) => {
        let tempCartList = this.state.cartList;
        if (type === "array") {
            let foundElement = tempCartList.find(el => el.id === item.id)
            foundElement.color = e.target.dataset.color
            this.setState({ cartList: [...tempCartList] })
        } else {
            let foundElement = data.find(el => el.id === item.id)
            foundElement.color = e.target.dataset.color
            this.setState({ cartList: [...tempCartList] })
        }

    }


    handleActiveSize = (e, item, type) => {
        let tempCartList = this.state.cartList;
        if (type === "array") {
            let foundElement = tempCartList.find(el => el.id === item.id)
            foundElement.size = e.target.dataset.size
            this.setState({ cartList: [...tempCartList] })
        } else {
            let foundElement = data.find(el => el.id === item.id)
            foundElement.size = e.target.dataset.size
            this.setState({ cartList: [...tempCartList] })
        }

    }


    // ************Validation Functions*********************
    // ########### Register ############## 

    handleInput = (e) => {
        let tempValues = { ...this.state.formData }
        tempValues[e.target.name] = e.target.value
        this.setState({ formData: tempValues })
    }

    validateForm = (formData) => {
        let schema = joi.object({
            first_name: joi.string().label("First Name").pattern(/[A-Za-z]/).min(3).max(8).required().messages(
                this.validProps("First Name")
            ),
            last_name: joi.string().alphanum().min(3).max(8).required().messages(
                this.validProps("Last Name")
            ),
            age: joi.number().min(16).max(60).required().messages({
                'number.base': `Age should be a type of 'number'`,
                'number.empty': `Age cannot be an empty field`,
                'number.min': `minimum age is {#limit}`,
                'number.max': `maximum age is {#limit}`,
                'any.required': `Age is a required field`,
            }),
            email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).messages({
                'string.base': `Email should be a type of 'text'`,
                'string.empty': `Email cannot be an empty field`,
                'any.required': `Email is a required field`,
            }),
            password: joi.string().alphanum().pattern(/[A-Za-z0-9]{5}/).messages({
                'string.empty': `Password cannot be an empty field`,
                'string.min': `Password should have a minimum length of {#limit}`,
                'any.required': `Password is a required field`,
                'string.pattern.base': "passwords should be letters and numbers only"
            }),
        })
        return schema.validate(formData, { abortEarly: false })
    }

    validProps = (type) => {
        let objectProps = {
            'string.base': `${type} should be a type of 'text'`,
            'string.empty': `${type} cannot be an empty field`,
            'string.min': `${type} should have a minimum length of {#limit}`,
            'string.max': `${type} should have a maximum length of {#limit}`,
            'any.required': `${type} is a required field`,
        }
        return objectProps;
    }

    HandleSubmit = async (e) => {
        e.preventDefault()
        this.setState({ isLoading: true })
        let validateResult = this.validateForm(this.state.formData)
        let listErrors = {};
        this.setState({ joiErrors: listErrors })
        if (validateResult.error) {
            for (let item of validateResult.error.details) {
                listErrors[item.path[0]] = item.message
            }
        } else {
            let { data } = await axios.post(`https://routeegypt.herokuapp.com/signup`, this.state.formData)
            if (data.message === "success") {
                this.setState({ successSignUp: true })
            } else {
                this.setState({ registered: data.errors?.email.message })
                console.log("else", data)
            }
        }
        this.setState({ isLoading: false })
    }

    // ########### Login ############## 

    handleInputLogin = (e) => {
        let tempValues = { ...this.state.formDataLogin }
        tempValues[e.target.name] = e.target.value
        this.setState({ formDataLogin: tempValues })
    }

    validateFormLogin = (formDataLogin) => {
        let schema = joi.object({

            email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).messages({
                'string.base': `Email should be a type of 'text'`,
                'string.empty': `Email cannot be an empty field`,
                'any.required': `Email is a required field`,
            }),
            password: joi.string().alphanum().pattern(/[A-Za-z0-9]{5}/).messages({
                'string.empty': `Password cannot be an empty field`,
                'string.min': `Password should have a minimum length of {#limit}`,
                'any.required': `Password is a required field`,
                'string.pattern.base': "passwords should be letters and numbers only"
            }),
        })
        return schema.validate(formDataLogin, { abortEarly: false })
    }

    handleSubmitLogin = async (e) => {
        e.preventDefault()
        this.setState({ isLoading: true })
        let validateResult = this.validateFormLogin(this.state.formDataLogin)
        let listErrors = {};
        this.setState({ joiErrors: listErrors })
        if (validateResult.error) {
            for (let item of validateResult.error.details) {
                listErrors[item.path[0]] = item.message
            }
        } else {
            let { data } = await axios.post(`https://routeegypt.herokuapp.com/signin`, this.state.formDataLogin)

            console.log(data)
            if (data.message === "success") {
                this.setState({ successLogin: true, isLoggedIn: true, welcome: true })
                localStorage.setItem("userScandiwebCommerce", JSON.stringify(data.user))
            } else {
                this.setState({ registered: data.message, isLoading: false, successLogin: false })
            }
        }
        this.setState({ isLoading: false })


    }

    logout = () => {
        localStorage.removeItem("userScandiwebCommerce")
        this.setState({ welcome: false })

    }


    render() {
        const {
            active_state, show_dollar, show_cart, show_name,
            datasetSize, datasetColor, cartList, isAdded, price, taxs, numberOfItems, totalPrice,
            joiErrors, registered, isLoading, formData, formDataLogin, isLoggedIn, successSignUp, successLogin, successLogout, welcome
        } = this.state



        const {
            handleActiveState, handleDollarShow, handleNameShow,
            handleCartShow, handleActiveSize, handleshadowColor, addToCart, addItemQuantity, removeItemQuantity, handleQuantity,
            handleInput, HandleSubmit, handleInputLogin, handleSubmitLogin, logout, checkOut,
        } = this
        const values = {
            active_state,
            show_dollar,
            show_cart,
            show_name,

            handleActiveState,
            handleDollarShow,
            handleCartShow,
            handleNameShow,

            handleActiveSize,
            datasetSize,
            datasetColor,
            handleshadowColor,
            cartList,
            isAdded,
            addToCart,
            addItemQuantity,
            removeItemQuantity,
            handleQuantity,
            price,
            taxs,
            numberOfItems,
            totalPrice,

            joiErrors,
            registered,
            isLoading,
            formData,
            formDataLogin,
            isLoggedIn,
            handleInput,
            HandleSubmit,
            handleInputLogin,
            handleSubmitLogin,
            successSignUp,
            successLogin,
            successLogout,
            logout,
            welcome,
            checkOut,

        }

        return (
            <StoreContext.Provider value={values}>
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}
export default StoreContextProvider;
// export default  withRouter(StoreContextProvider);
