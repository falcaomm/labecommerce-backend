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