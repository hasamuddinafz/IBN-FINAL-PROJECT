const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    "id": 1,
    "username": "Hasamuddin",
    "password": "123456"
  }
];

const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
return users.some(user => user.username === username && user.password === password);
}

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }
  if (authenticatedUser(username, password)) {
      const token = jwt.sign({ username }, 'fingerprint_customer', { expiresIn: '1h' });

      return res.status(200).json({ message: "Login successful", token });
  } else {
      return res.status(401).json({ message: "Invalid username or password" });
  }
});
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  if (!review) {
      return res.status(400).json({ message: "Review content is required" });
  }

  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  jwt.verify(token, 'fingerprint_customer', (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      const { username } = decoded;
      if (!isValid(username)) {
          return res.status(401).json({ message: "Unauthorized: Invalid user" });
      }

      if (books[isbn]) {
          if (!Array.isArray(books[isbn].reviews)) {
              books[isbn].reviews = [];
          }
          books[isbn].reviews.push({ username, review });
          return res.status(200).json({ message: "Review added successfully" });
      } else {
          return res.status(404).json({ message: "Book not found" });
      }
  });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;