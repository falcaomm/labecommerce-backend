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
