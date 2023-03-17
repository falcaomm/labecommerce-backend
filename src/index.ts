import express, { Request, Response } from 'express'
import cors from 'cors'
import { products, users, purchases } from './database'
import { Category, TUser, TProduct, TPurchase } from "./types"
import {
    getProductById, 
    getAllProducts,
    createProduct,
    getAllUsers,
    createUser,
    queryProductsByName,
    getAllPurchasesFromUserId
} from "./database"

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})

//getAllUsers
app.get('/users', (req: Request, res: Response) => {
    res.status(200).send(users)
})

//getAllProducts
app.get('/products', (req: Request, res: Response) => {
    res.status(200).send(products)
})

//searchProducts
app.get('/products/search', (req: Request, res: Response) => {
    const findForName = req.query.name as string

    const resust = findForName ?
        products.filter(item => item.name.toLowerCase().includes(findForName.toLowerCase()))
        : products;

    res.status(200).send(resust)
})

//createUser
app.post('/users', (req: Request, res: Response) => {

    const newUser: TUser= {
        id: req.body.id,
        email: req.body.email,
        password: req.body.password
    }
    users.push(newUser)

    res.status(201).send('Cadastro realizado com sucesso')
})

//createProduct
app.post('/products', (req: Request, res: Response) => {

    const newProduct: TProduct= {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    }
    products.push(newProduct)

    res.status(201).send('Produto cadastrado com sucesso')
})

//createPurchase
app.post('/purchase', (req: Request, res: Response) => {

    const newPurchase: TPurchase= {
        userId : req.body.userId,
        productId: req.body.productId,
        quantity: req.body.quantity,
        totalPrice: req.body.totalPrice
    }
    purchases.push(newPurchase)

    res.status(201).send('Compra realizada com sucesso')
})

//getProductsById
app.get('/products/:id', (req: Request, res: Response) => {
    const { id } = req.params
    
    const result = products.filter((item) => {
        return item.id === id
    })

    res.status(200).send(result)
})

//getPurchaseByUserId
app.get('/users/:id/purchases', (req: Request, res: Response) => {
    const { id } = req.params

    const result = purchases.filter((item) => {
        return item.userId === id
    })

    res.status(200).send(result)
})

//deleteUser
app.delete("/users/:id", (req: Request, res: Response) => {
    const { id } = req.params

    const findIndexUsers = users.findIndex((item) => {
        return item.id === id
    })

    findIndexUsers < 0 ?
        res.status(404).send("Item não encontrado")
        :
        (users.splice(findIndexUsers, 1)
        , res.status(200).send("User apagado com sucesso"))
})

app.delete("/products/:id", (req: Request, res: Response) => {
    const { id } = req.params

    const findIndexProducts = products.findIndex((item) => {
        return item.id === id
    })

    findIndexProducts < 0 ?
        res.status(404).send("Item não encontrado")
        :
        (products.splice(findIndexProducts, 1)
        , res.status(200).send("Produto apagado com sucesso"))
})

app.put("/users/:id", (req: Request, res: Response) => {
    const { id } = req.params

    const {email, password} = req.body

    const findUsers = users.find((item) => {
        return item.id === id
    })

    if (findUsers) {
        findUsers.id = findUsers.id
        findUsers.email = email || findUsers.email
        findUsers.password = password || findUsers.password
        res.status(200).send("Cadastro atualizado com sucesso")
    } else {
        res.status(404).send("Item não encontrado")
    }
})

app.put("/products/:id", (req: Request, res: Response) => {
    const { id } = req.params

    const {name , price, category  } = req.body

    const findProducts= products.find((item) => {
        return item.id === id
    })

    if (findProducts) {
        findProducts.id = findProducts.id
        findProducts.name = name || findProducts.name
        findProducts.price = price || findProducts.price
        findProducts.category = category || findProducts.category

        res.status(200).send("Produto atualizado com sucesso")
    } else {
        res.status(404).send("Item não encontrado")
    }
})

// createUser("u003", "beltrano@email.com", "beltrano99")

// getAllUsers()

// createProduct("p004", "Monitor HD", 800, Category.ELECTRONICS)

// getAllProducts()

// console.log(getProductById('p004'))

// console.log(queryProductsByName("PRO"))

// console.log(getAllPurchasesFromUserId("02"));