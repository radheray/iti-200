//const { log } = require("console");
const express = require("express");
const { Pool } = require("pg");

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "radhe.czlrs31nhr0a.us-west-1.rds.amazonaws.com",
  database: "radhe",
  password: "postgres",
  port: 5432, // PostgreSQL default port
});

const product = [
  {
    id: 1,
    pic: "https://storage.googleapis.com/radheproject/Don_25k.webp",
    price: 25477.99,
    name: "donperion",
    stores: [
      {
        id: 1,
        name: "Store A",
        address: "123 Main St, San Francisco, CA 94107",
      },
      {
        id: 2,
        name: "Store B",
        address: "123 Main St, San Francisco, CA 94107",
      },
      {
        id: 3,
        name: "Store C",
        address: "123 Main St, San Francisco, CA 94107",
      },
    ],
  },
  {
    id: 2,
    pic: "https://storage.googleapis.com/radheproject/Monster.webp",
    price: 899.0,
    name: "monster",
    stores: [
      {
        id: 1,
        name: "Store A",
        address: "123 Main St, San Francisco, CA 94107",
      },
      {
        id: 2,
        name: "Store B",
        address: "123 Main St, San Francisco, CA 94107",
      },
    ],
  },
  {
    id: 3,
    pic: "https://storage.googleapis.com/radheproject/1.jpeg",
    price: 99.0,
    name: "pepsi",
    stores: [
      {
        id: 1,
        name: "Store A",
        address: "123 Main St, San Francisco, CA 94107",
      },
      {
        id: 2,
        name: "Store B",
        address: "123 Main St, San Francisco, CA 94107",
      },
    ],
  },
];

var cart = [];

app.post("/search", function (req, res) {
  var searchSrtring = req.body.searchString.toLowerCase();

  console.log("search string: " + searchSrtring);

  var searchedProduct = product.filter((data) => data.name === searchSrtring);

  product.forEach((data) => {
    console.log("data name", data.name);
  });

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
  const { email, password, fullName, phoneNumber, address } = req.body;

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
      "INSERT INTO users (email, password,full_name,phone_number,address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [email, password, fullName, phoneNumber, address]
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
app.post("/cart/add", function (req, res) {
  try {
    const { productId } = req.body;

    // Find the product by its ID
    const selectedProduct = product.filter((prod) => prod.id === productId);

    if (!selectedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    selectedProduct.forEach((prod) => {
      cart.push(prod);
    });

    res.status(200).json({ message: "Product added to cart", cart: cart });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

// Define a route for fetching cart items
app.get("/cart/find/all", function (req, res) {
  try {
    if (cart.length === 0) {
      return res.status(404).json({ message: "Cart is empty", data: cart });
    } else {
      // Return the cart items
      res.status(200).json({ data: cart, message: "Cart items found" });
    }
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

app.get("/cart/find", function (req, res) {
  try {
    const id = req.query.id;

    console.log(id);

    console.log(cart);

    const searchedProduct = cart.filter((prod) => prod.id == id);

    if (searchedProduct.length === 0) {
      return res
        .status(404)
        .json({ message: "Cart is empty", data: searchedProduct });
    } else {
      // Return the cart items
      res
        .status(200)
        .json({ data: searchedProduct, message: "Cart items found" });
    }

    // Return the cart items
    res.status(200).json({ cart: searchedProduct });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

app.post("/place/order", function (req, res) {
  try {
    const { cartids } = req.body;

    let order = [];

    for (let i in cartids) {
      order.push(cart.filter((prod) => prod.id == cartids[i])[0]);
    }

    let totalPrice = 0;

    order.forEach((prod) => {
      totalPrice += prod.price;
    });

    const response = {
      totalPrice: totalPrice,
      order: order,
    };

    console.log(order);

    // res.status(200).json({ message: "Order placed", order: order });
    return res.status(200).json({ message: "Order placed", data: response });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
});

app.listen(3000, () => {
  console.log("listening port 3000");
});
