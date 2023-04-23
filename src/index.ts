import express, { Request, Response } from 'express'
import cors from 'cors'
import { Category, TUser, TProduct, TPurchase } from "./types"
import { db } from './database/knex'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

//getAllUsers
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`
            SELECT * FROM users;
        `)
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send("Erro interno do servidor")
    }
})

//getAllProducts
app.get('/products', async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`
            SELECT * FROM products;
        `)
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send("Erro interno do servidor")
    }
})

//getAllPurchases
app.get('/purchases', async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`
            SELECT * FROM purchases;
        `)
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send("Erro interno do servidor")
    }
})

//searchProductsByName
app.get('/products/search', async (req: Request, res: Response) => {
    try {
        const query = req.query.name as string
    
        if (query.length <= 0) {
            res.status(404)
            throw new Error("Busca não encontrada. Query params deve possuir pelo menos um caractere.");
        }

        const allProducts = await db.raw(`
            SELECT * FROM products;
        `)

        const result = allProducts.filter((item: { name: string }) => item.name.toLowerCase().includes(query.toLowerCase()));

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
app.post('/users', async (req: Request, res: Response) => {
    try {
        const newUser: TUser = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            createdAt: Date()
        }

        if (newUser.id === undefined || newUser.email === undefined|| newUser.name === undefined || newUser.password === undefined) {
            res.status(400)
			throw new Error("Os campos 'id', 'name, 'email' e 'password' são obrigatórios para o cadastro do usuário.")
        }
        if (typeof newUser.id !== "string") {
            res.status(400)
			throw new Error("'id' deve ser uma string.")
        }
        if (typeof newUser.name !== "string") {
            res.status(400)
			throw new Error("'Name' deve ser uma string.")
        }
        if (typeof newUser.email !== "string") {
            res.status(400)
			throw new Error("'Email' deve ser uma string.")
        }
        if (typeof newUser.password !== "string") {
            res.status(400)
			throw new Error("'Password' deve ser uma string.")
        }

        const allUsers = await db.raw(`
            SELECT * FROM users;
        `)

        const findForEqualIds = allUsers.find((item: { id: string }) => item.id === newUser.id)     

        if (findForEqualIds) {
            res.status(422)
            throw new Error("Número de 'Id' já cadastrado.");
        }

        const findForEqualEmails = allUsers.find((item: { email: string }) => item.email === newUser.email)     

        if (findForEqualEmails) {
            res.status(422)
            throw new Error("Email já cadastrado.");
        }
        
        await db.raw(`
            INSERT INTO users
            VALUES(
                "${newUser.id}",
                "${newUser.name}",
                "${newUser.email}",
                "${newUser.password}",
                "${newUser.createdAt}"
            );
        `)
    
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
app.post('/products', async (req: Request, res: Response) => {
    
    try {
        const newProduct: TProduct= {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            category: req.body.category
        }
        
        if (newProduct.id === undefined || newProduct.name === undefined || newProduct.price === undefined || newProduct.description === undefined || newProduct.imageUrl === undefined || newProduct.category === undefined ) {
            res.status(400)
			throw new Error("Os campos 'id', 'name', 'price', 'description', 'imageUrl' e 'category' são obrigatórios para o cadastro do produto.")
        }

        const allProducts = await db.raw(`
            SELECT * FROM products;
        `)

        const findForEqualIds = allProducts.find((item: { id: string }) => item.id === newProduct.id)    
        
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
        if (typeof newProduct.description !== "string") {
            res.status(400)
			throw new Error("'description' deve ser uma string.")
        }
        if (typeof newProduct.imageUrl !== "string") {
            res.status(400)
			throw new Error("'imageUrl' deve ser uma string.")
        }

        const arrayCategory = (Object.values(Category));
        
        if (!arrayCategory.includes(newProduct.category) ) {
            res.status(400)
            throw new Error(`'Category' deve ser uma categoria válida entre: ${arrayCategory}`);
        }

        await db.raw(`
            INSERT INTO products
            VALUES(
                "${newProduct.id}",
                "${newProduct.name}",
                "${newProduct.price}",
                "${newProduct.description}",
                "${newProduct.imageUrl}",
                "${newProduct.category}"
            );
        `)
        
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
app.post('/purchase', async (req: Request, res: Response) => {

    try {
        const newPurchase: TPurchase= {
            id: req.body.id,
            buyerId: req.body.buyerId,
            totalPrice: req.body.totalPrice,
            createdAt: Date(),
            paid: req.body.paid
        }
        
        if (newPurchase.id === undefined || newPurchase.buyerId === undefined || newPurchase.totalPrice === undefined ) {
            res.status(400)
			throw new Error("Os campos 'id', 'buyerId', 'totalPrice' e 'paid' são obrigatórios para o cadastro da compra.")
        }

        if (typeof newPurchase.id !== "string") {
            res.status(400)
			throw new Error("'id' deve ser uma string.")
        }
        if (typeof newPurchase.buyerId !== "string") {
            res.status(400)
			throw new Error("'buyerId' deve ser uma string.")
        }
        if (typeof newPurchase.totalPrice !== "number") {
            res.status(400)
			throw new Error("'totalPrice' deve ser um number.")
        }
        if (typeof newPurchase.paid !== "number") {
            res.status(400)
            throw new Error("'paid' deve ser um number.")
        }
        if (newPurchase.paid !== 0 && newPurchase.paid !== 1){
            res.status(400)
            throw new Error("'paid' deve ser 0 ou 1.")
        }

        const allUsers = await db.raw(`
            SELECT * FROM users;
        `)
        
        const findForEqualBuyerIds = allUsers.find((item: { id: any }) => item.id === newPurchase.buyerId)         
        
        if (findForEqualBuyerIds === undefined) {
            res.status(404)
            throw new Error("'buyerId' não encontrado entre os usuários cadastrados.");
        }

        const allPurchases = await db.raw(`
            SELECT * FROM purchases;
        `)

        const findForEqualIds = allPurchases.find((item: { id: string }) => item.id === newPurchase.id)  


        if (findForEqualIds) {
            res.status(404)
            throw new Error("'id' já cadastrado.");
        }
        
        // const correctTotalPrice = findForEqualProductsIds.price * newPurchase.quantity
        
        // if (newPurchase.totalPrice !== correctTotalPrice) {
        //     res.status(422)
        //     throw new Error(`O cálculo do 'totalPrice', considerando a 'quantity' descrita e o produto referido, está incorreto. O valor correto é: ${correctTotalPrice}.`);
        // }        

        await db.raw(`
            INSERT INTO purchases
            VALUES(
                "${newPurchase.id}",
                "${newPurchase.buyerId}",
                "${newPurchase.totalPrice}",
                "${newPurchase.createdAt}",
                "${newPurchase.paid}"
            );
        `)    
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
app.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const allProducts = await db.raw(`
            SELECT * FROM products;
        `)

        const result = allProducts.find((item: { id: string }) => item.id === id)     
        
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
app.get('/users/:id/purchases', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const allUsers = await db.raw(`
            SELECT * FROM users;
        `)

        const checkId = allUsers.find((item: { id: string }) => item.id === id)
        
        if (!checkId) {
            res.status(404)
            throw new Error("Compras não encontradas, id não cadastrado.");
        }

        const allPurchases = await db.raw(`
            SELECT * FROM purchases;
        `)        

        const result = allPurchases.filter((item: { buyer_id: string }) => item.buyer_id === id)     
        
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
// app.delete("/users/:id", (req: Request, res: Response) => {
//     try {
//         const { id } = req.params

//         const findIndexUsers = users.findIndex((item) => item.id === id)

//         if (findIndexUsers < 0) {
//             res.status(404)
//             throw new Error("Usuário não encontrado. Verifique o 'id'.")
//         }
            
//         users.splice(findIndexUsers, 1)

//         res.status(200).send("Usuário apagado com sucesso.")
    
//     } catch (error) {
//         if (res.statusCode === 200) {
//             res.status(500).send("Erro interno do servidor")
//         }
//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }
// })

//deleteProductById
// app.delete("/products/:id", (req: Request, res: Response) => {
//     try {
//         const { id } = req.params

//         const findIndexProducts = products.findIndex((item) => item.id === id)

//         if (findIndexProducts < 0) {
//             res.status(404)
//             throw new Error("Produto não encontrado. Verifique o 'id'.")
//         }
            
//         products.splice(findIndexProducts, 1)

//         res.status(200).send("Produto apagado com sucesso.")
    
//     } catch (error) {
//         if (res.statusCode === 200) {
//             res.status(500).send("Erro interno do servidor")
//         }
//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }
// })

//editUserById
// app.put("/users/:id", (req: Request, res: Response) => {
//     try {
//         const { id } = req.params
    
//         const { email, password } = req.body

//         const checkId = req.body.id

//         if (checkId) {
//             res.status(400)
//             throw new Error("O campo'id' não pode ser editado, verifique o body.")
//         }
    
//         const userToEdit = users.find((item) => item.id === id)

//         if (!userToEdit) {
//             res.status(404)
//             throw new Error("Usuário não encontrado. Verifique o 'id'.")
//         }       
        
//         if (email !== undefined) {
//             if (typeof email !== "string") {
//                 res.status(400)
//                 throw new Error("'Email' deve ser uma string.")
//             }
//         }
//         if (password !== undefined) {
//             if (typeof password !== "string") {
//                 res.status(400)
//                 throw new Error("'Password' deve ser uma string.")
//             }
//         }

//         userToEdit.id = userToEdit.id
//         userToEdit.email = email || userToEdit.email
//         userToEdit.password = password || userToEdit.password
//         res.status(200).send("Cadastro atualizado com sucesso.")

//     } catch (error) {
//         if (res.statusCode === 200) {
//             res.status(500).send("Erro interno do servidor")
//         }
//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }

// })

//editProductById
// app.put("/products/:id", (req: Request, res: Response) => {
//     try {
//         const { id } = req.params

//         const {name , price, category} = req.body

//         const checkId = req.body.id

//         if (checkId) {
//             res.status(400)
//             throw new Error("O campo'id' não pode ser editado, verifique o body.")
//         }

//         const productToEdit= products.find((item) => item.id === id)

//         if (!productToEdit) {
//             res.status(404)
//             throw new Error("Produto não encontrado. Verifique o 'id'.")
//         }     
//         if (name !== undefined) {
//             if (typeof name !== "string") {
//                 res.status(400)
//                 throw new Error("'Name' deve ser uma string.")
//             }
//         }
//         if (price !== undefined) {
//             if (typeof price !== "number") {
//                 res.status(400)
//                 throw new Error("'Price' deve ser um number.")
//             }
//         }
//         const arrayCategory = (Object.values(Category));
        
//         if (category !== undefined) {
//             if (!arrayCategory.includes(category)) {
//                 res.status(400)
//                 throw new Error(`'Category' deve ser uma categoria válida entre: ${arrayCategory}`);
//             }
//         }

//         productToEdit.id = productToEdit.id
//         productToEdit.name = name || productToEdit.name
//         productToEdit.price = price || productToEdit.price
//         productToEdit.category = category || productToEdit.category

//         res.status(200).send("Produto atualizado com sucesso.")

//     } catch (error) {
//         if (res.statusCode === 200) {
//             res.status(500).send("Erro interno do servidor")
//         }
//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }
// })