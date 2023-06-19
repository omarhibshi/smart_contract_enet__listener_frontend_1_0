import { ethers } from "ethers"
import { useEffect, useState } from "react"
import Button from "./components/Button"
import Alert from "./components/Alert"
import ShowProductsList from "./components/ShowProductsList"
import Form from "./components/Form"

import AppStyles from "./App.css?inline"

import {
    abi,
    CONTRACT_ADDRESS,
    DEFAULT_FORM_VALUES,
    DEFAULT_PRODUCT_IMAGE,
    EVENTS,
} from "./constants"

//get wrapped provider from MetaMask.
//this allows use to query the blockchain
const getProvider = () => {
    if (!window.ethereum) {
        throw new Error("Install MetaMask browser extension")
    }

    //provider allows us to only read from or query the blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    return provider
}

//connect to MetaMask wallet
const connectWallet = async () => {
    //we also use the provider to issue commands to the MetaMask wallet
    const provider = getProvider()

    //requesting for permission to use MetaMask wallets/accounts
    //without this all our transactions will fail.
    const accounts = await provider.send("eth_requestAccounts", [])

    //we will use the first account in our MetaMask wallet
    return accounts[0]
}

//get contract instance
const getContract = () => {
    const provider = getProvider()

    //while provider allows us to only read from or query the blockchain
    //signers allows us to query and also write to the blockchain.
    const signer = provider.getSigner()

    //we need to use signers on our contract instance to be able to send create product transactions
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
    // console.log(`contract address  is : ${contract.address}`)
    return contract
}

// prepares to get products list
const getProductsHandler = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
    const products = await getProducts(contract)
    //console.log(products)
}

// get product list
const getProducts = async (contract) => {
    let products = []

    const numberOfproducts = await contract.numberOfProducts()
    for (let i = 0; i < numberOfproducts; i++) {
        const productCall = new Promise(async (resolve) => {
            const product = await contract.products(i)

            const {
                sku,
                name,
                image,
                description,
                price,
                quantityAvailable,
                quantitySold,
            } = product

            resolve({
                index: i,
                sku,
                name,
                image,
                description,
                price,
                quantityAvailable,
                quantitySold,
            })
        })

        products.push(productCall)
    }

    return await Promise.all(products)
}

//add product
function CreateProduct() {
    //tracking uploading a new product
    const [loading, setLoading] = useState(false)

    //binds to the form field data
    const [formData, setFormData] = useState(DEFAULT_FORM_VALUES)

    //handle changes to form inputs
    const handleFormFieldChange = (event) => {
        setFormData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    //handles form submition
    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setLoading(true)

            const { sku, name, image, description, price, quantityAvailable } =
                formData

            if (!name || !price || !sku || !quantityAvailable) {
                alert("Required data must be provided")
                return
            }

            //format price into Ethers
            const priceInEth = ethers.utils.parseEther(price.toString())

            //convert quantityAvailable and sku into int
            //NB: they can also be converted to Bignumber
            const iQuantity = parseInt(quantityAvailable)
            const iSku = parseInt(sku)

            const contract = getContract()

            const tnx = await contract.createProduct(
                iSku,
                name,
                image,
                description,
                priceInEth,
                iQuantity
            )

            await tnx.wait()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div
                className="modal fade"
                id="productModal"
                tabIndex="-1"
                aria-labelledby="productModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="productModalLabel">
                                New Product
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                disabled={loading}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="sku"
                                        className="col-form-label"
                                    >
                                        SKU *
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="sku"
                                        name="sku"
                                        value={formData["sku"]}
                                        min={1}
                                        required={true}
                                        onChange={handleFormFieldChange}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="name"
                                        className="col-form-label"
                                    >
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData["name"]}
                                        required={true}
                                        onChange={handleFormFieldChange}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="image"
                                        className="col-form-label"
                                    >
                                        Image Url
                                    </label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        id="image"
                                        value={formData["image"]}
                                        onChange={handleFormFieldChange}
                                        disabled={loading}
                                        name="image"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="price"
                                        className="col-form-label"
                                    >
                                        Price *
                                    </label>
                                    <input
                                        name="price"
                                        type="number"
                                        value={formData["price"]}
                                        min={0.001}
                                        step={0.001}
                                        required={true}
                                        className="form-control"
                                        id="price"
                                        onChange={handleFormFieldChange}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="quantityAvailable"
                                        className="col-form-label"
                                    >
                                        Quantity Available *
                                    </label>
                                    <input
                                        name="quantityAvailable"
                                        type="number"
                                        value={formData["quantityAvailable"]}
                                        min={1}
                                        required={true}
                                        className="form-control"
                                        id="quantityAvailable"
                                        onChange={handleFormFieldChange}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="description"
                                        className="col-form-label"
                                    >
                                        Description:
                                    </label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        id="description"
                                        value={formData["description"]}
                                        onChange={handleFormFieldChange}
                                        disabled={loading}
                                    ></textarea>
                                </div>
                                <div className="mb-3 d-flex justify-content-between">
                                    <button
                                        type="reset"
                                        className="btn btn-outline-danger"
                                        disabled={loading}
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={loading}
                                    >
                                        Create &nbsp;
                                        {loading && (
                                            <div
                                                className="spinner-border text-light"
                                                role="status"
                                            >
                                                <span className="visually-hidden">
                                                    Loading...
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <button
                type="button"
                data-bs-toggle="modal"
                className="btn btn-outline-success"
                data-bs-target="#productModal"
                disabled={loading}
            >
                Create Product
            </button>
        </>
    )
}

//navigation bar
function TopNavbar({ defaultAccount }) {
    return (
        <nav className="navbar bg-light">
            <div className="container">
                <b className="navbar-brand">Products DApp</b>
                {defaultAccount && <CreateProduct />}
            </div>
        </nav>
    )
}

//generate product card
function Card({ productInfo, ...props }) {
    const [loading, setLoading] = useState()

    const {
        index,
        sku,
        name,
        image,
        description,
        price,
        quantityAvailable,
        quantitySold,
    } = productInfo

    const buyProduct = async () => {
        const contract = getContract()
        try {
            setLoading(true)
            const txn = await contract.buyProduct(index, { value: price })
            await txn.wait()
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="card col-md-4 col-lg-3"
            style={{ width: "18rem", margin: "5px" }}
        >
            <img
                src={image ? image : DEFAULT_PRODUCT_IMAGE}
                className="card-img-top"
                alt="..."
            ></img>

            <div className="card-body">
                <span>SKU: #{sku?.toString()}</span>
                <h5 className="card-title">{name}</h5>
                <p className="card-text">{description}</p>
                <p className="card-text">
                    Price: {utils.formatEther(price)} Eth
                </p>
                <p className="card-text">
                    Available: {quantityAvailable?.toString()}
                </p>
                <p className="card-text">
                    Sold: {quantitySold?.toString() || 0}
                </p>
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={buyProduct}
                    disabled={loading}
                >
                    Buy 1 &nbsp;
                    {loading && (
                        <div
                            className="spinner-border text-light"
                            role="status"
                        >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    )
}

function App() {
    //tracks products
    const [products, setProducts] = useState([])
    //tracks loading activity
    const [loading, setLoading] = useState(false)
    //tracks the default account to be used
    const [defaultAccount, setDefaultAccount] = useState(null)
    //track getProduct button state
    const [getProductBuutondisabled, setGetProductBuutondisabled] =
        useState(false)
    const [connectWalletBuutondisabled, setConnectWalletBuutondisabled] =
        useState(false)

    const getProdcutsOnClick = () => {
        setGetProductBuutondisabled(true)
        getProductsHandler()
    }
    const connectWalletOnClick = () => {
        setConnectWalletBuutondisabled(true)
        connectWallet().then((account) => setDefaultAccount(account))
    }

    //connect to MetaMask on first render
    useEffect(() => {
        if (defaultAccount === null) {
            setConnectWalletBuutondisabled(false)
        } else {
            setConnectWalletBuutondisabled(true)
        }
    }, [])

    //connect to MetaMask on first render
    /* useEffect(() => {
        connectWallet()
            .then((account) => setDefaultAccount(account))
            .catch(console.log)
    }, []) */

    //fetch products once when the component is rendered
    useEffect(() => {
        try {
            setLoading(true)
            const contract = getContract()
            getProducts(contract).then((products) => setProducts(products))
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        //get smartcontract connection instance
        const contract = getContract()

        //subscribing to product created event
        //note that JS spread (...) operator is used to collect all arguments
        //that are passed to the callback function as eventData
        contract.on(EVENTS.PRODUCT_CREATED, (...eventData) => {
            const [
                index,
                sku,
                name,
                image,
                description,
                quantityAvailable,
                price,
            ] = eventData
            console.log(eventData)
            setProducts((prevProducts) => {
                const newProduct = {
                    index: index.toNumber(),
                    sku,
                    name,
                    image,
                    description,
                    price,
                    quantityAvailable,
                }

                //append newProduct
                console.log(newProduct)
                console.log(...prevProducts)
                console.log([...prevProducts, newProduct])
                return [...prevProducts, newProduct]
            })
        })

        //subscribing to product sold event
        //note again that JS spread (...) operator is used to collect all arguments
        //that are passed to the callback function as eventData
        contract.on(EVENTS.PRODUCT_SOLD, (...eventData) => {
            //get product info from event data
            const [index, , , totalQuantitySold, newQuantityAvailable] =
                eventData

            //used as key to identify product in `products`
            const idx = index?.toNumber()

            setProducts((prevProducts) => {
                //find product by index
                const oldProductDetails = prevProducts[idx]

                if (!oldProductDetails) {
                    return {
                        ...prevProducts,
                    }
                }

                //generate updated product info to replace old product info
                const updatedProductDetails = {
                    ...oldProductDetails,
                    quantitySold: totalQuantitySold,
                    quantityAvailable: newQuantityAvailable,
                }

                //insert to replace old product details
                const products = [
                    ...prevProducts.slice(0, idx),
                    updatedProductDetails,
                    ...prevProducts.slice(idx + 1),
                ]

                return products
            })
        })

        return () => {
            //remove all contract listeners when component is unmounted
            //it is important to remove dangling listeners to prevent multiple
            //listener function calls on event which may lead to multiiple rendering of a product.
            contract.removeAllListeners()
        }
    }, [])

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            <TopNavbar defaultAccount={defaultAccount} />
            <div className="container">
                <Alert>Welcome to the Smart Contract Event Listener</Alert>
                <span>Contract address: </span>
                {CONTRACT_ADDRESS}
                <br />
                {"Product price : " + DEFAULT_FORM_VALUES.price}
                <div className="container">
                    <Button
                        disabled={connectWalletBuutondisabled}
                        onClick={connectWalletOnClick}
                    >
                        Connect Walllet
                    </Button>
                    <br />
                    <br />
                </div>
                <div className="container">
                    {
                        <Button
                            disabled={getProductBuutondisabled}
                            onClick={getProdcutsOnClick}
                        >
                            Get Product
                        </Button>
                    }
                    <br />
                    <br />
                    {products.length !== 0 && getProductBuutondisabled && (
                        <ShowProductsList products={products} />
                    )}
                </div>
                <div className="container">
                    <Form />
                </div>
            </div>
        </>
    )
}

export default App
