var suggest_count = 0;
var input_initial_value = '';
var suggest_selected = 0;

$(window).load(function(){
	// читаем ввод с клавиатуры
$("#search_box").keyup(function(I)
{
	// определяем какие действия нужно делать при нажатии на клавиатуру
	switch(I.keyCode) 
	{
		// игнорируем нажатия на эти клавишы
		case 13:  // enter
		case 27:  // escape
		case 38:  // стрелка вверх
		case 40:  // стрелка вниз
		break;

		default:
			// производим поиск только при вводе более 2х символов
			if($(this).val().length>2)
			{

				input_initial_value = $(this).val();
				// производим AJAX запрос к /ajax/ajax.php, передаем ему GET query, в который мы помещаем наш запрос
				$.get("search_items.php", { "query":$(this).val() },function(data){
					//php скрипт возвращает нам строку, ее надо распарсить в массив.
					// возвращаемые данные: ['test','test 1','test 2','test 3']
					var list = eval("("+data+")");
					suggest_count = list.length;
					if(suggest_count > 0)
					{
						// перед показом слоя подсказки, его обнуляем
						$("#search_advice_wrapper").html("").show();
						for(var i in list)
						{
							if(list[i] != '')
							{
								// добавляем слою позиции
								$('#search_advice_wrapper').append(list[i]);
							}
						}
					}
				}, 'html');
			}
		break;
	}
});

	//считываем нажатие клавишь, уже после вывода подсказки
	$("#search_box").keydown(function(I){
		switch(I.keyCode) {
			// по нажатию клавишь прячем подсказку
			//case 13:
			 // enter
			case 27: // escape
				$('#search_advice_wrapper').hide();
				return false;
			break;
			// делаем переход по подсказке стрелочками клавиатуры
			case 38: // стрелка вверх
			case 40: // стрелка вниз
				I.preventDefault();
				if(suggest_count){
					//делаем выделение пунктов в слое, переход по стрелочкам
					key_activate(I.keyCode-39 );
				}
			break;
		}
	});
$("#search_box").keydown(function(I){
		switch(I.keyCode) {
			// по нажатию enter отправляем запрос
			
			case 13: // enter
				
				//I.preventDefault();
				if(suggest_selected > 0)
				{
					var item_id = $('#search_advice_wrapper .active').attr('data-id');
					LoadItem(item_id);

					return false;
				}else
				{
					
					var itid = $("#search_box").val();
					
					var re = new RegExp("^([0-9]{3,20})$");
					if(re.test(itid))
					{
						//console.log(itid);
						LoadItem(itid);
						return false;
					}else
						
					SearchItems();
				
					return false;
				}
				
				
				
			//break;
				}});
	/*
	// делаем обработку клика по подсказке
	$('.advice_variant').live('click',function(){
		// ставим текст в input поиска
		$('#search_box').val($(this).text());
		var item_id = $(this).getAttribute('data-id');
		// прячем слой подсказки
		$('#search_advice_wrapper').fadeOut(350).html('');
		
		LoadItem(item_id);
	});
*/
$('#search_advice_wrapper').on('click','div',function(){LoadItem(this.id)});
	
	// если кликаем в любом месте сайта, нужно спрятать подсказку
	$('html').click(function(){
		$('#search_advice_wrapper').hide();
		$('.tooltip').remove();
	});
	// если кликаем на поле input и есть пункты подсказки, то показываем скрытый слой
	$('#search_box').click(function(event){
		//alert(suggest_count);
		if(suggest_count)
			$('#search_advice_wrapper').show();
		event.stopPropagation();
		
	});
});

function key_activate(n){
	$('#search_advice_wrapper .advice_variant').removeClass('active');

	if(n == 1 && suggest_selected < suggest_count){
		suggest_selected++;
	}else if(n == -1 && suggest_selected > 0){
		suggest_selected--;
	}

	if(suggest_selected > 0){
		$('#search_advice_wrapper .advice_variant').eq(suggest_selected-1).addClass('active');
		//$("#search_box").val($('#search_advice_wrapper div').eq(suggest_selected-1).text() );
		//var attribute = $('#search_advice_wrapper div').getAttribute('data-id');
		//$("#search_box").val($('#search_advice_wrapper div').eq(suggest_selected-1).data('id') );
		//$('#search_box').val($(this).eq(suggest_selected-1).text());
		$("#search_box").val($('#search_advice_wrapper .saw_name').eq(suggest_selected-1).text() );
	} else {
		$("#search_box").val(input_initial_value );
	}
}

