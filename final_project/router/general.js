const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get the book list available in the shop using async-await with Axios
public_users.get('/asyncbooks', async function (req, res) {
  try {
    const response = await axios.get('http://127.0.0.1:5000/');
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books using Axios' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn], null, 4));
 });

// Get book details based on ISBN using async-await with Axios
public_users.get('/asyncisbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://127.0.0.1:5000/isbn/${isbn}`);
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve book details using Axios' });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const authorBooks = {};

  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      authorBooks[key] = books[key];
    }
  });

  return res.send(JSON.stringify(authorBooks, null, 4));
});

// Get book details based on author using async-await with Axios
public_users.get('/asyncauthor/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://127.0.0.1:5000/author/${author}`);
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve author details using Axios' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const titleBooks = {};

  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      titleBooks[key] = books[key];
    }
  });

  return res.send(JSON.stringify(titleBooks, null, 4));
});

// Get all books based on title using async-await with Axios
public_users.get('/asynctitle/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://127.0.0.1:5000/title/${title}`);
    return res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve title details using Axios' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
