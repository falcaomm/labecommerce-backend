import {TUser, TProduct, TPurchase} from "./types"

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
    category: 'um'
    }, 
    {
    id: '02',
    name: 'produto2',
    price: 2,
    category: 'dois'
    }, 
]

export const purchases: Array<TPurchase> = [
    {
    userId : users[0].id,
    productId: products[0].id,
    quantity: 2,
    totalPrice: 2*products[0].price
    }
]