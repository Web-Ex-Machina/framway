var Filters = Object.getPrototypeOf(app).Filters = new Component("filters");
// Filters.debug = true;
Filters.createdAt      = "1.4.16";
Filters.lastUpdate     = "1.4.16";
Filters.version        = "1";
// Filters.loadingMsg     = "This message will display in the console when component will be loaded.";

Filters.prototype.onCreate = function(){
	var filters = this;
	filters.$filters = filters.$el.find('.filter');
	filters.$container = $('#'+filters.$el.attr('data-container'));
	filters.$items = filters.$container.find('.'+filters.$el.attr('data-items'));
  filters.blnCount = (filters.blnCount !== undefined) ? filters.blnCount : filters.getData('count',false);

	if(filters.blnCount){
		filters.$filters.each(function(){
		var $filter = $(this);
		var target = $filter.attr('data-filter');
		if(target != 'all')
    	$filter.html($filter.html() + ' ('+ filters.$items.filter('[data-filter="'+target+'"]').length +')');
    else
    	$filter.html($filter.html() + ' ('+ filters.$items.length +')');
		});
	}

	filters.$filters.on('click',function(){
		var $filter = $(this);
		var target = $filter.attr('data-filter');

		filters.$filters.removeClass('active');
		$filter.addClass('active');

		if(target != 'all'){
			filters.$items.addClass('hidden');
			filters.$items.filter('[data-filter="'+target+'"]').removeClass('hidden');
		} else {
			filters.$items.removeClass('hidden');
		}
	});

	console.log(filters);
	return filters;
}