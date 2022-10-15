
import React, { Component, createContext } from 'react'
import { toast } from 'react-toastify';
import { data } from "../Data"
import joi from "joi"
import axios from "axios"
import { request, gql } from 'graphql-request'

export const StoreContext = createContext("default")


class StoreContextProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active_state: "all",
            show_dollar: false,
            show_cart: false,
            show_name: false,
            currenciesData: [],
            filterCategoriesData: [],
            ProductsTypesDataAll: [],
            ProductsTypesDataClothes: [],
            ProductsTypesDataTech: [],
            priceDefaultType: "USD",
            priceDefaultIcon: "$",
            moneyType: { type: "USD", icon: "$" },
            // product states
            datasetColor: "",
            datasetSize: "",
            cartList: [],
            isAdded: false,
            price: 0,
            taxs: 0,
            quantity: 0,
            totalPrice: 0,
            productDetailsData: {},
            attributeOfStates: [],
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

        this.graphQL_API = "http://localhost:4000/graphql"


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


    componentDidMount() {
        this.setState({ cartList: [...this.questionsData] })
        this.setState({ moneyType: { ...this.CurruncyTypesData } })
        this.setState({ attributeOfStates: { ...this.arrayOfAttributes } })
        this.handlePrice()
        this.fetchCurrencies()
        this.fetchfilterCategories()
        this.fetchProductsTypes()
        this.fetchProductDetails(JSON.parse(localStorage.getItem("StorageProductID")))
    }

    componentDidUpdate(prevProps) {
        if ((this.state.cartList !== prevProps.cartList) || (this.state.cartList?.quantity !== prevProps.cartList?.quantity)) {
            localStorage.setItem("storageCartList", JSON.stringify(this.state.cartList));
        }
        if (this.state.moneyType !== prevProps.moneyType) {
            localStorage.setItem("StorageCurruncyTypesData", JSON.stringify(this.state.moneyType));
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
    handleCurrencyHover = (e) => {
        this.CurruncyTypesData = {
            type: e.target.textContent.split(" ")[1],
            icon: e.target.textContent.split(" ")[0],
        }
        this.setState({ moneyType: { ...this.CurruncyTypesData } })
    }
    fetchCurrencies = async () => {
        const { currencies } = await request(this.graphQL_API, this.currencieCategories)
        this.setState({ currenciesData: currencies })
    }
    fetchfilterCategories = async () => {
        const { categories } = await request(this.graphQL_API, this.filterCategories)
        this.setState({ filterCategoriesData: categories })
    }
    fetchProductsTypes = async () => {
        const { categories } = await request(this.graphQL_API, this.product_types)
        this.setState({
            ProductsTypesDataAll: categories[0].products,
            ProductsTypesDataClothes: categories[1].products,
            ProductsTypesDataTech: categories[2].products
        })
    }
    // ************ProductDetails Functions*********************

    addToCart = (element, e) => {

        let newObject = {}
        let newArray = []
        if (localStorage.getItem("choosenColor")) {
            newObject.color = JSON.parse(localStorage.getItem("choosenColor"))
            newArray.push(JSON.parse(localStorage.getItem("choosenColor")))
        }
        if (localStorage.getItem("choosenSize")) {
            newObject.size = JSON.parse(localStorage.getItem("choosenSize"))
            newArray.push(JSON.parse(localStorage.getItem("choosenSize")))
        }
        if (localStorage.getItem("choosenCapacity")) {
            newObject.capacity = JSON.parse(localStorage.getItem("choosenCapacity"))
            newArray.push(JSON.parse(localStorage.getItem("choosenCapacity")))
        }

        if (Object.keys(newObject).length !== element.attributes.length) {
            toast.error("select all the options of product")
        } else {
            if (this.questionsData?.find(item => item.id === element.id) === undefined) {
                const newElement = { ...element, quantity: 1, ...newObject, newArray }
                this.questionsData.push(newElement)
                this.setState({ cartList: [...this.questionsData] }, () => { this.handlePrice() })
                toast.success("added to cart successfully")
            } else {
                toast.info("already added to cart")
            }
        }

    }
    handleQuantity = (item, operation) => {
        // let tempCartList = this.state.cartList;
        let tempCartList = this.questionsData;
        console.log(tempCartList);
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



    handleSizeOfDetails = (e, element, item) => {
        localStorage.setItem("choosenID", JSON.stringify(element.id))
        localStorage.setItem("choosenSize", JSON.stringify(e.target.dataset.size))
        let value = localStorage.getItem("choosenSize")
        // console.log(value.slice(1, value.length - 1))
        // console.log(item.value)
        this.arrayOfAttributes.push(localStorage.getItem("choosenSize"))

        // this.setState((prev) => ({
        //     ...prev, attributeOfStates: [...this.arrayOfAttributes]
        // }))
    }
    handleColorOfDetails = (e, item) => {
        localStorage.setItem("choosenID", JSON.stringify(item.id))
        localStorage.setItem("choosenColor", JSON.stringify(e.target.dataset.color))
        this.arrayOfAttributes.push(localStorage.getItem("choosenColor"))
    }
    handleCapacityOfDetails = (e, item) => {
        localStorage.setItem("choosenID", JSON.stringify(item.id))
        localStorage.setItem("choosenCapacity", JSON.stringify(e.target.dataset.capacity))
        this.arrayOfAttributes.push(localStorage.getItem("choosenCapacity"))
    }





    fetchProductDetails = async (item_id) => {
        const { product } = await request(this.graphQL_API, this.ProductItem, { id: item_id })
        this.TempItemDetails = { ...product }
        // this.setState({ productDetailsData: { ...this.TempItemDetails } })
        this.setState({ productDetailsData: { ...product } })
        localStorage.setItem("StorageProductID", JSON.stringify(product.id));
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
            active_state, show_dollar, show_cart, show_name, currenciesData, filterCategoriesData, ProductsTypesDataAll,
            ProductsTypesDataClothes, ProductsTypesDataTech, priceDefaultType, priceDefaultIcon, moneyType, productDetailsData,

            datasetSize, datasetColor, cartList, isAdded, price, taxs, numberOfItems, totalPrice, attributeOfStates,

            joiErrors, registered, isLoading, formData, formDataLogin, isLoggedIn, successSignUp, successLogin, successLogout, welcome
        } = this.state



        const {
            handleActiveState, handleDollarShow, handleNameShow, handleCurrencyHover,

            handleCartShow, handleAttributesOfDetails, handleshadowColor, addToCart, addItemQuantity, removeItemQuantity, handleQuantity,
            fetchProductDetails, handleSizeOfDetails, handleCapacityOfDetails, handleColorOfDetails, productDetailsData2,

            handleInput, HandleSubmit, handleInputLogin, handleSubmitLogin, logout, checkOut,
        } = this
        const values = {
            active_state,
            show_dollar,
            show_cart,
            show_name,
            currenciesData,
            filterCategoriesData,
            ProductsTypesDataAll,
            ProductsTypesDataClothes,
            ProductsTypesDataTech,
            priceDefaultType,
            handleCurrencyHover,
            priceDefaultIcon,
            moneyType,
            handleActiveState,
            handleDollarShow,
            handleCartShow,
            handleNameShow,


            handleAttributesOfDetails,
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
            fetchProductDetails,
            productDetailsData,
            productDetailsData2,
            handleSizeOfDetails,
            handleColorOfDetails,
            handleCapacityOfDetails,
            attributeOfStates,



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
