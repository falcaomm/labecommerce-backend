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

app.get('/users', (req: Request, res: Response) => {
    res.status(200).send(users)
})

app.get('/products', (req: Request, res: Response) => {
    res.status(200).send(products)
})

app.get('/products/search', (req: Request, res: Response) => {
    const findForName = req.query.name as string

    const resust = findForName ?
        products.filter(item => item.name.toLowerCase().includes(findForName.toLowerCase()))
        : products;

    res.status(200).send(resust)
})

app.post('/users', (req: Request, res: Response) => {

    const newUser: TUser= {
        id: req.body.id,
        email: req.body.email,
        password: req.body.password
    }
    users.push(newUser)

    res.status(201).send('Cadastro realizado com sucesso')
})

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

console.log(purchases);


// createUser("u003", "beltrano@email.com", "beltrano99")

// getAllUsers()

// createProduct("p004", "Monitor HD", 800, Category.ELECTRONICS)

// getAllProducts()

// console.log(getProductById('p004'))

// console.log(queryProductsByName("PRO"))

// console.log(getAllPurchasesFromUserId("02"));