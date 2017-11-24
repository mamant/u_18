/**
 * Created by Nik on 02.02.2016.
 */


//;(function ($) {

	/**
	 *  Основной JS файл
	 *
	 *  Просьба писать по возможность простой симатический код
	 *  Название функций и переменных писать осмысленные
	 *  Для каждой функции писать комментарий
	 *  Если код не дописан или треюует рефакторинга писать TODO
	 */


	/**
	 *  Глобальные переменные объявлять здесь
	 */

	//var globalVariable = console.log('Файла common.js подключен!');
	var body = $('body');

	// Ошибки заполнения форм

	var not_name = $('.not_name').text();
	var not_correct_name = $('.not_correct_name').text();
	var not_phone = $('.not_phone').text();
	var not_correct_phone = $('.not_correct_phone').text();
	var not_email = $('.not_email').text();
	var not_correct_email = $('.not_correct_email').text();
	var not_captcha = $('.not_captcha').text();
	var not_correct_captcha = $('.not_correct_captcha').text();
	var not_message = $('.not_message').text();


	/**
	 *  Код необходимо писать в теле функции, инициализацию функций производить в "ready"
	 */

	$(document).ready(function () {

		closePopup();
		initFotoChange();
		addFileInput();
		loadMoreStory();
		openSearch();
		scrollTopPage();
		tabsSwitch();
		truncate();
		openHiddenSeoText();
		
		if ('#email_form'.length) {
			newsSubscribeValidate();
		}

		if ('#complaint_form'.length) {
			complaintValidate()
		}
		
		if ('#accordion'.length) {
			openAccordion();
		}

		if ('.input_phone'.length) {
			$(".input_phone").mask("+38 (099) 999-9999");
		}

		if ('.news_date'.length) {
			$(".news_date input[type=text]").datepicker({
				dateFormat: 'yy-mm-dd'
			});
		}

		if ('#department'.length) {
			insuranceTypeOther();
		}
		if ('#subjects_of_complaints'.length) {
			subjectsOfComplaintsOther();
		}

		if ($('.select').length) {
			$('.select').selectric();
		}

		if ($('#subjects_of_complaints').length) {
			$('#subjects_of_complaints').selectric();
		}

		if ($('#department').length) {
			$('#department').selectric();
		}

		if ('.social #call_you'.length) {
			callYou();
		}

		if ('.first_step #call_you'.length) {
			firstStepcallYou();
		}


		$('.open_submenu').on('click', function (e) {
			e.preventDefault();

			var parent = $(this).parent();

			if(!parent.hasClass('open')){
				parent.addClass('open');
			}else{
				parent.removeClass('open');
			}
		});

		

	});

	/**
	 *  Нотифай
	 */
	function notify(message) {
		var overlay = '<div class="overlay-background close_popup" style="display: block"></div>';
		var popup = '<div class="modal popup">' +
			'	<div class="head mainColor">' +
			'		<a class="closemodal close_popup" href="javascript:void(0)">' +
			'			<i class="size16 close"></i>' +
			'		</a>' +
			'		<i class="size70 information mainColor"></i>' +
			'	</div>' +
			'	<div class="content">' + message + '</div>' +
			'</div>';
		var body = $('body');

		body.append("<div class='loader'></div>");

		body.append(overlay);
		body.append(popup);
		closePopup();

		setTimeout(function () {
			body.find('.modal.popup').remove();
			body.find('.overlay-background').remove();
		}, 8000);
	}

	/**
	 *  Функция закрывает попапы
	 */

	function closePopup() {
		$('.close_popup').on('click', function (e) {
			e.preventDefault();

			$('.overlay-background').remove();
			$('.modal.popup').remove();
		});
	}

	/**
	 *  Функция удаляет поля загрузки файлов в форме отправки жалоб
	 */

	var num1 = 1;

	function initFotoChange() {
		$('body').on('click', ".doc_remover", function () {
			$(this).parent().remove();
			if($('.add_file_block').hasClass('hidden_block')){
				$('.add_file_block').removeClass('hidden_block');
			}
			num1--;
			console.log(num1);
		});
	}

	/**
	 *  Функция добавляет поля загрузки файлов в форме отправки жалоб
	 */

	function addFileInput(){

		var blockAddFile =  "<p id='foto-wrapper" + num1 + "'>" +
							"	<a href='javascript:;' class='doc_remover'>[x]</a>" +
							"	<input type='text'  info='datoteke' name='_opisDoc" + num1 + "' class='foto ignore' maxlength='250' placeholder='Введите описание файла' />" +
							"	<input type='file' name='doc" + num1 + "'  />" +
							"</p>";

		$("#addDoc").on('click', function() {
			if(num1 < 5){
				num1++;
				console.log(num1);
				$("#docs").append(blockAddFile);
			}else{
				console.log('Добавлено 5, больше нельзя');
			}

		});
	}

	/**
	 *  Раздел история клиентов, по умолчанию показываеться некоторое количество историй (указываеться в админке)
	 *  историй, функция подгружает по n - элементов (указываеться в админке) дополнительно
	 */

	function loadMoreStory() {

		if($('.load_more').attr('rel') == ""){
			$('.load_more').hide();
		}

		$('.load_more').on('click', function (e) {
			e.preventDefault();

			var container = $('.container_stories');
			var link = $(this).attr("rel");

			$('.loader').show();
			$.ajax({
				type: 'GET',
				url: link,
				dataType: 'html',
				success: function(data){
					var el = $( '<div></div>' );
					el.html(data);
					var load_ajax = $('.load_ajax', el);
					container.append(load_ajax);
					var load_more_ajax = $('.load_more', el);
					var attrRel = load_more_ajax.attr("rel");
					$('.load_more').attr('rel', attrRel);
					$('.loader').hide();
					$('.bg1600px').css('height', $('body').outerHeight() + 'px');
					console.log(load_ajax);
					if(attrRel == ""){
						$('.load_more').hide();
					}
				}
			});
		});
	}

	/**
	 *  Аккоордионы
	 */

	function openAccordion() {
		$(".js_pn").click(function(){

			var id_element = $(this).attr("id");
			var rel = $(this).attr("rel");

			if ($('.'+rel).hasClass('js_pn_container_open')){
				$('.js_pn_container').css("display", "none").removeClass('js_pn_container_open');
				$('.js_pn span').removeClass("minus");

			}else{
				$('.js_pn span').removeClass("minus");
				$('.js_pn_container').removeClass('js_pn_container_open');
				$("." + rel).css("display", "block").addClass('js_pn_container_open');
				$('.js_pn_container').css("display", "none");
				$(this).find('span').addClass("minus");
				$("." + rel).css("display", "block");
				go_to_id(id_element);
			}

			$('.bg1600px').css('height', $('body').outerHeight() + 'px');
			return false;
		});
	}

	function go_to_id(id){
		$('html, body').animate({
			scrollTop: $("#"+id).offset().top
		}, 1000);
	}


/**
 *  Форма жалоб, при выборе "Вид страховани" -> "Доругое - Other" отображает скрытый input и класс error если
	 *  ничего не выбрано
	 */

	function insuranceTypeOther() {

		$( "#department" ).change(function() {

			var valueOpinion = $(this).val();
			var parent = $(this).parents('.wrap_input');
			var hiddenInputWrap = $('.insurance_type_other');
			var hiddenInput = $('.insurance_type_other input');

			extracted.call(this, valueOpinion, parent, hiddenInputWrap, hiddenInput);

		});
	}

	/**
	 *  Форма жалоб, при выборе "Тематика жалобы" -> "Доругое - Other" отображает скрытый input и класс error если
	 *  ничего не выбрано
	 */

	function subjectsOfComplaintsOther() {

		$( "#subjects_of_complaints" ).change(function() {
			var valueOpinion = $(this).val();
			var parent = $(this).parents('.wrap_input');
			var hiddenInputWrap = $('.subjects_of_complaints_other ');
			var hiddenInput = $('.subjects_of_complaints_other input');

			extracted.call(this, valueOpinion, parent, hiddenInputWrap, hiddenInput);

		});
	}

	function extracted(valueOpinion, parent, hiddenInputWrap, hiddenInput) {
		if (valueOpinion == "") {
			parent.addClass('error');
			parent.removeClass('ok');
		} else if (valueOpinion == 'other') {
			$(this).addClass('ignore');
			hiddenInputWrap.css('display', 'block');
			hiddenInput.removeClass('ignore');
		} else {
			$(this).removeClass('ignore');
			hiddenInputWrap.css('display', 'block');
			hiddenInput.removeClass('ignore');
			parent.removeClass('error');
			parent.addClass('ok');
		}
	}



	/**
	 *  Открывает форму поиска
	 */

	function openSearch() {

		$('.open_search_form').on('click', function (e) {

			e.preventDefault();

			var parent = $(this).parent();

			if(!parent.hasClass('open')){
				parent.addClass('open');
			}else{
				parent.removeClass('open');
			}
		});
	}

	/**
	 *  Скролит страницу вверх/вниз
	 */
	function scrollTopPage() {

		var topValue = $('.scroll_box .top').text();
		var bottomValue = $('.scroll_box .down').text();

		function setScrollText() {
			var windowsize = $(window).width();
			if (windowsize < 767) {
				if($(window).scrollTop() > 0){
					$("#scroll-box .scroll-text").text(topValue);
				}
				else {
					$("#scroll-box .scroll-text").text(bottomValue);
				}
			} else {
				if($(window).scrollTop() > 0){
					$("#scroll-box .scroll-text").text(topValue);
				}
				else {
					$("#scroll-box .scroll-text").text(bottomValue);
				}
			}
		}

		setScrollText();

		$(window).scroll(function(){
			setScrollText();
		});

		function stickyDiv() {
			var windowsize = $(window).width();
			if (windowsize < 767) {
				var scrollTop = $(window).scrollTop();
				var winHeight = $(window).height();
				var footerOffsetTop = $('footer').offset().top;
				var footerHeight = $('footer').height();
				if ((scrollTop+winHeight) > footerOffsetTop) {
					$("#scroll-box").css('top', 'auto');
					$("#scroll-box").css('margin-top', '0px');
					$("#scroll-box").css('bottom', footerHeight + 35 + 'px');
				} else {
					$("#scroll-box").css('top', '50%');
					$("#scroll-box").css('margin-top', '-2.5em');
					$("#scroll-box").css('bottom', 'auto');
				}
			}
		}

		$(document).scroll(function () {
			stickyDiv();
		});

		$("#scroll-box").click(function(e){

			e.preventDefault();

			var dHeight = $(document).height() - window.innerHeight;

			if($(window).scrollTop() > 0){
				$("html, body").animate({
					scrollTop:0
				},"slow");

			}
			else {
				$("html, body").animate({
					scrollTop:dHeight
				},"slow");

			}

		});
	}

/**
 * Блок валидации форм
 */

/**
 *  Функция проверят форму подписки на главной странице
 */

function newsSubscribeValidate() {

	var for_thanks = $('.for_thanks').text();


	$('#email_form').validate({
		ignore: ".ignore",
		rules: {
			'subscribe[email]': {
				required: true,
				email: true
			}
		},
		messages: {
			'subscribe[email]': {
				required: '',
				email: ''
			}
		},
		invalidHandler: function () {
			console.log('Error submit form!');
		},
		submitHandler: function (form) {
			submitAjaxForm(form, for_thanks);
		}
	});
}

/**
 *  Валидация формы отправки жалоб
 */

function complaintValidate() {

	$('#complaint_form').validate({
		ignore: ".ignore",
		unhighlight: function (element, errorClass, validClass) {
			$(element).removeClass(errorClass).addClass(validClass);
			$(element).parents('.wrap_input').removeClass(errorClass).addClass('ok');
		},

		highlight: function (element, errorClass, validClass) {
			$(element).addClass(errorClass).removeClass(validClass);
			$(element).parents('.wrap_input').addClass(errorClass);
		},

		rules: {
			'feedback[name]': {
				required: true,
				characters: true
			},
			'feedback[email]': {
				required: true,
				email: true
			},
			'feedback[subjects_of_complaints]': {
				required: true
			},
			'feedback[insurance_type]': {
				required: true
			},
			'feedback[massage]': {
				required: true
			},
			'feedback[subjects_of_complaints_other]': {
				required: true
			},
			'feedback[insurance_type_other]': {
				required: true
			}
		},
		messages: {
			'feedback[name]': {
				required: '',
				characters: ''
			},
			'feedback[email]': {
				required: '',
				email: ''
			},
			'feedback[subjects_of_complaints]': {
				required: ''
			},
			'feedback[insurance_type]': {
				required: ''
			},
			'feedback[massage]': {
				required: ''
			},
			'feedback[subjects_of_complaints_other]': {
				required: ''
			},
			'feedback[insurance_type_other]': {
				required: ''
			}
		},

		invalidHandler: function () {
			console.log('Error submit form!');
		},
		submitHandler: function (form) {
			form.submit();
		}
	});
}

/**
 *  Валидация формы "перезвоните мне"
 */

function callYou() {

	var for_thanks = $('.for_thanks_call_you').text();

	$('.social #call_you').validate({
		ignore: ".ignore",
		unhighlight: function (element, errorClass, validClass) {
			$(element).removeClass(errorClass).addClass(validClass);
			$(element).parents('.wrap_input').removeClass(errorClass).addClass('ok');
		},
		highlight: function (element, errorClass, validClass) {
			$(element).addClass(errorClass).removeClass(validClass);
			$(element).parents('.wrap_input').addClass(errorClass);
		},

		rules: {
			'callback_phone': {
				required: true,
				phone: true,
				minlength: 17
			}
		},
		messages: {
			'callback_phone': {
				required: '',
				phone: '',
				minlength: ''
			}
		},
		invalidHandler: function () {
			console.log('Error submit form!');
		},
		submitHandler: function (form) {
			submitAjaxForm(form, for_thanks);
		}
	});
}

function firstStepcallYou() {

	var for_thanks = $('.for_thanks_call_you_map').text();

	$('.first_step #call_you').validate({
		ignore: ".ignore",
		unhighlight: function (element, errorClass, validClass) {
			$(element).removeClass(errorClass).addClass(validClass);
			$(element).parents('.wrap_input').removeClass(errorClass).addClass('ok');
		},
		highlight: function (element, errorClass, validClass) {
			$(element).addClass(errorClass).removeClass(validClass);
			$(element).parents('.wrap_input').addClass(errorClass);
		},

		rules: {
			'callback_phone': {
				required: true,
				phone: true,
				minlength: 17
			},
			'callback_name': {
				required: true,
				characters: true
			}
		},
		messages: {
			'callback_phone': {
				required: '',
				phone: '',
				minlength: ''
			},
			'callback_name': {
				required: '',
				characters: ''
			}
		},
		invalidHandler: function () {
			console.log('Error submit form!');
		},
		submitHandler: function (form) {
			submitAjaxForm(form, for_thanks);
		}
	});
}
/**
 *  Функция ...
 */

function submitAjaxForm(form, for_thanks){

	var overlay = '<div class="overlay-background close_popup" style="display: block"></div>';
	var massege =   '<div class="modal popup">' +
					'	<div class="head mainColor">' +
					'		<a class="closemodal close_popup" href="javascript:void(0)">' +
					'			<i class="size16 close"></i>' +
					'		</a>' +
					'		<i class="size70 information mainColor"></i>' +
					'	</div>' +
					'	<div class="content">' + for_thanks + '</div>' +
					'</div>';

	body.append("<div class='loader'></div>");
	$(form).ajaxSubmit();
	console.log('Submit form!');
	$(form)[0].reset();
	$('.loader').remove();
	body.append(overlay);
	body.append(massege);
	closePopup();
}

/**
 * Табы
 */
function tabsSwitch() {
	$('#tab-A').click(function(e) {
		e.preventDefault(); //prevent the link from being followed
		$(this).addClass('active');
		$('#tab-B').removeClass('active');
		$('.tab-asigurari').css('display','block');
		$('.tab-life').css('display','none');
	});
	$('#tab-B').click(function(e) {
		e.preventDefault(); //prevent the link from being followed
		$(this).addClass('active');
		$('#tab-A').removeClass('active');
		$('.tab-asigurari').css('display','none');
		$('.tab-life').css('display','block');
	});
}

function truncate() {
	var a=$(window).width();
	var b=$('li.last-child').text().length;
	if(a < 1120 ){
		$('li.last-child').each(function() {
			var text = $(this).text();
			if(text.length > 13 && b > 50) {
				$(this).text(text.substring(0, 30) + '..');
			}
		});
	}
}

function ondatechange(x, recent) {

	if (!recent) {
		document.getElementById('date11').value = x + '-01-01';
		document.getElementById('date12').value = x + '-12-31';
		document.getElementById("myForm").submit();
	}
	else {
		document.getElementById('date11').value = '';
		document.getElementById('date12').value = '';
		document.getElementById("myForm").submit();
	}
}

function clickdate() {
	document.getElementById("myForm").submit();
}

/**
 * Accordion on seo-text
 */


function openHiddenSeoText() {
	$('.visible-text').on('click', function () {
		if(!($('.hidden-text').hasClass('open'))) {
			$('.hidden-text').addClass('open');
			$('.visible-text span').addClass('minus');
			$('.visible-text span').removeClass('plus');
		}
		else {
			$('.hidden-text').removeClass('open');
			$('.visible-text span').removeClass('minus');
			$('.visible-text span').addClass('plus');
		}

	})
}