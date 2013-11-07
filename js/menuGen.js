$(function(){
	renderMenu(com.dawgpizza.menu.pizzas, com.dawgpizza.menu.drinks, com.dawgpizza.menu.desserts);
	
	$('.menu-button').click(function(){
		var detail = $('.menu-detail');
		detail.modal();
	});
});

//function renders all the pizzas, drinks, and desserts
function renderMenu(pizzas, drinks, desserts) {
	var pTemplate = $('.pizza-list');
	var dTemplate = $('.item-name');
	var meatList = $('.meat-list');
	var veggieList = $('.veggie-list');
	var drinkList = $('.drink-list');
	var dessertList = $('.dessert-list');

	//goes through the pizza array and creates
	//list of pizzas
	$.each(pizzas, function(){
		var pClone = pTemplate.clone();

		pClone.find('.name').html(this.name);
		pClone.find('.prices').html('($' + this.prices[0] + '/$' + this.prices[1] + '/$' + this.prices[2] + ')');
		pClone.find('.description').html(this.description);

		pClone.removeClass('template');
		if (this.vegetarian) {
			veggieList.append(pClone);
		} else {
			meatList.append(pClone);
		}
	});

	//creates list of drinks
	$.each(drinks, function(){
		var dClone = dTemplate.clone();

		dClone.html(this.name + '($' + this.price + ')');

		dClone.removeClass('template');
		drinkList.append(dClone);
	});

	//creates list of desserts
	$.each(desserts, function(){
		var dClone = dTemplate.clone();

		dClone.html(this.name + '($' + this.price + ')');

		dClone.removeClass('template');
		dessertList.append(dClone);
	});
}
