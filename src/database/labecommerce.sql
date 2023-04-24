-- Active: 1681859642129@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, 
    created_at TEXT
);

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL, 
    image_url TEXT NOT NULL,
    category TEXT NOT NULL
);

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer_id TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT,
    paid INTEGER DEFAULT(0) NOT NULL,
    Foreign Key (buyer_id) REFERENCES users(id) 
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE TABLE purchases_products (
    id TEXT NOT NULL UNIQUE,
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    Foreign Key (purchase_id) REFERENCES purchases(id),
    Foreign Key (product_id) REFERENCES products(id)
    ON UPDATE CASCADE 
    ON DELETE CASCADE 
);

INSERT INTO users (id, email, password)
VALUES 
("u001","user1@email.com", "user01"),
("u002","user2@email.com", "user02"), 
("u003","user3@email.com", "user03");

INSERT INTO products (id, name, price, category)
VALUES
("p001", "Camiseta", 38.50, "Roupas e calçados" ),
("p002", "Tênis", 105.90, "Roupas e calçados" ), 
("p003", "Calça", 80.75, "Roupas e calçados" ),
("p004", "Boné", 19.99, "Acessórios" ), 
("p005", "Corrente", 10.30, "Acessórios" ),
("p006", "Fone de ouvido", 143, "Eletrônicos" );

INSERT INTO purchases(id, total_price, buyer_id)
VALUES 
("c001", "100", "u002"),
("c002", "100", "u002"),
("c003", "100", "u001"), 
("c004", "100", "u003");

INSERT INTO purchases_products
VALUES
("c001", "p001", 5),
("c002", "p003", 2), 
("c001", "p004", 3);

-- REQUISIÇÕES--------------------------

-- Get All Users 
SELECT * FROM users;

-- Get All Products
SELECT * FROM products;

-- Search Product by name 
SELECT * FROM products
WHERE name like "%ca%";

-- Create User 
INSERT INTO users (id, email, password)
VALUES ( "u004", "user4@email.com", "user04");

-- Create Product 
INSERT INTO products (id, name, price, category)
VALUES ("p007", "Celular", 1599.99, "Eletrônicos");

-- Get Products by id 
SELECT * FROM products
WHERE id = "p007";

-- Edit User by id 
UPDATE users
SET
    email = "user4@outro-email.com",
    password = "novouser04"
WHERE id = "u004";

-- Edit Product by id 
UPDATE products
SET
    price = 1499.99
WHERE id = "p007";

-- Delete User by id 
DELETE FROM users
WHERE id = "u001";

-- Delete Product by id 
DELETE FROM products 
WHERE id = "p007";

-- Get All Users ordem crescente por email
SELECT * FROM users
ORDER BY email ASC;

-- Get All Products 20 primeiros 
SELECT * FROM products
ORDER BY price ASC
LIMIT 20;

-- Get All Products intervalo de preço
SELECT * FROM products
WHERE price > 50 AND price < 300
ORDER BY price ASC;

-----------------------------------------

SELECT * FROM purchases;

UPDATE purchases
SET delivery_at = datetime("now")
WHERE id = "c002";

-- Get Purchase by userId
SELECT * FROM purchases 
INNER JOIN users
ON purchases.buyer_id = users.id
WHERE buyer_id = "u002";


SELECT * FROM purchases_products;

SELECT * FROM products 
LEFT JOIN purchases_products
ON purchases_products.product_id = products.id;

SELECT * FROM purchases_products 
LEFT JOIN products ON purchases_products.product_id = products.id
LEFT JOIN purchases ON purchases_products.purchase_id = purchases.id
INNER JOIN users ON purchases.buyer_id = users.id;

-- On forenkey = primary key - boas praticas
SELECT * FROM purchases
INNER JOIN purchases_products ON purchases_products.purchase_id = purchases.id
WHERE id = "c001";

---------------------------------------
DROP Table users;
DROP Table products;
DROP Table purchases;
DROP Table purchases_products;