const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register User
public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]){
        res.status(200).send(books[isbn]);
    } else {
        res.status(404).send(`Book with isbn ${isbn} not found!`);
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const book_keys = Object.keys(books);
    let author_found = false;

    book_keys.forEach((key) => {
        if(books[key].author === author){
            author_found = true;
            res.status(200).send(books[key]);
        }
    }); 

    if (author_found === false){
        res.status(404).send(`Book with author ${author} not found!`);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const book_keys = Object.keys(books);
    let title_found = false;

    book_keys.forEach((key) => {
        if(books[key].title === title){
            title_found = true;
            res.status(200).send(books[key]);
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
