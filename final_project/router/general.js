const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register User
public_users.post("/register", (req,res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        res.status(400).send("Error! Either username or password not provided!");
    }

    //test if username is already taken
    users.forEach((user) => {
        if(user.username === username){
            res.status(400).send("Error! username already taken!");
        }
    });

    let newUser = {
        username,
        password
    }

    users.push(newUser);
    res.status(201).send(`User with username ${username} successfully registered`);
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const books_list = await JSON.stringify(books, null, 4);
    res.status(200).send(books_list);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const reqBook = await books[isbn];
    if (reqBook){
        res.status(200).send(reqBook);
    } else {
        res.status(404).send(`Book with isbn ${isbn} not found!`);
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const reqBooks = await books;
    const book_keys = Object.keys(reqBooks);
    let author_found = false;

    book_keys.forEach((key) => {
        const reqBook = reqBooks[key];
        if(reqBook.author === author){
            author_found = true;
            res.status(200).send(reqBook);
        }
    }); 

    if (author_found === false){
        res.status(404).send(`Book with author ${author} not found!`);
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const reqBooks = await books;
    const book_keys = Object.keys(reqBooks);
    let title_found = false;

    book_keys.forEach((key) => {
        const reqBook = reqBooks[key]
        if(reqBook.title === title){
            title_found = true;
            res.status(200).send(reqBook);
        }
    }); 

    if (title_found === false){
        res.status(404).send(`Book with title ${title} not found!`);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if(books[isbn]){
        res.status(200).send(books[isbn].reviews);
    } else {
        res.status(404).send(`Book with isbn ${isbn} not found!`);
    }
});


module.exports.general = public_users;
