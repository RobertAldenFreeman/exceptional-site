var checkoutPanel = document.getElementsByClassName('checkoutPanel');
var isReviewing = false;

function handleCheckout() {

	let userJSON = localStorage.getItem('loggedInUser');
	if(userJSON != null) {

	let user = JSON.parse(userJSON);
    // let checkoutInfo = getCheckoutInfo();
  	// if(!validateCheckout()){
  	// 	alert("Invalid Checkout -1");
  	// 	return;
  	// }

  	var formElement = document.querySelector(".form");

  	var request = new XMLHttpRequest();
  	request.open("POST", "/user/checkout/");
  	request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
    request.setRequestHeader('Authorization', "Bearer " + user.authToken);
		request.responseType = 'json';

  	request.onreadystatechange = function () {
    	// In local files, status is 0 upon success in Mozilla Firefox
  	  if(request.readyState === XMLHttpRequest.DONE) {
  	    var status = request.status;
  	    if (status === 0 || (status >= 200 && status < 400)) {
  	      // The request has been completed successfully
			console.log(request.response);
			let cart = [];
			localStorage.setItem('cart', JSON.stringify(cart));
			localStorage.setItem('checkoutResponse', JSON.stringify(request.response));
			alert('Your order is being processed. Thank you for shopping at the Exceptional Store!');
  			window.location.replace('/index.html');
  	    } else {
  	      // Oh no! There has been an error with the request!
  				alert("Checkout Failed");
  	    }
  	  }
  	};
		console.log(new URLSearchParams(new FormData(formElement)).toString());
    request.send(new URLSearchParams(new FormData(formElement)).toString());
 } else {
	 window.location.replace('/pages/login.html');
 }

}

function reviewOrder() {
  // let inputList = checkoutPanel[0].querySelectorAll('input[type = "text"]');
  // let title = document.getElementsByClassName("title");
  // let backButton = document.getElementById("backButton");
  // let checkoutButton = document.getElementsByClassName("checkoutBtn");
	// let finalizeButton = document.getElementById("finalizeButton");

  if(validateCheckout()) {
		handleCheckout();
      // title[0].innerHTML = 'Review';
  		//
  		//
  		//
      // checkoutPanel[0].style.gridTemplateAreas = '"title title" "column1 column2" "button1 button"';
  		//
      // backButton.innerHTML = '<input type="submit" value="Back" class="btn" onclick="backToEditMode(); return false;">';
      // backButton.style.gridTemplateArea = 'button1';
  		//
      // checkoutButton[0].innerHTML = "";
  		// finalizeButton.innerHTML = '<input type="submit" value="Finalize your order" class="btn">';
  		// finalizeButton.style.gridTemplateArea = 'button';
  		//
  		// finalizeButton.addEventListener('click', (e) => {
  		// 	e.preventDefault();
  		// 	handleCheckout();
  		// });
  		//
      // isReviewing = true;
  }
}

// function backToEditMode() {
//   let inputList = checkoutPanel[0].querySelectorAll('input[type = "text"]');
//   let checkBox = checkoutPanel[0].querySelector('input[type = "checkbox"]');
//   let title = document.getElementsByClassName("title");
//   let backButton = document.getElementById("backButton");
//   let checkoutButton = document.getElementsByClassName("checkoutBtn");
// 	let finalizeButton = document.getElementById("finalizeButton");
//
//   title[0].innerHTML = 'Checkout';
//
//   checkoutPanel[0].style.gridTemplateAreas = '"title title" "column1 column2" "button1 button"';
//
//   inputList.forEach(element => element.classList.remove('finalized') );
//   inputList.forEach(element => element.removeAttribute('readonly') );
//   checkBox.removeAttribute('disabled');
//
//   backButton.innerHTML = '';
//
//   checkoutButton[0].innerHTML = '<input type="submit" value="Review your order" class="btn" onclick="reviewOrder(); return false;">';
// 	finalizeButton.innerHTML = "";
//
//   isReviewing = false;
// }

function getCheckoutInfo(){
  let form = document.querySelector('form');
  var checkoutInfo = {
    //Payment Column
    creditName: form.querySelector('input[name="cardname"]').value,
    ccNum: form.querySelector('input[name="cardnumber"]').value,
    expiry: form.querySelector('input[name="expmonth"]').value,
    cvv: form.querySelector('input[name="cvv"]').value,

    //Billing Address
    fullName: form.querySelector('input[name="firstname"]').value,
    //^Note that name="firstname" is just to adhere to checkout.html nomenclature
    email: form.querySelector('input[name="email"]').value,
    address: form.querySelector('input[name="address"]').value,
    city: form.querySelector('input[name="city"]').value,
    state: form.querySelector('input[name="state"]').value,
    zip: form.querySelector('input[name="zipCode"]').value
  };
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
  let checkoutInfo = getCheckoutInfo();

  let alertString = "";
  let badValidation = false;

  //Will work for static information
  let cardNameValid = /^[a-z ,.'-]+$/i;
  let ccNumIsValid = ValidateCreditCardNumber(checkoutInfo.ccNum);
  let expValid = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  let cvvIsValid = /^[0-9]{3,4}$/;

  //Will work for both shipping and billing
  let nameValid = /^[a-z ,.'-]+$/i;
  let reEmail = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
  //let addressIsValid = /^[a-zA-Z0-9\s,.'-]*$/;
  let addressIsValid = /^.+$/; //breaks
  let cityIsValid = /^.+$/; //breaks
  let stateIsValid = /^.+$/; //breaks
  let zipIsValid = /^\d{5}$/;

  //Payment always validated
  if(!cardNameValid.test(checkoutInfo.creditName)){
    //alert("Invalid credit card number");
    alertString += "Invalid credit card name. ";
    badValidation = true;
    //return false;
  }
  if(!ccNumIsValid){
    //alert("Invalid credit card information");
    alertString += "Invalid credit card number. ";
    badValidation = true;
    //return false;
  }
  if(!expValid.test(checkoutInfo.expiry)){
    //alert("Invalid expiration");
    alertString += "Invalid expiration. ";
    badValidation = true;
    //return false;
  }
  if(!cvvIsValid.test(checkoutInfo.cvv)){
      //alert("Invalid cvv");
      alertString += "Invalid cvv. ";
      badValidation = true;
      //return false;
  }

  //Add billing
  if(!nameValid.test(checkoutInfo.fullName)){
    //alert("Invalid name");
    //return false;
    alertString += "Invalid address name. ";
    badValidation = true;
  }
  if(!reEmail.test(checkoutInfo.email)){
    alertString += "That is an invalid email. ";
    badValidation = true;
  }
  if(!addressIsValid.test(checkoutInfo.address)){
    //alert("Invalid address, must be at least 3 characters long");
    alertString += "Invalid address. ";
    badValidation = true;
    //return false;
  }
  if(!cityIsValid.test(checkoutInfo.city)){
    //alert("Invalid city");
    //return false;
    alertString += "Invalid city. ";
    badValidation = true;
  }
  if(!stateIsValid.test(checkoutInfo.state)){
    //alert("Invalid state");
    //return false;
    alertString += "Invalid state. ";
    badValidation = true;
  }
  if(!zipIsValid.test(checkoutInfo.zip)){
    //alert("Invalid ZIP code");
    //return false;
    alertString += "Invalid ZIP code. ";
    badValidation = true;
  }

  if(badValidation){
    alert(alertString);
  }
  return !badValidation;
}
