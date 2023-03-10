import { users, products, purchases } from "./database"
import { Category } from "./types"
import {
    getProductById, 
    getAllProducts,
    createProduct,
    getAllUsers,
    createUser,
    queryProductsByName,
    getAllPurchasesFromUserId
} from "./database"

createUser("u003", "beltrano@email.com", "beltrano99")

getAllUsers()

createProduct("p004", "Monitor HD", 800, Category.ELECTRONICS)

getAllProducts()

console.log(getProductById('p004'))

console.log(queryProductsByName("PRO"))

console.log(getAllPurchasesFromUserId("02"));