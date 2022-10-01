import React, { Component, createContext } from 'react'
import { toast } from 'react-toastify';
import joi from "joi"
import axios from "axios"
// import { Navigate, useNavigate, Redirect } from "react-router-dom";
import { Redirect } from 'wouter';
import { Navigate } from "react-router-dom"

export const StoreContext = createContext(0)

let cartData;
if(localStorage.getItem("storageCartList") !==null){
    cartData=JSON.parse(localStorage.getItem("questionsItems"))
}else{
    cartData=[]
}


class StoreContextProvider extends Component {

    state = {
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
    componentDidMount(){
        localStorage.setItem("storageCartList", JSON.stringify(this.state.cartList)); 
    }
    componentDidUpdate(prevProps,prevState){
        if(this.state)
        console.log("prevProps => ",prevProps)
        console.log("prevState => ",prevState)
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
    handleActiveSize = (e) => {
        this.setState({ datasetSize: e.target.dataset.size })
    }
    handleshadowColor = (e) => {
        this.setState({ datasetColor: e.target.dataset.color })
    }
    addToCart = (element, e) => {
        let tempCartList = this.state.cartList
        if (tempCartList.find(item => item.id === element.id) === undefined) {
            toast.success("added to cart successfully")
            const newElement = { ...element, quantity: 1, size: this.state.datasetSize, color: this.state.datasetColor }
            this.setState(prevState => {
                return { cartList: [...prevState.cartList, newElement] }

            }, () => {
                this.handlePrice()
            })

        } else {
            toast.info("already added to cart")
        }
    }

    handleQuantity = (item, operation) => {
        let tempCartList = this.state.cartList
        const foundElement = tempCartList.find(el => el.id === item.id)
        const indexElement = tempCartList.indexOf(foundElement)
        const editedElement = tempCartList[indexElement]
        if (operation === "add") {
            editedElement.quantity = editedElement.quantity + 1

        } else {
            if (editedElement.quantity <= 1) {
                tempCartList = tempCartList.filter(el => el !== item)
                this.setState(() => {
                    return { cartList: tempCartList }
                }, () => {
                    this.handlePrice()
                })

            } else {
                editedElement.quantity = editedElement.quantity - 1
            }

        }

        this.setState({ cartList: tempCartList })
        this.handlePrice()
    }
    handlePrice = () => {
        let tempCartList = this.state.cartList
        let price = tempCartList.reduce((previous, current) => previous + (current.quantity * current.price), 0)
        let taxs = price * (21 / 100)
        let numberOfItems = tempCartList.reduce((previous, current) => previous + current.quantity, 0)
        const totalPrice = price + taxs
        this.setState({ price, taxs, numberOfItems, totalPrice })
    }
    resetCart = () => {
        this.setState({ cartList: [], datasetColor: "", datasetSize: "", isAdded: false, price: 0, taxs: 0, quantity: 0, totalPrice: 0 })
    }
    checkOut = () => {
        if (localStorage.getItem("userScandiwebCommerce")) {
            // payment method
        } else {
            toast.error("You have to login first")
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
        this.resetCart()
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