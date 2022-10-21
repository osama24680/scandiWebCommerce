
import React, { Component, createContext, createRef } from 'react'
import { toast } from 'react-toastify';
import joi from "joi"
import axios from "axios"
import { request, gql } from 'graphql-request'



export const StoreContext = createContext("default")

class StoreContextProvider extends Component {
    constructor(props) {
        super(props)

        this.state = {

            // Navbar states
            active_state: "all",
            show_dollar: false, show_cart: false, show_name: false,
            userName: "os",
            currenciesData: [],

            // Data states
            filterCategoriesData: [],
            ProductsTypesDataAll: [], ProductsTypesDataClothes: [], ProductsTypesDataTech: [],
            priceDefaultType: "USD", priceDefaultIcon: "$", moneyType: { type: "USD", icon: "$" }, symbol: "$",

            // product states
            datasetColor: "", datasetSize: "",
            cartList: [], isAdded: false,
            price: 0, taxs: 0, quantity: 0, totalPrice: 0,
            productDetailsData: {}, attributeOfStates: [], secondAttributes: [],
            checkOutSuccess: false,

            // Validation states
            joiErrors: {}, registered: null, isLoading: false,
            formData: {}, formDataLogin: {},
            isLoggedIn: false, successLogin: false, successSignUp: false, successLogout: false,

            // Payment states
            paymentData: {}, joiErrorsPayment: {}, successPayment: false,
        }

        this.graphQL_API = "http://localhost:4000/graphql"
        this.secondObject = {}


        // *********************************handle localStorage*********************************
        this.questionsData = []
        if (localStorage.getItem("storageCartList") !== null) {
            this.questionsData = JSON.parse(localStorage.getItem("storageCartList"))
        } else {
            this.questionsData = []
        }

        this.CurruncyTypesData = {}
        if (localStorage.getItem("StorageCurruncyTypesData") !== null) {
            this.CurruncyTypesData = JSON.parse(localStorage.getItem("StorageCurruncyTypesData"))
        } else {
            this.CurruncyTypesData = this.state.moneyType
        }

        this.arrayOfAttributes = []
        if (localStorage.getItem("storage_arrayOfAttributes") !== null) {
            this.arrayOfAttributes = JSON.parse(localStorage.getItem("storage_arrayOfAttributes"))
        } else {
            this.arrayOfAttributes = []
        }

        this.userLogin = ""
        if (localStorage.getItem("userScandiwebCommerce") !== null) {
            this.userLogin = JSON.parse(localStorage.getItem("userScandiwebCommerce")).first_name

        } else {
            this.userLogin = ""
        }


        // *********************************Queries*********************************
        this.product_types = gql`
            query getAllUsers{
                categories{
                    products{
                        id,
                        name,
                        gallery ,
                        prices{
                            amount,
                            currency{
                                label
                                symbol
                            }
                        },
                 }
                }
            }
        `
        this.currencieCategories = gql`
            query currencies{
                currencies{
                    label,
                    symbol,
                }
        }
        `
        this.filterCategories = gql`
            query categories{
                categories{
                name
                }
        }
        `
        this.ProductItem = gql`
            query GetProduct($id:String!){
                product(id:$id){
                    id,
                    name,
                    inStock
                    gallery ,
                    description,
                    category,
                    attributes{
                        id
                        name
                        type 
                        items {
                            displayValue
                            value
                            id
                        }
                    } 
                    prices{
                        amount,
                        currency{
                            label
                            symbol
                        }
                    },
                    brand,
                }
}
        `
    }


    // *********************************Component Life Cycle*********************************
    componentDidMount() {
        this.setState({ cartList: [...this.questionsData] })
        this.setState({ moneyType: { ...this.CurruncyTypesData } })
        this.setState({ attributeOfStates: { ...this.arrayOfAttributes } })
        this.handlePrice()
        this.fetchCurrencies_filterCategories_ProductsTypes()
        this.fetchProductDetails(JSON.parse(localStorage.getItem("StorageProductID")))
        document.addEventListener("click", (e) => {
            if (!e.target.className.includes("toClose")) {
                this.setState({ show_dollar: false, show_cart: false, show_name: false })
            }
        })
        if (localStorage.getItem("userScandiwebCommerce")) {
            this.userLogin = JSON.parse(localStorage.getItem("userScandiwebCommerce")).first_name
        }
        this.setState({ userName: this.userLogin })
    }

    componentDidUpdate(prevProps) {
        if ((this.state.cartList !== prevProps.cartList) || (this.state.cartList?.quantity !== prevProps.cartList?.quantity)) {
            localStorage.setItem("storageCartList", JSON.stringify(this.state.cartList));
        }
        if (this.state.moneyType !== prevProps.moneyType) {
            localStorage.setItem("StorageCurruncyTypesData", JSON.stringify(this.state.moneyType));
        }
    }


    // *********************************Fetch GraphQL*********************************
    fetchCurrencies_filterCategories_ProductsTypes = async () => {
        const { currencies } = await request(this.graphQL_API, this.currencieCategories)
        this.setState({ currenciesData: currencies })

        const { categories } = await request(this.graphQL_API, this.filterCategories)
        this.setState({ filterCategoriesData: categories })

        const { categories: categoriesProducts } = await request(this.graphQL_API, this.product_types)
        this.setState({
            ProductsTypesDataAll: categoriesProducts[0].products,
            ProductsTypesDataClothes: categoriesProducts[1].products,
            ProductsTypesDataTech: categoriesProducts[2].products
        })
    }


    // *********************************Navbar Functions*********************************
    handleActiveState = (e) => {
        this.setState({ active_state: e.target.textContent })
    }
    handleDollarShow = () => {
        this.setState({ show_dollar: !this.state.show_dollar, show_cart: false, show_name: false })
    }
    handleCartShow = () => {
        this.setState({ show_cart: !this.state.show_cart, show_dollar: false, show_name: false })
    }
    handleNameShow = () => {
        this.setState({ show_name: !this.state.show_name, show_dollar: false, show_cart: false })
    }
    handleCurrencyHover = (e) => {
        this.CurruncyTypesData = {
            icon: e.target.textContent.split(" ")[0],
            type: e.target.textContent.split(" ")[1],
        }
        this.setState({ moneyType: { ...this.CurruncyTypesData } }, () => { this.handlePrice() })
    }


    // *********************************ProductDetails Page*********************************
    fetchProductDetails = async (item_id) => {
        const { product } = await request(this.graphQL_API, this.ProductItem, { id: item_id })
        this.TempItemDetails = { ...product }
        this.setState({ productDetailsData: { ...product } })
        localStorage.setItem("StorageProductID", JSON.stringify(product.id));
    }
    handlePorductAttributesDetails = (attr, itemOfAttr) => {
        let newObject = {}
        newObject[attr.name] = itemOfAttr.value
        this.secondObject = { ...this.secondObject, ...newObject }
        this.setState({ secondAttributes: this.secondObject })

    }
    handleCartAttributesDetails = (attr, itemOfAttr, element) => {
        let attrName = attr.name
        let comingElement = this.questionsData.find(el => el.id === element.id)
        let indexOfElement = this.questionsData.indexOf(comingElement)
        this.questionsData[indexOfElement].selectedAttributes[attrName] = itemOfAttr.value
        this.setState({ cartList: [...this.questionsData] })
    }
    addToCart = (element) => {
        if (Object.keys(this.state.secondAttributes).length !== element.attributes.length) {
            toast.error("select all the options of product")
        } else {
            if (this.questionsData?.find(item => item.id === element.id) === undefined) {
                const newElement = { ...element, quantity: 1, selectedAttributes: this.state.secondAttributes }
                this.questionsData.unshift(newElement)
                this.setState({ cartList: [...this.questionsData] }, () => { this.handlePrice() })
                this.setState({ secondAttributes: [] })
                this.secondObject = {}
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
            this.setState({ cartList: [...tempCartList] }, () => this.handlePrice())
        } else {
            if (foundElement.quantity === 1) {
                tempCartList = tempCartList.filter(el => el.id !== item.id)
                this.setState({ cartList: [...tempCartList] }, () => { this.handlePrice("empty") })
            } else {
                foundElement.quantity = foundElement.quantity - 1
                this.setState({ cartList: [...tempCartList] }, () => this.handlePrice())
            }
        }
        this.handlePrice()
    }
    handlePrice = (s = "default") => {

        let allPrices = [], singlePrice = null
        let price = 0, real_price = 0, taxs = 0, numberOfItems = 0, totalPrice = 0

        if (s === "default") {
            for (let item of this.questionsData) {
                singlePrice = item.prices.find(item => item.currency?.symbol === this.state.moneyType.icon)
                allPrices.push(singlePrice)
                price += (singlePrice.amount * item.quantity)
            }

            real_price = Number(price.toFixed(2))
            taxs = (real_price * (21 / 100)).toFixed(2)
            numberOfItems = [...this.questionsData].reduce((previous, current) => previous + current.quantity, 0)
            totalPrice = (real_price + Number(taxs)).toFixed(2)
            let symbol = JSON.parse(localStorage.getItem('StorageCurruncyTypesData'))?.icon
            this.setState({ price: real_price, taxs, numberOfItems, totalPrice, symbol })

        } else {
            this.setState({ price: real_price, taxs, numberOfItems, totalPrice })
            this.questionsData = []
        }

    }


    // *********************************Register*********************************
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

    // *********************************Login*********************************
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
                this.setState({ successLogin: true, isLoggedIn: true })
                localStorage.setItem("userScandiwebCommerce", JSON.stringify(data.user))
            } else {
                this.setState({ registered: data.message, isLoading: false, successLogin: false })
            }
        }
        this.setState({ isLoading: false })


    }


    // *********************************logout*********************************
    logout = () => {
        localStorage.removeItem("userScandiwebCommerce")
    }


    // *********************************Payment*********************************
    checkOut = (e) => {
        e.preventDefault()
        if (localStorage.getItem("userScandiwebCommerce")) {
            this.setState({ checkOutSuccess: true })

            this.handleDollarShow()
            this.handleCartShow()
            this.handleNameShow()

        } else {
            toast.error("You have to login first")
            toast.warn('you can use this to login directly    email:test2468@gmail.com   password:test2468', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            this.setState({ checkOutSuccess: false })
        }

    }
    handleChangePayment = (e) => {
        let tempValues = { ...this.state.paymentData }
        tempValues[e.target.name] = e.target.value
        this.setState({ paymentData: tempValues })
    }
    validatePayment = (paymentData) => {
        let schema = joi.object({
            email: joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "hotmail", "yahoo", "outlook"] } }).messages({
                'string.base': `Email should be a type of 'email'`,
                'string.empty': `Email cannot be an empty field`,
                'any.required': `Email is a required field`,
            }),
            cardNumber: joi.string().required().pattern(/^[0-9]{16}$/).messages({
                'number.base': `CardNumber should be a type of 'number'`,
                'any.required': `cardNumber is a required field`,
            }),
            MM: joi.string().required().pattern(/^[0-9]{2}$/).messages({
                'number.base': `MM should be a type of 'number'`,
                'any.required': `MM is a required field`,
            }),
            YY: joi.string().required().pattern(/^[0-9]{2}$/).messages({
                'number.base': `YY should be a type of 'number'`,
                'any.required': `YY is a required field`,
            }),
            CVC: joi.string().required().pattern(/^[0-9]{3}$/).messages({
                'number.base': `CVC should be a type of 'number'`,
                'any.required': `CVC is a required field`,
            }),
            Name: joi.string().required().pattern(/[A-Za-z0-9]{5}/).messages({
                'string.base': `Name should be a type of 'string'`,
                'any.required': `Name is a required field`,
            }),
            Countery: joi.string().required().messages({
                'string.base': `Countery should be a type of 'string'`,
                'any.required': `Countery is a required field`,
            }),
        })
        return schema.validate(paymentData, { abortEarly: false })
    }
    handleSubmitPayment = (e) => {
        this.setState({ successPayment: false })
        e.preventDefault()
        this.setState({ isLoading: true })
        let validateResult = this.validatePayment(this.state.paymentData)
        let listErrors = {};
        this.setState({ joiErrorsPayment: listErrors })
        if (validateResult.error) {
            for (let item of validateResult.error.details) {
                listErrors[item.path[0]] = item.message
            }

        } else {
            toast.success('Payment successfully', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });

            setTimeout(() => {
                this.setState({ successPayment: true })
                this.questionsData = []
                localStorage.removeItem("storageCartList")
                this.setState({ cartList: [] })
                this.handlePrice("empty")
            }, 4000)
        }

        for (let singleError in listErrors) {
            if (listErrors[singleError].includes("["))
                listErrors[singleError] = "Enter a valid input"
        }

        this.setState({ isLoading: false })

    }

    render() {

        // States
        const {
            // Navbar
            active_state, show_dollar, show_cart, show_name, currenciesData, userName,

            // Data
            filterCategoriesData, ProductsTypesDataAll, ProductsTypesDataClothes, ProductsTypesDataTech, priceDefaultType,
            priceDefaultIcon, moneyType, productDetailsData, secondAttributes, symbol,

            // Product
            datasetSize, datasetColor, cartList, isAdded, price, taxs, numberOfItems, totalPrice, attributeOfStates,

            // validation
            joiErrors, registered, isLoading, formData, formDataLogin, isLoggedIn, successSignUp, successLogin, successLogout,

            // payment
            joiErrorsPayment, successPayment, checkOutSuccess,

        } = this.state

        // Functions
        const {
            // Navbar
            handleActiveState, handleDollarShow, handleNameShow, handleCurrencyHover, handleCartShow,

            // Product
            handleAttributesOfDetails, handleshadowColor, addToCart, handleQuantity, fetchProductDetails,

            // validation
            handleInput, HandleSubmit, handleInputLogin, handleSubmitLogin, logout, handlePorductAttributesDetails,
            handleCartAttributesDetails,

            // payment
            handleChangePayment, handleSubmitPayment, checkOut

        } = this

        // Values
        const values = {
            // Navbar
            active_state, show_dollar, show_cart, show_name, currenciesData, userName, handleActiveState, handleDollarShow,
            handleCartShow, handleNameShow, symbol, handleshadowColor,

            // Product
            filterCategoriesData, ProductsTypesDataAll, ProductsTypesDataClothes, ProductsTypesDataTech, priceDefaultType,
            handleCurrencyHover, priceDefaultIcon, moneyType, handleAttributesOfDetails, datasetSize, datasetColor, cartList,
            isAdded, addToCart, handleQuantity, price, taxs, numberOfItems, totalPrice,
            fetchProductDetails, productDetailsData, attributeOfStates, handlePorductAttributesDetails, handleCartAttributesDetails,
            secondAttributes,

            // validation
            joiErrors, registered, isLoading, formData, formDataLogin, isLoggedIn, handleInput, HandleSubmit, handleInputLogin,
            handleSubmitLogin, successSignUp, successLogin, successLogout, logout, checkOut, checkOutSuccess,

            // payment
            handleChangePayment, handleSubmitPayment, joiErrorsPayment, successPayment,

        }

        return (
            <StoreContext.Provider value={values}>
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}
export default StoreContextProvider;
