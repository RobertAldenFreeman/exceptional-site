
function test(){
	localStorage.clear();
	console.log(getProductInfo());
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


