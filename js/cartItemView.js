/*
    createCartItemView()

    Creates a view for a single cart item. This exists
    so that we can attach the item to the remove button
    so that when it's clicked, we know what item to remove.
*/

//creates view for a single cart item
function createCartItemView(config) {
	var view = createTemplateView(config);

	// creates a function afterRender that removes items
	// in the cart when the .remove-item class
	// is clicked on
	view.afterRender = function(clonedTemplate, model) {
		clonedTemplate.find('.remove-item').click(function(){
			view.cartModel.removeItem(model);
		});
	};
	return view;
}
