-- Active: 1680636546217@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users (id, email, password)
VALUES 
("01","user1@email.com", "user01"),
("02","user2@email.com", "user02"), 
("03","user3@email.com", "user03");

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

INSERT INTO products (id, name, price, category)
VALUES
("01", "Camiseta", 38.50, "Roupas e calçados" ),
("02", "Tênis", 105.90, "Roupas e calçados" ), 
("03", "Calça", 80.75, "Roupas e calçados" ),
("04", "Boné", 19.99, "Acessórios" ), 
("05", "Corrente", 10.30, "Acessórios" ),
("06", "Fone de ouvido", 143, "Eletrônicos" );

-- Get All Users 
SELECT * FROM users;

-- Get All Products
SELECT * FROM products;

-- Search Product by name 
SELECT * FROM products
WHERE name like "%ca%";

-- Create User 
INSERT INTO users (id, email, password)
VALUES ( "04", "user4@email.com", "user04");

-- Create Product 
INSERT INTO products (id, name, price, category)
VALUES ("07", "Celular", 1599.99, "Eletrônicos");

-- Get Products by id 
SELECT * FROM products
WHERE id = "07";

-- Delete User by id 
DELETE FROM users
WHERE id = "04";

-- Delete Product by id 
DELETE FROM products 
WHERE id = "07";

-- Edit User by id 
UPDATE users
SET
    email = "user4@outro-email.com",
    password = "novouser04"
WHERE id = "04";

-- Edit Product by id 
UPDATE products
SET
    price = 1499.99
WHERE id = "07";

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

CREATE TABLE purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        total_price REAL NOT NULL,
        paid INTEGER NOT NULL,
        delivery_at TEXT,
        buyer_id TEXT NOT NULL,
        Foreign Key (buyer_id) REFERENCES users(id) 
    );


INSERT INTO purchases(id, total_price, paid, buyer_id)
VALUES 
("01", "100", 0, "02"),
("02", "300", 0, "02"),
("03", "80", 0, "01"), 
("04", "450", 0, "03");

SELECT * FROM purchases;

UPDATE purchases
SET delivery_at = datetime("now")
WHERE id = "02";

SELECT * FROM purchases 
INNER JOIN users
ON users.id = buyer_id
WHERE buyer_id = "02";
