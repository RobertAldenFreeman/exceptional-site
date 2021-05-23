
function cart_html_onload(){
	if(localStorage.getItem('cart') == null){
	let cart = [];
	localStorage.setItem('cart',JSON.stringify(cart));
	}
	renderLargeCart();
	//Uncomment this next line when server is ready to send cart data
	//getCart();
}

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
					displayLargeCart();
		    } else {
					//We are not authorized - probably expired
		    	localStorage.removeItem('loggedInUser');
		    	window.location.replace('/pages/login.html');
				alert("Session has expired. Please login again");
		    	}
			}
		};

		request.send();
	}
}

function loadCartButtons(){
	let delBtns = document.querySelectorAll('.delete-btn');
	for(let delBtn of delBtns){
		delBtn.addEventListener('click', deleteCartItem);
	}
	let plusBtns = document.querySelectorAll('.plus');
	for(let plusBtn of plusBtns){
		plusBtn.addEventListener('click',incrementCartItem);
	}
	let minusBtns = document.querySelectorAll('.minus',decrementCartItem);
	for(let minusBtn of minusBtns){
		minusBtn.addEventListener('click', decrementCartItem);
	}
}

function decrementCartItem(e){
	let cart = JSON.parse(localStorage.getItem('cart'));
	let minusBtn = e.target;
	let cartItem = minusBtn.parentElement.parentElement.parentElement;
	let name = cartItem.querySelector('.product-name').textContent;
	let index = cart.findIndex(p => p.title == name);

	if(cart[index].quantity > 0){
		cart[index].quantity--;
		localStorage.setItem('cart',JSON.stringify(cart));

		let userJSON = window.localStorage.getItem('loggedInUser');
		if(userJSON != null) {
			let user = JSON.parse(userJSON);
			let cartEntry = {
				image: cart[index].image,
				title: cart[index].title,
				price: cart[index].price,
				quantity: cart[index].quantity
			};

			let request = new XMLHttpRequest();
			request.open("POST", "/user/cart/decrement/");
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
					else if(status === 401) {
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
		}

		renderLargeCart();
	}
}

function incrementCartItem(e){
	let cart = JSON.parse(localStorage.getItem('cart'));
	let plusBtn = e.target;
	let cartItem = plusBtn.parentElement.parentElement.parentElement;
	let name = cartItem.querySelector('.product-name').textContent;
	let index = cart.findIndex(p => p.title == name);
	//cart[index].quantity++;
	//localStorage.setItem('cart',JSON.stringify(cart));

	let userJSON = window.localStorage.getItem('loggedInUser');
	if(userJSON != null) {
		let user = JSON.parse(userJSON);
		let cartEntry = {
			image: cart[index].image,
			title: cart[index].title,
			price: cart[index].price,
			quantity: cart[index].quantity
		};

		let request = new XMLHttpRequest();
		request.open("POST", "/user/cart/add/");
		request.setRequestHeader('Content-Type', "application/json");
		request.setRequestHeader('Authorization', "Bearer " + user.authToken);
		request.responseType = 'json';
		//console.log(user.authToken);
		request.onreadystatechange = function () {
	  // In local files, status is 0 upon success in Mozilla Firefox
		  if(request.readyState === XMLHttpRequest.DONE) {
		    var status = request.status;
		    if (status === 0 || (status >= 200 && status < 400)) {
		      // The request has been completed successfully
		    	localStorage.setItem('totalPrice',request.response.price);
				console.log(request.response);
		    }
				else if(status === 401) {
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
	}

	renderLargeCart();
}

//e is the event of delete being clicked
function deleteCartItem(e){
	let delBtn = e.target;
	let cartItem = delBtn.parentElement.parentElement;
	let cart = JSON.parse(localStorage.getItem('cart'));
	let name = cartItem.querySelector('.product-name').textContent;
	let index = cart.findIndex(p => p.title == name);

	let userJSON = window.localStorage.getItem('loggedInUser');
	if(userJSON != null) {
		let user = JSON.parse(userJSON);
		let cartEntry = {
			image: cart[index].image,
			title: cart[index].title,
			price: cart[index].price,
			quantity: cart[index].quantity
		};

		let request = new XMLHttpRequest();
		request.open("POST", "/user/cart/remove/");
		request.setRequestHeader('Content-Type', "application/json");
		request.setRequestHeader('Authorization', "Bearer " + user.authToken);
		request.responseType = 'json';
		//console.log(user.authToken);
		request.onreadystatechange = function () {
	  // In local files, status is 0 upon success in Mozilla Firefox
		  if(request.readyState === XMLHttpRequest.DONE) {
		    var status = request.status;
		    if (status === 0 || (status >= 200 && status < 400)) {
		      // The request has been completed successfully
		    	localStorage.setItem('totalPrice',request.response.price);
				console.log(request.response);
		    }
				else if(status === 401) {
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
	}

	cart.splice(index,1);//delete the offending item
	localStorage.setItem('cart',JSON.stringify(cart));
	renderLargeCart();
}

function renderLargeCart(){
	getCart();
}

function displayLargeCart(){
	var shoppingCart = document.querySelector(".shopping-cart");
	HTMLString = '';
	HTMLString += '<div class="titlebox"><div class="title">Shopping Cart</div></div>';

	var cart = JSON.parse(localStorage.getItem('cart'));
	for(let cartItem of cart){
		HTMLString += renderLargeCartItem(cartItem);
	}

	if(cart.length){
		let totalPrice = localStorage.getItem('totalPrice');
		HTMLString += '<div class="total_price">Total Price: $' + totalPrice + '</div>';
		HTMLString += '<div class="checkout"><a href = "/pages/checkout.html">Check Out</a></div>';
	} else{
		HTMLString += '<div class="checkout-null">Check Out</div>';
	}


	shoppingCart.innerHTML = HTMLString;

	loadCartButtons();
}

function renderLargeCartItem(cartItem){
	let text = '';
	text += '<div class="item">';
	text += '<div class="buttons"><input class="delete-btn btn" type="image" src="../images/icons8-delete-50.png"></div>';
	text += '<div class="image"><img src="'+ cartItem.image + '" alt=""></div>';
	text += '<div class="description"><span class = "product-name">'+ cartItem.title + '</span></div>';
	//<span class = "product-description">DESCRIPTION - Would need from product page</span>
	text += '<div class="amount"><div class="quantity"><input type="image" class="plus btn" src="../images/icons8-plus-math-50.png">';
	text += '<input type="text" value="'+ cartItem.quantity + '">';
	text += '<input type="image" class="minus btn" src="../images/icons8-subtract-50.png"></div>';
	let totalPrice = '$' + (cartItem.price * cartItem.quantity).toString();
	text += '<div class="pricing"><div class="total-price">' + totalPrice + '</div></div></div></div>';
	return text;
}

function emptyCart(){
	let emptyCart = [];
	localStorage.setItem('cart',JSON.stringify(emptyCart));
	renderCart();
}

/*

<div class="item">
				<div class="buttons">
					<input class="delete-btn btn" type="image" src="../images/icons8-delete-50.png">
				</div>
				<div class="image"><img src="../images/grandAutoThiefCopy.jpeg" alt=""></div>
				<div class="description">
					<span class = "product-name">Grand Auto Thief</span>
					<span class = "product-description">Steal Cars</span>
				</div>
				<div class="amount">
					<div class="quantity">
						<input type="image" class="plus btn" src="../images/icons8-plus-math-50.png">
						<input type="text" value="1">
						<input type="image" class="minus btn" src="../images/icons8-subtract-50.png">
					</div>
					<div class="pricing">
						<div class="total-price">
						$315
						</div>
					</div>
				</div>
			</div>


*/
