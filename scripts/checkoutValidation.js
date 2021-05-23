function getCheckoutInfo(){
	let form = document.querySelector('form');
		if(!addressCheckboxChecked){
			let checkoutInfo = {
				//Payment Column
				creditName: form.querySelector('input[name="cardname"]').value,
				ccNum: form.queryselector('input[name="cardnumber"]').value,
				expiry: form.queryselecotr('input[name="expmonth"]').value,
				cvv: form.queryselector('input[name="cvv"]').value,
				
				//Billing Address
				fullName: form.queryselector('input[name="firstname"]').value,
				//^Note that name="firstname" is just to adhere to checkout.html nomenclature
				email: form.queryselector('input[name="email"]').value,
				address: form.queryselector('input[name="address"]').value,
				city: form.queryselector('input[name="city"]').value,
				state: form.queryselector('input[name="state"]').value,
				zip: form.queryselector('input[name="zip"]').value
			};
		}
		else{
			let checkoutInfo = {

				//Payment Column
				creditName: form.querySelector('input[name="cardname"]').value,
				ccNum: form.queryselector('input[name="cardnumber"]').value,
				expiry: form.queryselecotr('input[name="expmonth"]').value,
				cvv: form.queryselector('input[name="cvv"]').value,

				//Billing Address
				fullName: form.queryselector('input[name="firstname"]').value,
				//^Note that name="firstname" is just to adhere to checkout.html nomenclature
				email: form.queryselector('input[name="email"]').value,
				address: form.queryselector('input[name="address"]').value,
				city: form.queryselector('input[name="city"]').value,
				state: form.queryselector('input[name="state"]').value,
				zip: form.queryselector('input[name="zip"]').value,

				//Shipping
				fullName2: form.queryselector('input[name="firstname"]').value,
				email2: form.queryselector('input[name="email"]').value,
				address2: form.queryselector('input[name="address"]').value,
				city2: form.queryselector('input[name="city"]').value,
				state2: form.queryselector('input[name="state"]').value,
				zip2: form.queryselector('input[name="zip"]').value
		}
	return checkoutInfo;
}

function ValidateCreditCardNumber(ccNum) {

  var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
  var amexpRegEx = /^(?:3[47][0-9]{13})$/;
  var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
  var isValid = false;

  if (visaRegEx.test(ccNum)) {
    isValid = true;
  } else if(mastercardRegEx.test(ccNum)) {
    isValid = true;
  } else if(amexpRegEx.test(ccNum)) {
    isValid = true;
  } else if(discovRegEx.test(ccNum)) {
    isValid = true;
  }

  return isValid;
}

function validateCheckout(){
	

	var checkoutInfo = getCheckoutInfo();

	//Will work for static information
  let cardNameValid = /^[a-z ,.'-]+$/i;
  let ccNumIsValid = ValidateCreditCardNumber(checkoutInfo.ccNum);
  let expValid = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  let cvvIsValid = /^[0-9]{3,4}$/;

  //Will work for both shipping and billing
  let nameValid = /^.*$/;
  let reEmail = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
  let addressIsValid = /^[a-zA-Z0-9\s,.'-]*$/;
  let cityIsValid = /^.*$/;
  let stateIsValid = /^.*$/;
  let zipIsValid = /^\d{5}$/;

	if(!cardNameValid.test(checkoutInfo.creditName)){
		alert("Invalid credit card number");
		return false;
	}
	if(!ccNumIsValid){
		alert("Invalid credit card information");
		return false;
	}
	if(!expValid.test(checkoutInfo.expiry)){
		alert("Invalid expiration");
		return false;
	}
	if(!cvvIsValid.test(checkoutInfo.cvv)){
    	alert("Invalid cvv");
    	return false;
  	}
  	//Display only payment and billing if box isn't checked
	if(!addressCheckboxChecked){

		if(!nameValid.test(checkoutInfo.fullName)){
			alert("Invalid name");
			return false;
		}
		if(!reEmail.test(checkoutInfo.email)){
			alert("That is an invalid email");
			return false;
		}

	  	if(!addressIsValid.test(checkoutInfo.address)){
	  		alert("Invalid address, must be at least 3 characters long");
	  		return false;
	  	}
	  	if(!cityIsValid.test(checkoutInfo.city)){
	  		alert("Invalid city");
	  		return false;
	  	}
	  	if(!stateIsValid.test(checkoutInfo.state)){
	  		alert("Invalid state");
	  		return false;
	  	}
	  	if(!zipIsValid.test(checkoutInfo.zip)){
	  		alert("Invalid ZIP code");
	  		return false;
	  	}
  	} else{
  		//Add Shipping info validation as well as billing

  		//Billing
  		if(!nameValid.test(checkoutInfo.fullName)){
			alert("Invalid name");
			return false;
		}
		if(!reEmail.test(checkoutInfo.email)){
			alert("That is an invalid email");
			return false;
		}

	  	if(!addressIsValid.test(checkoutInfo.address)){
	  		alert("Invalid address, must be at least 3 characters long");
	  		return false;
	  	}
	  	if(!cityIsValid.test(checkoutInfo.city)){
	  		alert("Invalid city");
	  		return false;
	  	}
	  	if(!stateIsValid.test(checkoutInfo.state)){
	  		alert("Invalid state");
	  		return false;
	  	}
	  	if(!zipIsValid.test(checkoutInfo.zip)){
	  		alert("Invalid ZIP code");
	  		return false;
	  	}

	  	//Shipping
	  	if(!nameValid.test(checkoutInfo.fullName2)){
			alert("Invalid name");
			return false;
		}
		if(!reEmail.test(checkoutInfo.email2)){
			alert("That is an invalid email");
			return false;
		}

	  	if(!addressIsValid.test(checkoutInfo.address2)){
	  		alert("Invalid address, must be at least 3 characters long");
	  		return false;
	  	}
	  	if(!cityIsValid.test(checkoutInfo.city2)){
	  		alert("Invalid city");
	  		return false;
	  	}
	  	if(!stateIsValid.test(checkoutInfo.state2)){
	  		alert("Invalid state");
	  		return false;
	  	}
	  	if(!zipIsValid.test(checkoutInfo.zip2)){
	  		alert("Invalid ZIP code");
	  		return false;
	  	}

  	}

	return true;
}




async function handleCheckout(){
	var checkoutInfo = getCheckoutInfo();
	if(!validateCheckout()){
		alert("Invalid Checkout -1");
		return;
	}

	var formElement = document.querySelector(".form");

	var request = new XMLHttpRequest();
	request.open("POST", "/checkout/");
	request.responseType = "json";
	request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
	request.onreadystatechange = function () {
  	// In local files, status is 0 upon success in Mozilla Firefox
	  if(request.readyState === XMLHttpRequest.DONE) {
	    var status = request.status;
	    if (status === 0 || (status >= 200 && status < 400)) {
	      // The request has been completed successfully

				console.log(request.response);

				let checkoutInfo = getCheckoutInfo();

				localStorage.setItem( 'loggedInUser', JSON.stringify(checkoutInfo));

				renderLogin();

				window.location.replace('/index.html');
	    } else {
	      // Oh no! There has been an error with the request!
				alert("The username and password combination do not match our records");
	    }
	  }
	};
	
}


/*
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
*/
