//const { log } = require("console");
const express = require("express");
const { Pool } = require("pg");

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "radhe",
  password: "root",
  port: 5432, // PostgreSQL default port
});

const product = [
  {
    id: 1,
    pic: "./images/Don_25k.webp",
    price: "$25,477.99",
    name: "Donperion",
  },
  {
    id: 2,
    pic: "./images/Don_perion.webp",
    price: "$2,799.00",
    name: "Donperion",
  },
  {
    id: 3,
    pic: "./images/coca-cola.webp",
    price: "$3.49",
    name: "cocacola",
  },
  {
    id: 4,
    pic: "./images/Monster.webp",
    price: "$3.99",
    name: "monster",
  },

];

app.post("/", function (req, res) {
  console.log("read :-", req.body);

  var searchSrtring = req.body.searchString.toLowerCase();

  var searchedProduct = product.filter((data) => data.name === searchSrtring);

  if (searchedProduct.length === 0) {
    return res.status(404).json({
      message: `data for ${searchSrtring} not found!`,
      data: searchedProduct,
    });
  } else {
    return res.status(200).json({
      message: `data for ${searchSrtring} found!`,
      data: searchedProduct,
    });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, fullName, phoneNumber } = req.body;

  try {
    // Check if the username already exists
    const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Insert new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (email, password,full_name,phone_number) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, password, fullName, phoneNumber]
    );

    // Return the newly created user
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define a route for user signin
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify the password
    const storedPassword = user.rows[0].password;
    if (password !== storedPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // User authenticated successfully
    res.status(200).json({ message: "Signin successful", user: user.rows[0] });
  } catch (error) {
    console.error("Error signing in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define a route for adding products to the cart
app.post("/cart/add", function(req, res) {
  const { productId } = req.body;

  // Find the product by its ID
  const selectedProduct = product.find(prod => prod.id === productId);

  if (!selectedProduct) {
      return res.status(404).json({ error: "Product not found" });
  }

  // Add the product to the cart (you can store cart information in memory)
  // For simplicity, let's assume cart is an array
  // You may want to implement a more robust cart management system
  cart.push(selectedProduct);

  // Respond with success message
  res.status(200).json({ message: "Product added to cart", cart: cart });
});

// Define an empty array to store cart items
let cart = [];

// Define a route for adding products to the cart
app.post("/cart/add", function(req, res) {
    const { productId } = req.body;

    // Find the product by its ID
    const selectedProduct = product.find(prod => prod.id === productId);

    if (!selectedProduct) {
        return res.status(404).json({ error: "Product not found" });
    }

    // Add the product to the cart
    cart.push(selectedProduct);

    // Respond with success message
    res.status(200).json({ message: "Product added to cart", cart: cart });
});

// Define a route for fetching cart items
app.get("/cart/items", function(req, res) {
    // Return the cart items
    res.status(200).json({ cart: cart });
});





app.listen(3000, () => {
  console.log("listening port 3000");
});
