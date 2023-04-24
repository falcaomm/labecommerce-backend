import express, { Request, Response } from 'express'
import cors from 'cors'
import { Category, TUser, TProduct, TPurchase } from "./types"
import { db } from './database/knex'

function removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

//getAllUsers
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await db("users")
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send("Erro interno do servidor")
    }
})

//getAllProducts
app.get('/products', async (req: Request, res: Response) => {
    try {
        const result = await db("products")
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send("Erro interno do servidor")
    }
})

//getAllPurchases
app.get('/purchases', async (req: Request, res: Response) => {
    try {
        const result = await db("purchases").select(
            "purchases.id AS purchaseId",
            "purchases.total_price",
            "purchases.created_at As createdAt",
            "purchases.paid As isPaid",
            "purchases.buyer_id AS buyerId",
        )

        const resultsWithIsPaid = [];
        for (const item of result) {
            const isPaid = item.isPaid === 1;
            const resultWithIsPaid = {
                ...item,
                isPaid: isPaid
            }
            resultsWithIsPaid.push(resultWithIsPaid);
        }

        res.status(200).send(resultsWithIsPaid);

    } catch (error) {
        res.status(500).send("Erro interno do servidor")
        console.log(error);
        
    }
})

//getProductsById
app.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const [result] = await db('products').where({ id : id });
        if (!result) {
            res.status(404);
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

        const [checkId] = await db('users').where({ id : id });
        
        if (!checkId) {
            res.status(404);
            throw new Error("Compras não encontradas, id não cadastrado.");
        }

        const result = await db('purchases').where({ buyer_id: id });
        
        if (result.length<=0) {
            res.status(404);
            throw new Error("Usuário sem compras cadastradas.");
        }

        const resultsWithIsPaid = [];
        for (const item of result) {
            const isPaid = item.isPaid === 1;
            const resultWithIsPaid = {
                ...item,
                isPaid: isPaid
            }
            resultsWithIsPaid.push(resultWithIsPaid);
        }
        
        res.status(200).send(resultsWithIsPaid)
        
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

//getPurchaseById
app.get("/purchases/:id", async (req: Request, res: Response) => { 
    try {
        const { id } = req.params

        const arrayPurchases = await db('purchases').where({ id : id });
        
        if (arrayPurchases.length <= 0) {
            res.status(404);
            throw new Error("Carrinho não encontrado, id não cadastrado.");
        }

        
        const productsList = await db("purchases_products")
        .select(
            "purchases_products.product_id AS id",
            "products.name AS name",
            "products.price AS price",
            "products.description AS description",
            "products.image_url AS imageUrl",
            "purchases_products.quantity AS quantity" 
            ).innerJoin(
                "products",
                "products.id",
                "=",
                "purchases_products.product_id"
                )
                .where({ purchase_id: id })
                
        let totalPrice = 0;

        for (const item of productsList) {
        totalPrice += item.price * item.quantity;
        }

        await db('purchases')
        .where({ id: id })
        .update({ total_price: totalPrice });

        const [result] = await db('purchases')
            .select(
                "purchases.id AS purchaseId",
                "purchases.total_price",
                "purchases.created_at As createdAt",
                "purchases.paid As isPaid",
                "purchases.buyer_id AS buyerId",
                "users.email AS email",
                "users.name AS name",
            ).innerJoin(
                "users",
                "users.id",
                "=",
                "purchases.buyer_id"
        ).where({ "purchases.id": id })
        
        const isPaid = result.isPaid === 1;
        
        const resultWithProducts = {
            ...result,
            productsList: productsList,
            isPaid: isPaid
        }
        
        res.status(200).send(resultWithProducts)
        
    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
            console.log(error);
            
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//searchProductsByName
app.get('/search/products', async (req: Request, res: Response) => {
    try {
        const query = removeAccents(req.query.name as string);

        if (!query || query.length <= 0) {
            res.status(404)
            throw new Error("Busca não encontrada. Query params deve possuir pelo menos um caractere.");
        }

        const allProducts = await db("products")

        const result = allProducts.filter((item: { name: string }) => removeAccents(item.name).toLowerCase().includes(query.toLowerCase()));

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

        const [existingUser] = await db('users')
            .where({ id: newUser.id })
            .orWhere({ email: newUser.email })

        if (existingUser) {
            res.status(422)
            throw new Error(existingUser.id === newUser.id ? "Número de 'Id' já cadastrado." : "Email já cadastrado.")
        }

        await db('users').insert({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            created_at: newUser.createdAt
        })
    
        res.status(201).send('Cadastro realizado com sucesso')

    } catch (error) {
        if (res.statusCode === 200) {
            console.log(error);
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

        const [existingProduct] = await db('products')
            .where({ id: newProduct.id })

        if (existingProduct) {
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

        await db('products')
            .insert({
            id: newProduct.id,
            name: newProduct.name,
            price: newProduct.price,
            description: newProduct.description,
            image_url: newProduct.imageUrl,
            category: newProduct.category
        })
        
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
            totalPrice: 0,
            createdAt: Date(),
            paid: req.body.paid
        }
        
        if (newPurchase.id === undefined || newPurchase.buyerId === undefined) {
            res.status(400)
			throw new Error("Os campos 'id', 'buyerId' e 'paid' são obrigatórios para o cadastro do carrinho.")
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

        const [findForEqualBuyerIds] = await db('users').where({ id: newPurchase.buyerId });

        if (!findForEqualBuyerIds) {
            res.status(404);
            throw new Error("'buyerId' não encontrado entre os usuários cadastrados.");
        }
        
        const purchase = await db('purchases').where({ id: newPurchase.id }).first();
        if (purchase) {
            res.status(404);
            throw new Error("'id' já cadastrado.");
        }
        
        // const correctTotalPrice = findForEqualProductsIds.price * newPurchase.quantity
        
        // if (newPurchase.totalPrice !== correctTotalPrice) {
        //     res.status(422)
        //     throw new Error(`O cálculo do 'totalPrice', considerando a 'quantity' descrita e o produto referido, está incorreto. O valor correto é: ${correctTotalPrice}.`);
        // }        

        await db('purchases').insert({
            id: newPurchase.id,
            buyer_id: newPurchase.buyerId,
            total_price: newPurchase.totalPrice,
            created_at: newPurchase.createdAt,
            paid: newPurchase.paid
        });

        res.status(201).send('Carrinho iniciado com sucesso')

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

//createBuy
app.post('/buy', async (req: Request, res: Response) => {

    try {
        const { id, purchaseId, productId, quantity } = req.body

        if (id === undefined || purchaseId === undefined || productId === undefined || quantity === undefined) {
            res.status(400)
			throw new Error("Os campos 'purchaseId', 'productId' e 'quantity' são obrigatórios para o cadastro da compra.")
        }
        const [existingBuy] = await db('purchases_products')
            .where({ id: id })

        if (existingBuy) {
            res.status(422)
            throw new Error("Compra já cadastrada. Você pode fazer a mesma compra com um novo id.");
        }

        const [findForEqualpurchaseIds] = await db('purchases').where({ id: purchaseId });

        if (!findForEqualpurchaseIds) {
            res.status(404);
            throw new Error("'purchaseId' não encontrado entre os carrinhos cadastrados.");
        }

        const [findForEqualproductIds] = await db('products').where({ id: productId });

        if (!findForEqualproductIds) {
            res.status(404);
            throw new Error("'productId' não encontrado entre os produtos cadastrados.");
        }

        if (typeof quantity !== "number" || quantity === 0) {
            res.status(400)
			throw new Error("'quantity' deve ser um number diferente de zero.")
        }
        
        await db('purchases_products').insert({
            id: id,
            purchase_id: purchaseId,
            product_id: productId,
            quantity: quantity,
        });

        res.status(201).send('Compra realiza com sucesso.')

    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500).send("Erro interno do servidor")
            console.log(error);
            
        }
        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

//deleteUserById
app.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete  = req.params.id

        const [findForEqualIds] = await db("users").where({ id: idToDelete })        

        if (!findForEqualIds) {
            res.status(404)
            throw new Error("Usuário não encontrado. Verifique o 'id'.")
        }
        
        await db("purchases").del().where({ buyer_id: idToDelete })
        await db("users").del().where({id: idToDelete })  

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
app.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        const [findForEqualIds] = await db("products").where({ id: idToDelete })        

        if (!findForEqualIds) {
            res.status(404)
            throw new Error("Produto não encontrado. Verifique o 'id'.")
        }

        await db("purchases_products").del().where({ product_id: idToDelete })
        await db("products").del().where({id: idToDelete })  

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

//deletePurchaseById
app.delete("/purchases/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        const [findForEqualIds] = await db("purchases").where({ id: idToDelete })        

        if (!findForEqualIds) {
            res.status(404)
            throw new Error("Carrinho não encontrado. Verifique o 'id'.")
        }

        await db("purchases_products").del().where({ purchase_id: idToDelete }) 
        await db("purchases").del().where({id: idToDelete })  

        res.status(200).send("Carrinho apagado com sucesso.")
    
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

//deleteBuyById
app.delete("/buy/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id

        const [findForEqualIds] = await db("purchases_products").where({ id: idToDelete })        

        if (!findForEqualIds) {
            res.status(404)
            throw new Error("Compra não encontrada. Verifique o 'id'.")
        }

        await db("purchases_products").del().where({id: idToDelete })  

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
app.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id
        const { id, name, email, password } = req.body

        const [userToEdit] = await db('users').where({ id: idToEdit});
        
        if (!userToEdit) {
            res.status(404);
            throw new Error("Usuário não encontrado. Verifique o 'id'.");
        }    

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'Id' deve ser uma string.")
            }
        }
        if (name !== undefined) {
            if (typeof name !== "string") {
                res.status(400)
                throw new Error("'Name' deve ser uma string.")
            }
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

        const newUser = {
            id: id || userToEdit.id,
            name: name || userToEdit.name,
            email: email || userToEdit.email,
            password: password || userToEdit.password,
            created_at: userToEdit.created_at
        }

        await db("users").update(newUser).where({id:idToEdit})

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
app.put("/products/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const { id, name, price, description, image_url, category } = req.body
        
        const [productToEdit] = await db('products').where({ id: idToEdit});
        
        if (!productToEdit) {
            res.status(404);
            throw new Error("Produto não encontrado. Verifique o 'id'.");
        } 

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'Id' deve ser uma string.")
            }
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
        if (description !== undefined) {
            if (typeof description !== "string") {
                res.status(400)
                throw new Error("'Description' deve ser uma string.")
            }
        }
        if (image_url !== undefined) {
            if (typeof image_url !== "string") {
                res.status(400)
                throw new Error("'Image_url' deve ser uma string.")
            }
        }

        const arrayCategory = (Object.values(Category));
        
        if (category !== undefined) {
            if (!arrayCategory.includes(category)) {
                res.status(400)
                throw new Error(`'Category' deve ser uma categoria válida entre: ${arrayCategory}`);
            }
        }

        const newProduct = {
            id: id || productToEdit.id,
            name: name || productToEdit.name,
            price: price || productToEdit.price,
            description: description || productToEdit.description,
            image_url: image_url || productToEdit.image_url,
            category: category || productToEdit.category
        }

        await db("products").update(newProduct).where({id:idToEdit})

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