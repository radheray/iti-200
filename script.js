function callApi() {
  var searchString = document.getElementById("search").value;
  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "http://ec2-50-18-140-198.us-west-1.compute.amazonaws.com:3000/search",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      console.log("respose :", response);
      displayResults(response);
    }
  };
  var data = JSON.stringify({ searchString: searchString });
  xhr.send(data);
}

function displayResults(response) {
  let id = 1;

  var searchResultsDiv = $("#searchResults");
  searchResultsDiv.empty();
  if (response.data.length === 0) {
    searchResultsDiv.html(response.message);
  } else {
    $.each(response.data, function (index, product) {
      id = product.id;
      var productHtml = `
         
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                        <a href="#"><img class="card-img-top" src="${product.pic}" alt=""></a>
                    <div class="card-body">
                        <h4 class="card-title">
                            <a href="#">${product.name}</a>
                        </h4>
                        <h5>${product.price}</h5>
                        <button class="btn btn-outline-primary mr-2 my-2 my-sm-0" type="button" id="buybutton">Add to Cart</button>

                        </div>
                    <div class="card-footer">
                        <small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9734;</small>
                    </div>
                    </div>
                </div>
            `;
      searchResultsDiv.append(productHtml);
    });
  }

  document.getElementById("buybutton").addEventListener("click", function () {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "http://ec2-50-18-140-198.us-west-1.compute.amazonaws.com:3000/cart/add",
      true
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log("respose :", response);
        displayResults(response);
      }
    };
    var data = JSON.stringify({ productId: id });
    xhr.send(data);
  });
}

// Add click event listener to "Add to Cart" buttons
$(document).on("click", ".add-to-cart-btn", function () {
  // Retrieve the product ID from the data attribute
  var productId = $(this).data("product-id");

  // Send AJAX request to add product to cart
  $.ajax({
    url: "http://ec2-50-18-140-198.us-west-1.compute.amazonaws.com:3000/cart/add",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ productId: productId }),
    success: function (response) {
      // Handle success response
      alert("Product added to cart!");
    },
    error: function (xhr, status, error) {
      // Handle error response
      console.error("Error adding product to cart:", error);
    },
  });
});

// Function to load cart items
function loadCartItems() {
  // Sample cart items (replace with your actual cart items)
  const cartItems = [
    { id: 1, name: "Product 1", price: "$10.99" },
    { id: 2, name: "Product 2", price: "$19.99" },
    { id: 3, name: "Product 3", price: "$7.49" },
  ];

  // Get the cart items container
  const cartItemsContainer = document.getElementById("cartItems");

  // Clear previous items
  cartItemsContainer.innerHTML = "";

  // Loop through cart items and create HTML elements
  cartItems.forEach((item) => {
    // Create card element for each item
    const card = document.createElement("div");
    card.classList.add("col-lg-4", "col-md-6", "mb-4");

    // Construct card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card", "h-100");

    // Add item name and price to card body
    cardBody.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">${item.price}</p>
          </div>
        `;

    // Append card body to card
    card.appendChild(cardBody);

    // Append card to cart items container
    cartItemsContainer.appendChild(card);
  });
}

// Load cart items when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadCartItems();
});

// Function to load cart items
function loadCartItems() {
  // Send AJAX request to fetch cart items from the server
  $.ajax({
    url: "http://ec2-50-18-140-198.us-west-1.compute.amazonaws.com:3000/cart/items",
    method: "GET",
    success: function (response) {
      // Update the UI with cart items
      displayCartItems(response.cart);
    },
    error: function (xhr, status, error) {
      // Handle error response
      console.error("Error loading cart items:", error);
    },
  });
}

// Function to display cart items in the UI
function displayCartItems(cart) {
  // Get the cart items container
  const cartItemsContainer = document.getElementById("cartItems");

  // Clear previous items
  cartItemsContainer.innerHTML = "";

  // Loop through cart items and create HTML elements
  cart.forEach((item) => {
    // Create card element for each item
    const card = document.createElement("div");
    card.classList.add("col-lg-4", "col-md-6", "mb-4");

    // Construct card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card", "h-100");

    // Add item name and price to card body
    cardBody.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">${item.price}</p>
            </div>
        `;

    // Append card body to card
    card.appendChild(cardBody);

    // Append card to cart items container
    cartItemsContainer.appendChild(card);
  });
}

// Add click event listener to "Add to Cart" buttons
$(document).on("click", ".add-to-cart-btn", function () {
  // Retrieve the product ID from the data attribute
  var productId = $(this).data("product-id");

  // Send AJAX request to add product to cart
  $.ajax({
    url: "http://ec2-50-18-140-198.us-west-1.compute.amazonaws.com:3000/cart/add",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ productId: productId }),
    success: function (response) {
      // Handle success response
      alert("Product added to cart!");
      // Load cart items after adding a product to the cart
      loadCartItems();
    },
    error: function (xhr, status, error) {
      // Handle error response
      console.error("Error adding product to cart:", error);
    },
  });
});

function redirectToCart() {
  window.location.href = "./cart.html";
}

// Load cart items when the page loads
$(document).ready(function () {
  loadCartItems();
});
