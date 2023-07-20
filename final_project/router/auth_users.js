const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//write code to check is the username is valid
const isValid = (username)=>{ //returns boolean
    let logUser = users.find((user) => user.username === username);
    
    if (logUser){
       return true;
    } else {
        return false;
    }
}

//write code to check if username and password match the one we have in records.
const authenticatedUser = (username,password)=>{ //returns boolean
    let logUser = users.find((user) => user.username === username);
    
    if (logUser.password === password){
        return true;
    } else {
        return false;
    }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;

    if(!username || !password){
        res.status(400).send("Error! Either username or password not provided!");
    }

    if (!isValid(username)){
        res.status(400).send(`Error! User with username ${username} not found!`)
    }

    if (!authenticatedUser(username,password)){
        res.status(400).send("Error! Invalid Login. Check username and password");
    }    

    let accessToken = jwt.sign({data: password}, "access");
    req.session.authorization = {
        accessToken,
        username
    };
    res.status(200).send(`user ${username} logged in successfully`);
});


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const newReviewText = req.query.review;
    let username = req.session.authorization.username;

    if(!books[isbn]){
        res.status(404).send(`Book with isbn ${isbn} not found!`);
    }

    if(!newReviewText){
        res.status(400).send("Error! review not given");
    }

    if (!books[isbn].reviews[username]){
        let newUserReview = {
            review: newReviewText
        }

        books[isbn].reviews[username] = newUserReview;
        res.status(201).send(`Review by ${username} successfully added`);
    } else {
        books[isbn].reviews[username].review = newReviewText;
        res.status(201).send(`Review by ${username} successfully modified`); 
    }
});

// Delete book review
regd_users.delete('/auth/review/:isbn', (req,res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if(!books[isbn]){
        res.status(404).send(`Book with isbn ${isbn} not found!`);
    }

    if (!books[isbn].reviews[username]){
        res.status(400).send(`Error! User ${username} has not posted a review for this book!`);
    }

    delete books[isbn].reviews[username];
    res.status(200).send(`User ${username} successfully deleted review`);

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
