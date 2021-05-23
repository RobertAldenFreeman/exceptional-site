//window.onload = signUpOnLoad;

function signUpOnLoad(){
	//prepareUserInfo();
	loadSignUpButton();
}

function loadSignUpButton(){
	let signUp = document.querySelector('input[type="submit"]');
	signUp.addEventListener('click',signUpOnClick);
}

function loadLoginButton(){
	// if(localStorage.getItem('users') == null){
	// 	let users = [];
	// 	localStorage.setItem('users',JSON.stringify(users));
	// }
	let login = document.querySelector('input[type="submit"]');
	login.addEventListener('click',(e) =>{
		e.preventDefault();
		handleLogin();
	});

}

function signUpOnClick(e){
	e.preventDefault();
	handleSignup();
}

// function prepareUserInfo(){
// 	//for TESTING: MUST REMOVE
// 	window.localStorage.clear();
// 	//end testing
// 	if(window.localStorage.getItem('users') == null){
// 		let users = [];
// 		window.localStorage.setItem('users', JSON.stringify(users));
// 	}
//
// }

async function handleSignup(){
	let info = getSignupInfo();
	if(!validateSignup(info.email,info.password,info.rePassword)){
		return;
	}

	var formElement = document.querySelector(".form");

	var request = new XMLHttpRequest();
	request.open("POST", "/signup/");
	request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");

	request.onreadystatechange = function () {
  // In local files, status is 0 upon success in Mozilla Firefox
	  if(request.readyState === XMLHttpRequest.DONE) {
	    var status = request.status;
	    if (status === 0 || (status >= 200 && status < 400)) {
	      // The request has been completed successfully
	      console.log(request.responseText);
				window.location.replace('login.html');
	    } else {
	      // Oh no! There has been an error with the request!
				alert("Email is already registered!");
	    }
	  }
	};

	request.send(new URLSearchParams(new FormData(formElement)).toString());




	// let users = JSON.parse(window.localStorage.getItem('users'));
	// if(users.findIndex(p => info.email == p.email) != -1){
	// 	alert("A user with the email " + info.email + " already exists.");
	// 	return;
	// }
	// let hash = await hashUser(info.email,info.password);
	// let user = {
	// 	email: info.email,
	// 	hash: hash
	// };
	// users.push(user);
	// window.localStorage.setItem('users',JSON.stringify(users));

}

function getSignupInfo(){
	let form = document.querySelector('form');
	var signupInfo = {
		email: form.querySelector('input[name="email"]').value,
		password: form.querySelector('input[name="password"]').value,
		rePassword: form.querySelector('input[name="password2"]').value
	};
	return signupInfo;
}

function validateSignup(email,passwd, repasswd){
	let reEmail = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);

	if(!reEmail.test(email)){
		alert("That is an invalid email");
		return false;
	}
	if(passwd !== repasswd){
		alert("The passwords given do not match");
		return false;
	}
	if(passwd.length < 6){
		alert("A password must be at least 6 characters");
		return false;
	}
	return true;
}

async function hashUser(email,password){
	//let users = JSON.parse(window.localStorage.getItem('users'));
	//Do not EVER do any of this
	//Assume utf8 encoding

	let encoder = new TextEncoder();
	let combineData = encoder.encode(email + password);
	let hash = await window.crypto.subtle.digest('SHA-512',combineData);
	let hashedIntArray = Array.from(new Uint8Array(hash));
	let hashedHexString = hashedIntArray.map(h => h.toString(16).padStart(2,'0')).join('');
	return hashedHexString;
}


async function handleLogin(){
	// let users = JSON.parse(localStorage.getItem('users'));
	let info = getLoginInfo();

	// let hash = await hashUser(info.email,info.password);

	var formElement = document.querySelector(".form");

	var request = new XMLHttpRequest();
	request.open("POST", "/login/");
	request.responseType = "json";
	request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");

	request.onreadystatechange = function () {
  // In local files, status is 0 upon success in Mozilla Firefox
	  if(request.readyState === XMLHttpRequest.DONE) {
	    var status = request.status;
	    if (status === 0 || (status >= 200 && status < 400)) {
	      // The request has been completed successfully

				console.log(request.response);

				let loggedInUser = {
					email: info.email,
					authToken: request.response.access_token
				};

				localStorage.setItem( 'loggedInUser', JSON.stringify(loggedInUser) );

				renderLogin();

				window.location.replace('/index.html');
	    } else {
	      // Oh no! There has been an error with the request!
				alert("The username and password combination do not match our records");
	    }
	  }
	};

	request.send(new URLSearchParams(new FormData(formElement)).toString());

	// if(users.some(u => u.email == info.email && u.hash == hash)){
	// 	localStorage.setItem('loggedInUser',info.email);
	// 	renderLogin();
	// 	window.location.replace('/index.html');
	// } else {
	// 	alert("The username and password combination do not match our records");
	// }

}

function handleLogout(){
	localStorage.removeItem('loggedInUser');
	let cart = [];
	localStorage.setItem('cart',JSON.stringify(cart));
	var shoppingCart = document.querySelector(".shopping-cart");
	if(shoppingCart != null){
		HTMLString = '';
		HTMLString += '<div class="titlebox"><div class="title">Shopping Cart</div></div>';
		cart = JSON.parse(localStorage.getItem('cart'));
		for(let cartItem of cart){
			HTMLString += renderCartItem(cartItem);
		}

		if(cart.length){
			HTMLString += '<div class="checkout"><a href = "/pages/checkout.html">Check Out</a></div>';
		} else{
			HTMLString += '<div class="checkout-null">Check Out</div>';
		}

		shoppingCart.innerHTML = HTMLString;
	}

	//update page
	renderLogin();
}

function getLoginInfo(){
	let form = document.querySelector('form');
	let info = {
		email: form.querySelector('input[type="text"]').value,
		password: form.querySelector('input[type="password"]').value
	};
	return info;
}

function renderLogin(){
	let loginDiv = document.querySelector('div.nav-login');
	let userJSON = window.localStorage.getItem('loggedInUser');
	if(userJSON == null){
		loginDiv.innerHTML = '<a href="/pages/login.html">Login</a>';

	} else{
		let user = JSON.parse(userJSON).email;
		loginDiv.innerHTML = '<a href = "#top">' + user.substring(0, user.indexOf('@')) + '<br>Logout</a>';
		loginDiv.addEventListener('click',handleLogout);
	}

}
