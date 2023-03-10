import {TUser, TProduct, TPurchase, Category} from "./types"


export const users: Array<TUser> = [
    {
    id: '01',
    email: "user1@email",
    password: 'senha1'
    }, 
    {
    id: '02',
    email: "user2@email",
    password: 'senha2'
    }
]

export const products: Array<TProduct> = [
    {
    id: '01',
    name: 'produto1',
    price: 1,
    category: Category.ACCESSORIES
}, 
{
    id: '02',
    name: 'produto2',
    price: 2,
    category: Category.CLOTHES_AND_SHOES
}, 
]

export const purchases: Array<TPurchase> = [
    {
    userId : '01',
    productId: '01',
    quantity: 2,
    totalPrice: 2
    },
    {
    userId : '02',
    productId: '02',
    quantity: 2,
    totalPrice: 4
    },
    {
    userId : '02',
    productId: '01',
    quantity: 3,
    totalPrice: 3
    },
]

export const createUser = (id: string, email: string, password: string) => {
    const newUser: TUser= {
        id: id,
        email: email,
        password: password
    }
    users.push(newUser)
    console.log('cadatro realizado com sucesso');
}
    
export const getAllUsers = () => {
    console.table(users)
}

export const createProduct = (id: string, name: string, price: number, category: Category) => {
    const newProduct: TProduct= {
        id: id,
        name: name,
        price: price,
        category: category
    }
    products.push(newProduct)
    console.log('procduto criado com sucesso');
}

export const getAllProducts = () => {
    console.table(products)
}

export const getProductById = (idToSearch: string) => {
    return products.filter(
        (item) => {
        return item.id === idToSearch;
    })
}

export function queryProductsByName (q:string) {
    return products.filter(
        (item) => {
        return item.name.toLowerCase().includes(q.toLowerCase());
    })
}

export const createPurchase  = ( userId: string, productId: string, quantity: number, totalPrice: number) => {
    const newPurchase: TPurchase= {
        userId : userId,
        productId: productId,
        quantity: quantity,
        totalPrice: totalPrice
    }
    purchases.push(newPurchase)
    console.log('compra realizada com sucesso');
}

export const getAllPurchasesFromUserId = (userIdToSearch: string) => {
    return purchases.filter(
        (item) => {
        return item.userId === userIdToSearch;
    })
}