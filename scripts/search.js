/*const searchButton = document.getElementsByClassName("searchButton");
const searchQuery = document.getElementsByClassName("searchQuery");

searchButton[0].addEventListener("click", searchDetected);
searchQuery[0].addEventListener("keyup", (e) => {
  //if key pressed is enter
  if(e.which == 13 || e.keyCode == 13) {
    searchDetected();
  }
});

function searchDetected() {
  console.log(searchQuery[0].value);
}*/

function loadSearchBar(){
	const searchButton = document.querySelector(".searchButton");
	const searchQuery = document.querySelector(".searchQuery");
	searchButton.addEventListener('click', search);
	searchQuery.addEventListener("keyup", (e) => {
	  //if key pressed is enter
	  if(e.which == 13 || e.keyCode == 13) {
	    searchEnter(e);
	  }
	})

}

function searchEnter(e) {
	e.preventDefault();

	let queryText = document.querySelector(".searchQuery").value;

	let products = JSON.parse(localStorage.getItem('productInfo'));

	let text = '';


	let filteredProducts = products.filter(p => p.title.includes(queryText));

	if(filteredProducts.length){
		localStorage.setItem('searchResult',JSON.stringify(filteredProducts));
		window.location.replace('/pages/searchPage.html');
	} else{
		alert("Your search returned no results.");
	}
}

function search(e){
	e.preventDefault();
	let queryText = e.target.parentElement.parentElement.querySelector('input').value;
	let products = JSON.parse(localStorage.getItem('productInfo'));

	let text = '';


	let filteredProducts = products.filter(p => p.title.includes(queryText));

	if(filteredProducts.length){
		localStorage.setItem('searchResult',JSON.stringify(filteredProducts));
		window.location.replace('/pages/searchPage.html');
	} else{
		alert("Your search returned no results.");
	}

}

function renderSearchPage(){
	let products = JSON.parse(localStorage.getItem('searchResult'));
	let mainArea = document.querySelector(".grid-container");
	let text = '';
	for(let product of products){
		text += renderProduct(product);
	}
	mainArea.innerHTML = text;
}

function renderProduct(product){
	let text = '<div>';
	text += '<a href="' + product.link + '">';
	text += '<div class="polaroid">';
	text += '<img src="'+ product.image + '" alt="Image not found. Oops!" style="width:100%;">';
	text += '<div class="container">';
	text += '<p>' + product.title + '</p>';
	text += '</div></div></a></div>';
	return text;

	/*
	<div class="Product1">
				<a href="products/product1.html">
					<div class="polaroid">
						<img src="../images/runner.jpeg" alt="Image not found. Oops!" style="width:100%;" onclick=>
						<div class="container">
							<p>Run, Escape</p>
						</div>
					</div>
				</a>
			</div>

	*/
}




function getProductInfo(){
	if(localStorage.getItem('productInfo') == null){
		//window.location.replace('/pages/productsPage.html');
		let productNodes = document.querySelectorAll(".grid-container > div");
		let products = [];
		for(let productNode of productNodes){
			let info = {
				image: productNode.querySelector("img").src,
				link: productNode.querySelector("a").href,
				title: productNode.querySelector("p").textContent,
			};
			products.push(info);
		}
		localStorage.setItem('productInfo',JSON.stringify(products));
		return products;
	}
	else{
		return JSON.parse(localStorage.getItem('productInfo'));
	}
}
