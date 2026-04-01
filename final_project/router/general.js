const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ================= REGISTER USER =================
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


// ================= GET ALL BOOKS =================
public_users.get('/', function (req, res) {
  return res.json(books);
});


// ================= GET ALL BOOKS (ASYNC AXIOS) =================
public_users.get('/asyncbooks', async function (req, res) {
  try {
    const response = await axios.get('http://127.0.0.1:5000/');
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books using Axios' });
  }
});


// ================= GET BOOK BY ISBN =================
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.json(books[isbn]);
});


// ================= GET BOOK BY ISBN (ASYNC AXIOS) =================
public_users.get('/asyncisbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://127.0.0.1:5000/isbn/${isbn}`);

    if (!response.data) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve book details using Axios' });
  }
});


// ================= GET BOOK BY AUTHOR =================
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  let authorBooks = {};

  Object.keys(books).forEach(key => {
    if (books[key].author.toLowerCase() === author) {
      authorBooks[key] = books[key];
    }
  });

  if (Object.keys(authorBooks).length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }

  return res.json(authorBooks);
});


// ================= GET BOOK BY AUTHOR (ASYNC AXIOS) =================
public_users.get('/asyncauthor/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://127.0.0.1:5000/author/${author}`);

    if (!response.data || Object.keys(response.data).length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve author details using Axios' });
  }
});


// ================= GET BOOK BY TITLE =================
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  let titleBooks = {};

  Object.keys(books).forEach(key => {
    if (books[key].title.toLowerCase() === title) {
      titleBooks[key] = books[key];
    }
  });

  if (Object.keys(titleBooks).length === 0) {
    return res.status(404).json({ message: "No books found for this title" });
  }

  return res.json(titleBooks);
});


// ================= GET BOOK BY TITLE (ASYNC AXIOS) =================
public_users.get('/asynctitle/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://127.0.0.1:5000/title/${title}`);

    if (!response.data || Object.keys(response.data).length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }

    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve title details using Axios' });
  }
});


// ================= GET BOOK REVIEWS =================
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.json(books[isbn].reviews);
});


module.exports.general = public_users;
