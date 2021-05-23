

//window.onload = loadCartFunctionality;

//for testing only
/*window.onunload = function(){
	localStorage.clear();
}*/

/*function postCart() {
	let userJSON = window.localStorage.getItem('loggedInUser');

	if(userJSON != null) {
		let user = JSON.parse(userJSON);

		let request = new XMLHttpRequest();
		request.open("POST", "/user/cart/");
		request.setRequestHeader('Content-Type', "application/json");
		request.setRequestHeader('Authorization', "Bearer " + user.authToken);
		console.log(user.authToken);
		request.onreadystatechange = function () {
	  // In local files, status is 0 upon success in Mozilla Firefox
		  if(request.readyState === XMLHttpRequest.DONE) {
		    var status = request.status;
		    if (status === 0 || (status >= 200 && status < 400)) {
		      // The request has been completed successfully
					console.log(request.response);

		    } else {
		      // Oh no! There has been an error with the request!
					console.log(request.response);
		    }
		  }
		};

		request.send(localStorage.getItem('cart'));
	}

}*/

function getCart() {
	let userJSON = window.localStorage.getItem('loggedInUser');

	if(userJSON != null) {

		let user = JSON.parse(userJSON);

		let request = new XMLHttpRequest();
		request.open("GET", "/user/cart/");
		request.setRequestHeader('Content-Type', "application/json");
		request.setRequestHeader('Authorization', "Bearer " + user.authToken);
		request.responseType = "json";

		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE) {
		    var status = request.status;
		    if (status === 0 || (status >= 200 && status < 400)) {
		      // The request has been completed successfully
					console.log(request.response);
					localStorage.setItem('cart', JSON.stringify(request.response));

					if(localStorage.getItem('totalPrice') == null) {
						let price = 0;

						request.response.forEach((item, i) => {
							price += (item.price * item.quantity);
						});

						localStorage.setItem('totalPrice', price);
					}
		    } else if(status === 401){
					//We are not authorized - probably expired
		    	localStorage.removeItem('loggedInUser');
		    	window.location.replace('/pages/login.html');
		    }
				else {
					// Oh no! There has been an error with the request!
					console.log(request.response);
				}
			}
		};

		request.send();
	} else{
		let cart = [];
		localStorage.setItem('cart', JSON.stringify(cart));
	}
}

function loadCartFunctionality(){
	document.querySelector(".checkout-link").addEventListener('click', addProductToCart);
	if(localStorage.getItem('cart') == null){
		let cart = [];
		localStorage.setItem('cart',JSON.stringify(cart));
	}
	//Uncomment this next line when server is ready to send cart data
	getCart();
	renderCart();
}

function addProductToCart(e){
	let product = e.target.parentElement;
	storeProductInfoInCart(getIndividualProductInfo(product));
	//postCart();
	renderCart();
}

function getIndividualProductInfo(product){
	var productInfo ={
		image: product.querySelector("img").src,
		title: product.querySelector(".product-title").textContent.replace(/[\n\t]/g,''),
		price: parseFloat(product.querySelector(".product-price").textContent.replace(/[^0-9.]/g,''))
	};
	return productInfo;
}

function storeProductInfoInCart(productInfo){
	let cartEntry = {
		image: productInfo.image,
		title: productInfo.title,
		price: productInfo.price,
		quantity: 1
		};

	let userJSON = window.localStorage.getItem('loggedInUser');

	if(userJSON != null) {
		let user = JSON.parse(userJSON);

		let request = new XMLHttpRequest();
		request.open("POST", "/user/cart/add/");
		request.setRequestHeader('Content-Type', "application/json");
		request.setRequestHeader('Authorization', "Bearer " + user.authToken);
		request.responseType = 'json';
		console.log(user.authToken);
		request.onreadystatechange = function () {
	  // In local files, status is 0 upon success in Mozilla Firefox
		  if(request.readyState === XMLHttpRequest.DONE) {
		    var status = request.status;
		    if (status === 0 || (status >= 200 && status < 400)) {
		      // The request has been completed successfully
		    	localStorage.setItem('totalPrice',request.response.price);
				console.log(request.response);
		    }
				else if(status === 401){
		    	//We are not authorized - probably expired
		    	localStorage.removeItem('loggedInUser');
		    	window.location.replace('/pages/login.html');
					alert("Session has expired. Please login again");
		    }
				else {
		      // Oh no! There has been an error with the request!
					console.log(request.response);
		    }
		  }
		};

		request.send(JSON.stringify(cartEntry));
	} else{
		//user needs to be logged in to add to cart
		window.location.replace('/pages/login.html');
	}

	// let cart = JSON.parse(localStorage.getItem('cart'));
	// let index = cart.findIndex(p => p.title == productInfo.title);
	// if(index == -1){
	// 	// let cartEntry = {
	// 	// 	image: productInfo.image,
	// 	// 	title: productInfo.title,
	// 	// 	price: productInfo.price,
	// 	// 	quantity: 1
	// 	// };
	// 	cart.push(cartEntry);
	// 	localStorage.setItem('cart',JSON.stringify(cart));
	// } else {
	// 	cart[index].quantity++;
	// 	localStorage.setItem('cart',JSON.stringify(cart));
	// }
}

function renderCart(){
	let userJSON = window.localStorage.getItem('loggedInUser');

	if(userJSON != null) {

		let user = JSON.parse(userJSON);

		let request = new XMLHttpRequest();
		request.open("GET", "/user/cart/");
		request.setRequestHeader('Content-Type', "application/json");
		request.setRequestHeader('Authorization', "Bearer " + user.authToken);
		request.responseType = "json";

		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE) {
		    var status = request.status;
		    if (status === 0 || (status >= 200 && status < 400)) {
		      // The request has been completed successfully
					console.log(request.response);
					localStorage.setItem('cart', JSON.stringify(request.response));
					if(localStorage.getItem('totalPrice') == null) {
						let price = 0;

						request.response.forEach((item, i) => {
							price += (item.price * item.quantity);
						});

						localStorage.setItem('totalPrice', price);
					}
					displayCart();
		    } else if(status === 401){
					//We are not authorized - probably expired
		    	localStorage.removeItem('loggedInUser');
		    	window.location.replace('/pages/login.html');
		    }
				else {
					// Oh no! There has been an error with the request!
					console.log(request.response);
				}
			}
		};

		request.send();
	} else{
		let cart = [];
		localStorage.setItem('cart', JSON.stringify(cart));
		displayCart();
	}

}

function displayCart(){
	var shoppingCart = document.querySelector(".shopping-cart");
	HTMLString = '';
	HTMLString += '<div class="titlebox"><div class="title">Shopping Cart</div></div>';

	var cart = JSON.parse(localStorage.getItem('cart'));
	for(let cartItem of cart){
		HTMLString += renderCartItem(cartItem);
	}

	if(cart.length){
		let totalPrice = localStorage.getItem('totalPrice');
		HTMLString += '<div class="total_price">Total Price: $' + totalPrice + '</div>';
		HTMLString += '<div class="checkout"><a href = "/pages/checkout.html">Check Out</a></div>';
	} else{
		HTMLString += '<div class="checkout-null">Check Out</div>';
	}


	shoppingCart.innerHTML = HTMLString;
}

function renderCartItem(cartItem){
	let text = '';
	text += '<div class="item">';
	text += '<div class="image"><img src='+ cartItem.image +' alt=""></div>'
	text += '<div class="description"><span class = "product-name">' + cartItem.title + '</span></div>';
	text += '<div class="quantity">' + '<input type="text" value="'+ cartItem.quantity.toString() + '"></div>';
	let totalPrice = '$' + (cartItem.price * cartItem.quantity).toString();
	text += '<div class="pricing"><div class="total-price">' + totalPrice + '</div></div></div>';
	return text;
}

function emptyCart(){
	let emptyCart = [];
	localStorage.setItem('cart',JSON.stringify(emptyCart));
	postCart();
	renderCart();
}
