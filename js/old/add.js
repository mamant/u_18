$(document).ready( function() {
});

/*
Регулярки для валидации
 */
var regular = [];
regular['email'] = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
regular['password'] = [];
regular['password'][0] = /[a-z]{1,}/;
regular['password'][1] = /[A-Z]{1,}/;
regular['password'][2] = /[0-9]{1,}/;
regular['captcha'] = /[a-z0-9]{5}$/gi;

$(window).load(function(){
	//$('.phone-mask').mask("+38(099) 999-99-99");

	$(document).on('click', 'a[data-submitform]', function () {
		var form_name = $(this).data('submitform');
		$('form[name="'+form_name+'"]').submit();
		return false;
	});

	// Обработчик lead формы
	action_lead_form();

	// Обработчик формы регистрации
	//check_empty_field();
	registration_form();
});


function number_format(number, decimals, dec_point, thousands_sep) {
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
	prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	s = '',
	toFixedFix = function(n, prec) {
		var k = Math.pow(10, prec);
		return '' + (Math.round(n * k) / k).toFixed(prec);
	};
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}

/**
 *  Обработчик lead формы
 */
function action_lead_form() {
	$(document).on('submit', 'form[name="lead"]', function () {
//		return true;//это чтобы отправлять не аяксом
		var post_data = '';
		var form = $(this);
		$(this).find('input').each(function(index) {
			if(post_data!='') { post_data += '&'; }
			post_data += $(this).attr('name')+'='+encodeURIComponent($(this).val());
		});
//		console.log(post_data);
		$.ajax({
			method: 'POST',
			url: "",
			dataType: 'json',
			data: post_data,
			success: function(answer){
				if(answer.status == 'error') {
					for(i in answer.errors) {
						form.find('[name="'+answer.field+'['+i+']"]').addClass('error');
						form.find('[name="'+answer.field+'['+i+']"]').attr('title', answer.errors[i]);
					}
				}
				if(answer.status == 'success') {
					form.find('[name^="'+answer.field+'"]').val('');
					notify(answer.message);
				}
			}
		});
		return false;
	});
	/**
	 *  Снимаем с полей формы класс error
	 *	TODO: добавить обработчик для select, textarea полей
	 */
	$(document).on('focus', 'input', function () {
		$(this).removeClass('error');
	});

	if(typeof(message_notify) !== 'undefined') {
		notify(message_notify);
	}
}


/**
 *  Обработчик формы регистрации
 */
function registration_form() {
	var selector = 'form[name="register"] input,select,textarea,a,label';
	$(document).on('blur', 'form[name="register"] input,select,textarea', function () {
		validate_field({field: $(this), selector: selector, selector_form:'form[name="register"]', selector_button:'input[type="submit"]', class:'dark_green'});
	});
	$(document).on('change', 'form[name="register"] input[type="checkbox"],select', function () {
		validate_field({field: $(this), selector: selector, selector_form:'form[name="register"]', selector_button:'input[type="submit"]', class:'dark_green'});
	});
	$(document).on('submit', 'form[name="register"]', function () {
		var count_error = count_error_field_in_form({selector:selector, switch_field:true});
		switch_submit_button({count_error:count_error, selector_form:'form[name="register"]', selector_button:'input[type="submit"]', class:'dark_green'});
		if(count_error != 0) {
			return false;
		}
	});
}
/*
Запускаем на валидацию поле
 */
function validate_field(data) {

	var validate = data.field.data('validate');
	
	if(typeof(validate)!='undefined') {
		var check_empty = validate.search('empty') != -1 ? true : false;
		var check_valid = validate.search('valid') != -1 ? true : false;

		var result_check = check_field(data.field, {empty: check_empty, valid: check_valid, checktype: data.field.data('checktype'), value: data.field.val()});
		switch_error_field(data.field, result_check);

		var count_error = count_error_field_in_form({selector: data.selector});
		switch_submit_button({count_error: count_error, selector_form: data.selector_form, selector_button: data.selector_button, class: data.class});
	}
}
/**
 * Валидация полей
 */
function check_field(field, data) {
	// console.log('data[empty]:' + data.empty + '; data[valid]:' + data.valid + '; data[checktype]:' + data.checktype + '; data[value]:' + data.value + ';');
	var result = '';
	if(data.empty === true) {
		if (data.value.length == 0 || data.value == '') {
			result = 'empty';
		}
	}
	if(data.valid === true && result == '' && data.checktype != '') {
		switch (data.checktype) {
			case 'email':
				if (typeof(regular[data.checktype]) != 'undefined') {
					if (data.value.search(regular[data.checktype])==-1) {
						result = 'incorrectly';
					}
				}
				break;
			case 'password':
				if (typeof(regular[data.checktype][0]) != 'undefined' && typeof(regular[data.checktype][1]) != 'undefined' && typeof(regular[data.checktype][2]) != 'undefined') {
					if (data.value.search(regular[data.checktype][0])==-1 || data.value.search(regular[data.checktype][1])==-1 || data.value.search(regular[data.checktype][2])==-1 || data.value.length<6) {
						result = 'incorrectly';
					}
				}
				break;
			case 'captcha':
				if (typeof(regular[data.checktype]) != 'undefined') {
					if (data.value.search(regular[data.checktype])==-1 || data.value.length!=5) {
						result = 'incorrectly';
					}
				}
				break;
			case 'check':
				if(typeof(field.prop("checked")) == 'undefined' || field.prop("checked") !== true) {
					result = 'empty';
				}
				break;
		}
	}
	//console.log('result ' + result);
	return result;
}
/*
Подстчет кол-ва ошибок в форме
 */
function count_error_field_in_form(data) {
	var count_error = 0;
	$(data.selector).each(function(index) {
		var validate = $(this).data('validate');
		if(typeof(validate)!='undefined') {
			var check_empty = validate.search('empty') != -1 ? true : false;
			var check_valid = validate.search('valid') != -1 ? true : false;

			if(check_empty || check_valid) {
				if(!$(this).hasClass('valid')) {
					count_error++;
				}
			}
			if(typeof(data.switch_field)!='undefined' && data.switch_field === true) {
				var result_check = check_field($(this), {empty:check_empty, valid:check_valid, checktype:$(this).data('checktype'), value:$(this).val()});
				switch_error_field($(this), result_check);
			}
		}
	});
	return count_error;
}
/*
Переключения кнопки сабмита
 */
function switch_submit_button(data) {
	//console.log('count_error '+data.count_error);
	if(data.count_error == 0) {
		$(data.selector_form).find(data.selector_button).addClass(data.class);
	}
	else {
		$(data.selector_form).find(data.selector_button).removeClass(data.class);
	}
}
/**
 * Переключаение вывода ошибок
 */
function switch_error_field(field, status) {
	if (status == '') {
		field.addClass('valid').removeClass('error');
		field.parents('.input_wrap').removeClass('error').addClass('ok').find('.message').text('');
	}
	else {
		if (status == 'empty') {
			var message = field.data('error_empty');
			field.addClass('error').removeClass('valid');
			field.parents('.input_wrap').addClass('error').removeClass('ok').find('.message').text(message);
		}
		else {
			if (status == 'incorrectly') {
				var message = field.data('error_incorrectly');
				field.addClass('error').removeClass('valid');
				field.parents('.input_wrap').addClass('error').removeClass('ok').find('.message').text(message);
			}
		}
	}
}