const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (isValid(username)) {
      return res.status(400).json({ message: "Username is already exist please try another username" });
  }
  if (!isValid(username)) {
      users.push({ username, password });
      return res.status(201).json({ message: "User registered successfully" });
  } else {
      return res.status(401).json({ message: "Invalid username or password" });
  }
});

public_users.get('/', function (req, res) {
  return res.status(200).json({ books });
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const booksArray = Object.values(books);
  const book = booksArray.find(book => book.isbn === isbn);
  if (!book) {
      return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
});
  
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksArray = Object.values(books);
  const BookByAuthor  = booksArray.find(book => book.author === author);
  if(!BookByAuthor){
    return res.status(404).json({message: "The Book is not Found By author !"});
  }else{
  return res.status(200).json(BookByAuthor);

  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksArray = Object.values(books);
  const filteredBooks = booksArray.find(book => book.title.toLowerCase().includes(title));
  if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "No books found with the given title" });
  }
  return res.status(200).json(filteredBooks);
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const booksArray = Object.values(books);
  const book = booksArray.find(book => book.isbn === isbn);
  if (!book || !book.reviews) {
      return res.status(404).json({ message: "Reviews not found for the given ISBN" });
  }
  return res.status(200).json(book);
});

module.exports.general = public_users;
