/*
    createCartModel()

    Creates a model for the shopping cart. This uses the ListModel
    as the prototype, but adds a few specific methods.

    The config parameter can contain the following properties:
    - items (array of objects) initial items for the cart (optional)
*/

//creates model for shopping cart
function createCartModel(config) {
	var model = createListModel(config);

	// getTotalPrice function that adds up the prices in the cart
	model.getTotalPrice = function() {
		var idx;
		var totalPrice = 0;
		// loops through the items in the cart
		// and finds adds up the price to get the total price
		for (idx = 0; idx < this.items.length; idx++) {
			totalPrice += parseInt(this.items[idx].price);
		}
		return totalPrice.toFixed(2);
	};

	// uses the total price to find the tax
	model.getTaxPrice = function() {
		var taxPrice = model.getTotalPrice() * .095;
		return taxPrice.toFixed(2);
	}

	// method to find the grand total by using
	// the total price and the tax
	model.getGrandTotal = function() {
		var grandTotal = parseInt(model.getTotalPrice()) + parseFloat(model.getTaxPrice());
		return grandTotal.toFixed(2);
	}

	// toJSON returns a JSON representation of the cart items
	model.toJSON = function() {
		return JSON.stringify(this.items);
	};

	return model;
} //createCartModel()