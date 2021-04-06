var Filters = Object.getPrototypeOf(app).Filters = new Component("filters");
Filters.debug = true;
Filters.createdAt      = "1.4.16";
Filters.lastUpdate     = "1.4.16";
Filters.version        = "1";
// Filters.loadingMsg     = "This message will display in the console when component will be loaded.";

Filters.prototype.onResize = function(){};
Filters.prototype.onCreate = function(){
	var filters = this;
	filters.$filters = filters.$el.find('.filter');
	filters.$container = $('#'+filters.$el.attr('data-container'));
	filters.$items = filters.$container.find('.'+filters.$el.attr('data-items'));
	filters.blnReset        = (filters.blnReset !== undefined)        ? filters.blnReset 		: filters.getData('reset',false);
	filters.blnCount        = (filters.blnCount !== undefined)        ? filters.blnCount 		: filters.getData('count',false);
	filters.blnAutocomplete = (filters.blnAutocomplete !== undefined) ? filters.blnAutocomplete : filters.getData('autocomplete',false);
	filters.buttonClass 	= (filters.buttonClass !== undefined) 	  ? filters.buttonClass 	: filters.getData('buttonclass','');
	filters.itemClass 		= (filters.itemClass !== undefined) 	  ? filters.itemClass 		: filters.getData('itemclass','hidden');
	filters.format 		    = (filters.format !== undefined) 	  	  ? filters.format 			: filters.getData('format','select');
	filters.submit 		    = (filters.submit !== undefined) 	  	  ? filters.submit 			: filters.getData('submit',false);

	if (filters.format != 'select') {
		if (Filters.debug) filters.log('Unknown format used',filters.format+' is not valid format.');
		return false;
	} else {
		if (filters.blnAutocomplete) {
			filters.$filters.each(function(i,filter){
				if ($(filter).attr('data-label') != '')
					$(filter).prepend('<option value="">'+$(filter).attr('data-label')+'</option>');
				var arrFilters = [];
				filters.$items.each(function(){
					if($(this).attr('data-'+$(filter).attr('data-filter')))
						arrFilters.push($(this).attr('data-'+$(filter).attr('data-filter')));
				});
				arrFilters = [ ...new Set(arrFilters.sort())];
				$.each(arrFilters,function(){
					$(filter).append('<option value="'+this+'">'+this+'</option>')
				});
				$(filter).trigger('change');
			});
		}
		if(filters.blnCount){
			filters.$filters.each(function(i,filter){
				var $filter = $(this);
				var target = $filter.attr('data-filter');
				$filter.find('option').each(function(k,option){
					if ($(option).attr('value'))
						if ($(option).attr('data-label'))
							$(option).html($(option).attr('data-label')+' ('+filters.$items.filter('[data-'+target+'="'+$(option).attr('value')+'"]').length+')');
						else
							$(option).html($(option).attr('value')+' ('+filters.$items.filter('[data-'+target+'="'+$(option).attr('value')+'"]').length+')');
				});
			});
		}

		if (filters.blnReset) {
			filters.$el.append('<span class="filters__reset"><i class="fa fa-times"></i></span>');
			$('.filters__reset').on('click',function(){
				filters.$filters.val('').trigger('change');
			});
		}

		if (filters.submit && filters.$el.closest('form').length) {
			filters.$filters.filter('select').on('change',function(e){
				if (filters.$el.closest('form').length){
					filters.$el.closest('form').trigger('submit');
					return false
				}
			});
			filters.$filters.filter('input[type=text]').on('change',function(e){
				if (filters.$el.closest('form').length){
					filters.$el.closest('form').trigger('submit');
					return false
				}
			});
		} else {
			filters.$filters.on('change keyup',function(e){
				// console.log('filter change');
				filters.$items.removeClass('hidden');
				filters.$filters.each(function(i,filter){
					var $filter = $(filter);
					var target = $filter.attr('data-filter');
					var value = $filter.val();
					if (value != ""){
						if (filter.nodeName == 'SELECT')
							filters.$items.not('[data-'+target+'="'+value+'"]').addClass('hidden');
						if (filter.nodeName == 'INPUT' && filter.getAttribute('type') == 'text')
							filters.$items.not('[data-'+target+'*="'+value.toLowerCase()+'"]').addClass('hidden');
					}
				});
			});
		}
	}
	filters.$el.removeClass('hidden');
	return filters;
}