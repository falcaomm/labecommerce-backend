import express, { Request, Response } from 'express'
import cors from 'cors'
import { products, users, purchases } from './database'
import { Category, TUser, TProduct, TPurchase } from "./types"

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

//getAllUsers
app.get('/users', (req: Request, res: Response) => {
    try {
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send("Erro interno do servidor")
    }
})

//getAllProducts
app.get('/products', (req: Request, res: Response) => {
    try {
        res.status(200).send(products)
    } catch (error) {
        res.status(500).send("Erro interno do servidor")
    }
})

//searchProductsByName
app.get('/products/search', (req: Request, res: Response) => {
    try {
        const query = req.query.name as string
    
        if (query.length <= 0) {
            res.status(404)
            throw new Error("Busca não encontrada. Query params deve possuir pelo menos um caractere.");
        }

        const result = products.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

        if (result.length === 0) {
            res.status(404)
            throw new Error("Produto não encontrado.");
        }
    
        res.status(200).send(result)

    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//createUser
app.post('/users', (req: Request, res: Response) => {
    try {
        const newUser: TUser= {
            id: req.body.id,
            email: req.body.email,
            password: req.body.password
        }

        if (newUser.id === undefined || newUser.email === undefined|| newUser.password === undefined) {
            res.status(400)
			throw new Error("Os campos 'id', 'email' e 'password' são obrigatórios para o cadastro do usuário.")
        }
        if (typeof newUser.id !== "string") {
            res.status(400)
			throw new Error("'id' deve ser uma string.")
        }
        if (typeof newUser.email !== "string") {
            res.status(400)
			throw new Error("'Email' deve ser uma string.")
        }
        if (typeof newUser.password !== "string") {
            res.status(400)
			throw new Error("'Password' deve ser uma string.")
        }

        const findForEqualIds = users.find((item) => item.id === newUser.id)     

        if (findForEqualIds) {
            res.status(422)
            throw new Error("Número de 'Id' já cadastrado.");
        }

        const findForEqualEmails = users.find((item) => item.email === newUser.email)     

        if (findForEqualEmails) {
            res.status(422)
            throw new Error("Email já cadastrado.");
        }
        
        users.push(newUser)
    
        res.status(201).send('Cadastro realizado com sucesso')

    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
            }
    }
})

//createProduct
app.post('/products', (req: Request, res: Response) => {
    
    try {
        const newProduct: TProduct= {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        }
        
        if (newProduct.id === undefined || newProduct.name === undefined || newProduct.price === undefined || newProduct.category === undefined ) {
            res.status(400)
			throw new Error("Os campos 'id', 'name', 'price' e 'category' são obrigatórios para o cadastro do produto.")
        }

        const findForEqualIds = products.find((item) => item.id === newProduct.id)    
        
        if (findForEqualIds) {
            res.status(422)
            throw new Error("Número de 'Id' já cadastrado.");
        }

        if (typeof newProduct.id !== "string") {
            res.status(400)
			throw new Error("'id' deve ser uma string.")
        }
        if (typeof newProduct.name !== "string") {
            res.status(400)
			throw new Error("'name' deve ser uma string.")
        }
        if (typeof newProduct.price !== "number") {
            res.status(400)
			throw new Error("'price' deve ser um number.")
        }

        const arrayCategory = (Object.values(Category));
        
        if (!arrayCategory.includes(newProduct.category) ) {
            res.status(400)
            throw new Error(`'Category' deve ser uma categoria válida entre: ${arrayCategory}`);
        }

        products.push(newProduct)
    
        res.status(201).send('Produto cadastrado com sucesso')

    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//createPurchase
app.post('/purchase', (req: Request, res: Response) => {

    try {
        const newPurchase: TPurchase= {
            userId : req.body.userId,
            productId: req.body.productId,
            quantity: req.body.quantity,
            totalPrice: req.body.totalPrice
        }
        
        if (newPurchase.userId === undefined || newPurchase.productId === undefined || newPurchase.quantity === undefined || newPurchase.totalPrice === undefined ) {
            res.status(400)
			throw new Error("Os campos 'userId', 'productId', 'quantity' e 'totalPrice' são obrigatórios para o cadastro da compra.")
        }

        if (typeof newPurchase.userId !== "string") {
            res.status(400)
			throw new Error("'userId' deve ser uma string.")
        }
        if (typeof newPurchase.productId !== "string") {
            res.status(400)
			throw new Error("'productId' deve ser uma string.")
        }
        if (typeof newPurchase.quantity !== "number") {
            res.status(400)
			throw new Error("'quantity' deve ser um number.")
        }
        if (typeof newPurchase.totalPrice !== "number") {
            res.status(400)
			throw new Error("'totalPrice' deve ser um number.")
        }
        
        const findForEqualUserIds = users.find((item) => item.id === newPurchase.userId)         
        
        if (findForEqualUserIds === undefined) {
            res.status(404)
            throw new Error("'userId não encontrado entre os usuários cadastrados.");

        }

        const findForEqualProductsIds = products.find((item) => item.id === newPurchase.productId)  

        if (findForEqualProductsIds === undefined) {
            res.status(404)
            throw new Error("'productId' não encontrado entre os produtos cadastrados.");
        }
        
        const correctTotalPrice = findForEqualProductsIds.price * newPurchase.quantity
        
        if (newPurchase.totalPrice !== correctTotalPrice) {
            res.status(422)
            throw new Error(`O cálculo do 'totalPrice', considerando a 'quantity' descrita e o produto referido, está incorreto. O valor correto é: ${correctTotalPrice}.`);
        }        

        purchases.push(newPurchase)
    
        res.status(201).send('Compra realizada com sucesso')

    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

//getProductsById
app.get('/products/:id', (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = products.find((item) => item.id === id)     
        
        if (!result) {
            res.status(404)
            throw new Error("Produto não encontrado. Verifique o 'id'.");
        }
        
        res.status(200).send(result)
        
    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//getPurchaseByUserId
app.get('/users/:id/purchases', (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const checkId = users.find((item) => item.id === id)
        
        if (!checkId) {
            res.status(404)
            throw new Error("Compras não encontradas, id não cadastrado.");
        }

        const result = purchases.filter((item) => item.userId === id)     
        
        if (result.length <= 0) {
            res.status(404)
            throw new Error("Usuário sem compras cadastradas.");
        }
        
        res.status(200).send(result)
        
    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//deleteUserById
app.delete("/users/:id", (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const findIndexUsers = users.findIndex((item) => item.id === id)

        if (findIndexUsers < 0) {
            res.status(404)
            throw new Error("Usuário não encontrado. Verifique o 'id'.")
        }
            
        users.splice(findIndexUsers, 1)

        res.status(200).send("Usuário apagado com sucesso.")
    
    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//deleteProductById
app.delete("/products/:id", (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const findIndexProducts = products.findIndex((item) => item.id === id)

        if (findIndexProducts < 0) {
            res.status(404)
            throw new Error("Produto não encontrado. Verifique o 'id'.")
        }
            
        products.splice(findIndexProducts, 1)

        res.status(200).send("Produto apagado com sucesso.")
    
    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//editUserById
app.put("/users/:id", (req: Request, res: Response) => {
    try {
        const { id } = req.params
    
        const { email, password } = req.body

        const checkId = req.body.id

        if (checkId) {
            res.status(400)
            throw new Error("O campo'id' não pode ser editado, verifique o body.")
        }
    
        const userToEdit = users.find((item) => item.id === id)

        if (!userToEdit) {
            res.status(404)
            throw new Error("Usuário não encontrado. Verifique o 'id'.")
        }       
        
        if (email !== undefined) {
            if (typeof email !== "string") {
                res.status(400)
                throw new Error("'Email' deve ser uma string.")
            }
        }
        if (password !== undefined) {
            if (typeof password !== "string") {
                res.status(400)
                throw new Error("'Password' deve ser uma string.")
            }
        }

        userToEdit.id = userToEdit.id
        userToEdit.email = email || userToEdit.email
        userToEdit.password = password || userToEdit.password
        res.status(200).send("Cadastro atualizado com sucesso.")

    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

//editProductById
app.put("/products/:id", (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const {name , price, category} = req.body

        const checkId = req.body.id

        if (checkId) {
            res.status(400)
            throw new Error("O campo'id' não pode ser editado, verifique o body.")
        }

        const productToEdit= products.find((item) => item.id === id)

        if (!productToEdit) {
            res.status(404)
            throw new Error("Produto não encontrado. Verifique o 'id'.")
        }     
        if (name !== undefined) {
            if (typeof name !== "string") {
                res.status(400)
                throw new Error("'Name' deve ser uma string.")
            }
        }
        if (price !== undefined) {
            if (typeof price !== "number") {
                res.status(400)
                throw new Error("'Price' deve ser um number.")
            }
        }
        const arrayCategory = (Object.values(Category));
        
        if (category !== undefined) {
            if (!arrayCategory.includes(category)) {
                res.status(400)
                throw new Error(`'Category' deve ser uma categoria válida entre: ${arrayCategory}`);
            }
        }

        productToEdit.id = productToEdit.id
        productToEdit.name = name || productToEdit.name
        productToEdit.price = price || productToEdit.price
        productToEdit.category = category || productToEdit.category

        res.status(200).send("Produto atualizado com sucesso.")

    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})