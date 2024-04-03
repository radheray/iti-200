// $(document).ready(function () {
//     // Function to handle search button click
//     $("#searchButton").click(function () {
//         var searchString = $("#search").val();
//         searchProducts(searchString);
//     });
// });


// // Function to send search request to the backend
// function searchProducts(searchString) {
//     $.ajax({
//         type: "POST",
//         url: "http://localhost:3000",
//         contentType: "application/json",
//         data: JSON.stringify({ searchString: searchString }),
//         success: function (response) {
//             displayResults(response);
//         },
//         error: function (xhr, status, error) {
//             console.error("Error:", error);
//         }
//     });
// }

// Function to display search results
function callApi() {
    var searchString = document.getElementById("search").value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            console.log("respose :",response);
            displayResults(response);
            

        }
    };
    var data = JSON.stringify({ searchString: searchString });
    xhr.send(data);
}




function displayResults(response) {
    var searchResultsDiv = $("#searchResults");
    searchResultsDiv.empty();
    if (response.data.length === 0) {
        searchResultsDiv.html(response.message);
    } else {
        $.each(response.data, function (index, product) {
            var productHtml = `
            <div class="container mt-5">
            <div class="row" id="suggestedLiquors">
                <!-- Suggested liquors will be dynamically appended here -->
                <div class="col-md-3 mb-4">
                    <div class="card">
                        <img src="${product.pic}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.price}</p>
                            <a href="product.html" class="btn btn-primary" onclick="callApi()"  >View more</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            `;
            searchResultsDiv.append(productHtml);
        });
    }
}








