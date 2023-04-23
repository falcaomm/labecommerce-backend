export enum Category {
    ACCESSORIES = "Acessórios",
    CLOTHES_AND_SHOES = "Roupas e calçados",
    ELECTRONICS = "Eletrônicos"
}
export type TUser = {
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: string
}

export type TProduct = {
    id: string,
    name: string,
    price: number,
    description: string,
    imageUrl: string,
    category: Category,
}

export type TPurchase = {
    id: string,
    buyerId : string,
    totalPrice: number,
    createdAt: string,
    paid: number,
}



