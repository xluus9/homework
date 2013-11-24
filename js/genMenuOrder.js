// doc ready function
// for Dawg Pizza Website
$(function(){
	// opens a modal for the menu page
	// when the 'Our Menu' button is clicked
	$('.menu-button').click(function(){
		var detail = $('.menu-detail');
		// calls the renderMenu function and sets isMenu to true
		// which creates a menu with description
		renderMenu(com.dawgpizza.menu, true);
		detail.modal();
	});

	// opens a modal for the order page
	// when the 'Order Online' button is clicked
	$('.order-button').click(function(){
		var order = $('.order-detail');
		// calls the renderMenu function and sets isMenu to false
		// which creates an order page with buttons
		renderMenu(com.dawgpizza.menu, false);
		order.modal();
	});

	// creates a cartModel that stores the items
	// in the cart
	var cartModel = createCartModel();

	// creates several form variables
	// required for submission
	var name;
	var address1;
	var address2;
	var zip;
	var phone;

	// uses localStorage to store both addresses
	// and items in the cart
	var storedAddress1 = localStorage.getItem('address1');
	var storedAddress2 = localStorage.getItem('address2');
	var cartJSON = localStorage.getItem('cart');

	// checks if either address is stored and fills the values
	// in appropriate text box
	if (storedAddress1 && storedAddress1.length > 0) {
		$('.form-info').find('input[name="address1"]').val(storedAddress1);
	}
	if (storedAddress2 && storedAddress2.length > 0) {
		$('.form-info').find('input[name="address2"]').val(storedAddress2);
	}

	// creates a cart view for the shopping cart
	var cartView = createCartView({
		model: cartModel,
		template: $('.cart-item-template'),
		container: $('.cart-items-container'),
		totalPrice: $('.total-price'),
		taxPrice: $('.tax-price'),
		grandTotal: $('.grand-price')
	});

	var quantity;
	var items = {};

	// an on click event that adds the item that is clicked
	// into the cart view which is the user's cart list
	$('.pizza').on('click', '.add-to-cart', function(){
		// grabs the data-type, data-name, and data-price of clicked button
		var type = this.getAttribute('data-type');
		var name = this.getAttribute('data-name');
		var price = parseInt(this.getAttribute('data-price'));

		// quantity is set for the drinks and desserts
		// initially quantity is 1
		var quantity = 1;

		// checks if the data-type of the button is equal to pizza
		// if it is, it will set the object's type, name, size, and price
		// to the same attributes as the button clicked
		if (type == 'pizza') {
			items = {
				type: type,
				name: name,
				size: this.getAttribute('data-size').toLowerCase(),
				price: price				
			};
			cartModel.addItem(items);
		} else {
			// if it is not a pizza, then it must be a drink or dessert
			// then it will go through the current list of items in the cartModel
			// and check if the drink/dessert is already in there
			// if it is, the quantity will be increased instead of adding
			// a new item to the list
			if (cartModel.getItems().length > 0) {
				for (var i = 0; i < cartModel.getItems().length; i++) {
					// checks if the item is a drink or dessert
					if (cartModel.items[i].type == 'drink' || cartModel.items[i].type == 'dessert') {
						// if the name of the item in the cart is equal to the data-name of the button clicked
						if (cartModel.items[i].name == name) {
							// quantity is increased by one
							quantity = cartModel.items[i].quantity + 1;
							// price is increased by its current price plus its original price
							price = cartModel.items[i].price + parseInt(price);
							// removes it from the cart and is placed back in later in code
							cartModel.removeItem(cartModel.items[i]);
							break;
						} else {
							// if the drink/dessert is not already in the cartModel
							// quantity is changed back to 1 and price is the price
							// of the drink/dessert
							quantity = 1;
							price = parseInt(this.getAttribute('data-price'));
						}
					}
				}
			}
			// adds the drink/dessert into the cart
			// with appropriate type, name, quantity, and price
			items = {
				type: type,
				name: name,
				quantity: quantity,
				price: price
			};
			cartModel.addItem(items);
		}
	});

	// grabs the previous order the user has submitted
	// when the 'Previous Order' button is clicked
	$('.previous-order').click(function(){
		// changes the items of the cartModel to previously
		// submitted items
		cartModel.setItems(JSON.parse(cartJSON));
	});

	// grabs all the user input information and items in the current
	// cartModel and submits it to a server-side page
	// when the 'Place My Order' button is clicked
	$('.place-order').click(function(){
		// grabs the formInfo element
		var formInfo = $('.form-info');
		// finds the input with name, address 1, address 2 and stores the value of that into the variable
		var name = formInfo.find('input[name="name"]').val();
		var address1 = formInfo.find('input[name="address1"]').val();
		var address2 = formInfo.find('input[name="address2"]').val();
		// stores address1 and address2 into a localStorage used for later purchases
		localStorage.setItem('address1', address1);
		localStorage.setItem('address2', address2);
		// find the input with zip and phone and stores the value
		var zip = formInfo.find('input[name="zip"]').val();
		var phone = formInfo.find('input[name="phonenumber"]').val();
		var alertDiv = $('.alert-div');

		// checks if the grandTotal is greater than $20
		// also checks if name, address1, zip, and phone text boxes
		// are filled out
		if (cartModel.getGrandTotal() > 20.00 && name.length > 0 && address1.length > 0 && zip.length > 0 && phone.length > 0) {
			alertDiv.empty();
			// creates an object shopping cart which will be submitted
			// to server-side page
			var shoppingCart = {
				name: name,
				address1: address1,
				address2: address2,
				zip: zip,
				phone: phone,
				items: cartModel.getItems()
			};
			// turns the object into json
			var json = JSON.stringify(shoppingCart);

			// submits the hidden cart to the server-side-page
			$('.data-submit').submit(function(){
				var hiddenCart = $('.data-submit').find('input[name="cart"]');
				// changes value of hidden cart to the json shopping cart
				hiddenCart.val(json);
			});
			// locally stores the items submitted in the current cartModel
			localStorage.setItem('cart', cartModel.toJSON());
			// deletes all items in the cartModel and sets all quantities back to 1
			cartModel.setItems([]);
			quantity = 1;
		} else {
			// if the grand total is not greater than $20 or
			// the required information is not filled out
			if (cartModel.getGrandTotal() < 20.00) {
				// if grandTotal is not > $20 then it will create a div
				// displayed in red notifying customers that orders
				// must be above $20
				alertDiv.html('Orders Must be above $20.00');
				return false;
			}
			if (name.length == 0 || address1.length == 0 || zip.length == 0 || phone.length == 0) {
				// if either name, address1, zip, or phone is not filled out
				// it will alert the customer with an alert box
				alert('Your full name, address, zip, and phone are required.');
				return false;
			}
		}
	});

	// changes the quantity back to 1 and deletes all items
	// in the current cartModel
	// when the 'Clear My Order' button is clicked
	// clears the user's whole cart
	$('.start-over').click(function(){
		quantity = 1;
		cartModel.setItems([]);
	});
}); //doc ready

//function renders all the pizzas, drinks, and desserts
//boolean determines whether or not it is a menu
//or an order list -true: menu -false: order list
function renderMenu(data, isMenu) {
	var pTemplate = $('.pizza-list');
	var meatList = $('.meat-list');
	var veggieList = $('.veggie-list');
	var drinkList = $('.drink-list');
	var dessertList = $('.dessert-list');

	// empties out the lists
	meatList.empty();
	veggieList.empty();
	drinkList.empty();
	dessertList.empty();

	// goes through the pizza array and creates
	// list of pizzas
	$.each(data.pizzas, function(){
		var pClone = pTemplate.clone();

		pClone.find('.name').html(this.name);
		// if isMenu is true, it is a menu and will create a page
		// that shows the name, price, and description of each pizza
		if (isMenu === true) {
			pClone.find('.prices').html('($' + this.prices[0] + '/$' + this.prices[1] + '/$' + this.prices[2] + ')');
			pClone.find('.description').html(this.description);
		} else {
			// if it is not true, then it will create a page
			// with the names, and a button for each size
			// that the user will be able to click on

			// an array of sizes that go with each price
			// sizes[0] = prices[0]
			var sizes = [
				'Small',
				'Medium',
				'Large'
			];

			// loops over the 3 prices and creates a button for each price
			// the button's html, class, and attributes get set
			for (var i = 0; i < this.prices.length; i++) {
				var button = $(document.createElement('button'));
				button.html(sizes[i] + '($' +this.prices[i] + ')');
				button.addClass('add-to-cart');
				button.attr('type', 'button');
				button.attr('data-type', this.type);
				button.attr('data-name', this.name);
				button.attr('data-size', sizes[i]);
				button.attr('data-price', this.prices[i]);

				pClone.append(button);
			}
		}

		pClone.removeClass('pizza-list');
		// checks if the pizza is a vegetarian pizza
		// and appends it to appropriate list
		if (this.vegetarian) {
			veggieList.append(pClone);
		} else {
			meatList.append(pClone);
		}
	});

	//creates list of drinks
	createDList(data.drinks, drinkList, isMenu);
	//creates list of desserts
	createDList(data.desserts, dessertList, isMenu);
	
}

// function that helps create a list of drinks/dessert
function createDList(item, list, isMenu) {
	var dTemplate = $('.item-list');

	$.each(item, function(){
		var dClone = dTemplate.clone();

		// if isMenu is true, it is a menu and will create a page
		// that shows the name and price of each drink/dessert
		if (isMenu === true) {
			dClone.find('.item-name').html(this.name + '($' + this.price + ')');
		} else {
			// if not, it will show the name and a button that is associated
			// with each drink/dessert
			// the html, class, and attributes of the button is set
			dClone.find('.item-name').html(this.name + " ");
			var dButton = $(document.createElement('button'));
			dButton.html('Buy for $' + this.price);
			dButton.addClass('add-to-cart');
			dButton.attr('type', 'button');
			dButton.attr('data-type', this.type);
			dButton.attr('data-name', this.name);
			dButton.attr('data-quantity', '1');
			dButton.attr('data-price', this.price);

			dClone.find('.item-name').append(dButton);
		}

		dClone.removeClass('item-list');
		list.append(dClone);
	});	
}
