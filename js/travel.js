/**
 * Moderate by Alex Lovkiy 2016.07.05
 */
$(document).ready(function () {

	if(typeof(now_step) != 'undefined') {
		switch(now_step) {
			case 2:
				TravelStep2.init();
				break;
			case 3:
				TravelStep3.init();
				break;
		}
	}

	// Показываем или прячем общую информацию
	$('.selection-summary h2').on('click', function (e) {
		e.preventDefault();

		if ($(window).width() <= 1024) {
			$('.selection-summary .content').toggle();
			$('.selection-summary h2 .size25').toggleClass( "upp" );
		}
	});

	$('#insurance_insured').selectric();

	//Casco input fields
	//TODO: Убрать каско из ВЗР!!!
	// $('#casco_city').selectric(/*onOpen: function() {},*/);
	// $('#casco_brend').selectric();
	// $('#casco_currency').selectric();
	// $('#casco_date_manufacture').selectric();
	// $('#casco_pay_type').selectric();
	// $('#casco_pay_type_check').selectric();
	$(".phone_number").mask("+38 (099) 9999999");
	$('.tooltip-elem').tooltipster();

	zIndexMe();
});



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

function zIndexMe (){
	$('#casco').on('selectric-open','.selectric-wrapper', function (e) {
		//e.preventDefault();
		$('#casco .inner-section.group').removeClass('active');
		if($(this).hasClass('selectric-open')) {
			$(this).parent().parent().addClass('active');
		}
	});
	$('#casco').on('selectric-close','.selectric-wrapper', function (e) {
		$('#casco .inner-section.group').removeClass('active');
	});
}

/**
 * Виджет обработки втрого шага для калькулятора по ВЗР.
 * @type {{settings: {countInput: (number|jQuery), form: (*|jQuery|HTMLElement), nameReg: RegExp, passportReg: RegExp, dateReg: RegExp, first_name: (*|jQuery|HTMLElement), last_name: (*|jQuery|HTMLElement), passport: (*|jQuery|HTMLElement), date_birth: (*|jQuery|HTMLElement)}, init: TravelStep2.init, calculateDate: TravelStep2.calculateDate, check: TravelStep2.check, checkList: TravelStep2.checkList, cheackDate: TravelStep2.cheackDate, submitForm: TravelStep2.submitForm, validateForm: TravelStep2.validateForm}}
 */
var TravelStep2 = {

	settings: {
		countInput 	: $('.count_input').length,
		form 		: $('.registration_travel_person'),
		nameReg 	: /^[ A-Za-z\-'’]{2,40}$/,
		passportReg : /^[A-Za-z0-9'’\-]{2,20}$/,
		dateReg 	: /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,

		first_name 	: $(".registration_travel_person input[name*='insured_first_name\[\]']"),
		last_name 	: $(".registration_travel_person input[name*='insured_last_name\[\]']"),
		passport 	: $(".registration_travel_person input[name*='cnp\[\]']"),
		date_birth 	: $(".registration_travel_person input[name*='insured_birth_date\[\]']"),

		error_first_name: $("#insured_first_name_info").attr('data-label'),
		error_last_name:'',
		error_passport: '',
		error_date_birth:''
	},


	init: function () {

		TravelStep2.cheackDate();
		TravelStep2.checkList();

		if(typeof(run_check_field) != 'undefined') {
			TravelStep2.check_all_field(run_check_field);
		}
		else {
			TravelStep2.check_all_field(false);
		}

		TravelStep2.submitForm();

	},

	calculateDate: function(date, input){

		var n = date.split('.');
		var date_arival = $('#date_arival').html();
		var da = date_arival.split('.');

		var n2 = new Date(),
			n3 =  new Date(da[2] + '/' + da[1] + '/' + da[0]),
			n3_1 =  new Date(n[2] + '/' + n[1] + '/' + n[0]),
			b = new Date(n[2] + '/' + n[1] + '/' + n[0]),
			age = n3.getFullYear() - b.getFullYear();

		var years = n3.setFullYear(1972) < b.setFullYear(1972) ? age - 1 : age;

		if(years > 64){
			$('#old_person').css('display','block');
			input.val('');
			closePopup();
			return false;
		}else if(years < 1){

			if(n3_1.getTime() >n2.getTime()){
				$('#too_young_child').css('display','block');
				input.val('');
				closePopup();
				return false;
			}
		}

		return true;
	},
	check: function(nameReg) {

		if (this.value.length > 0 && this.value != '' && nameReg.test(this.value)) {
			$(this).addClass('valid').removeClass('error');
			$(this).parents('.input_wrap').removeClass('error').addClass('ok').find('.message').text('');
		} else {
			$(this).addClass('error').removeClass('valid');
			$(this).parents('.input_wrap').addClass('error').removeClass('ok').find('.message').html("<span>Вкажіть дані згідно закордонного паспорту</span>");
		}
	},
	checkList: function() {

		TravelStep2.settings.first_name.unbind().blur(function () {
			TravelStep2.check.call(this, TravelStep2.settings.nameReg);
			if ($('.valid').length  == TravelStep2.settings.countInput) {
				$('#greenButton').removeClass('gray').addClass('green');
			}else{
				$('#greenButton').removeClass('green').addClass('gray');
			}
		});

		TravelStep2.settings.last_name.unbind().blur(function () {
			TravelStep2.check.call(this, TravelStep2.settings.nameReg);
			if ($('.valid').length  == TravelStep2.settings.countInput) {
				$('#greenButton').removeClass('gray').addClass('green');
			}else{
				$('#greenButton').removeClass('green').addClass('gray');
			}
		});

		TravelStep2.settings.passport.unbind().blur(function () {
			TravelStep2.check.call(this, TravelStep2.settings.passportReg);
			if ($('.valid').length  == TravelStep2.settings.countInput) {
				$('#greenButton').removeClass('gray').addClass('green');
			}else{
				$('#greenButton').removeClass('green').addClass('gray');
			}
		});
	},
	cheackDate: function(){

		for(var i =0 ; i<4; i++){
			if($('#cnp_'+i).length){

				++TravelStep2.settings.countInput;

				$('#cnp_'+i)
					.datepicker({
						dateFormat: 'dd.mm.yy',

						maxDate: "-1dd",
						firstDay: 1,
						defaultDate: '01.01.1982',
						constraintInput: true,
						yearRange: "1946:+0",
						changeYear: true,
						changeMonth: true,
						minDate: 'yy' - 70,

						onSelect: function (date) {
							TravelStep2.calculateDate(date, $('#cnp_'+i));
						},
						onClose:function(evt, ui){
							if(!TravelStep2.calculateDate(this.value,$('#cnp_'+i))){
								$(this).removeClass('valid').addClass('error');
								$(this).parents('.input_wrap').addClass('error').removeClass('ok').find('.message').html('<span>Не вірні параметри дати народження</span>');
								$('#greenButton').removeClass('green').addClass('gray');
							}else{
								TravelStep2.check.call(this,TravelStep2.settings.dateReg);
								if ($('.valid').length  == TravelStep2.settings.countInput) {
									$(this).addClass('valid').removeClass('error').parents('.input_wrap').removeClass('error').addClass('ok').find('.message').text('');
									TravelStep2.check_all_field(false);
								}
							}

						}
					});
			}
		}
	},
	check_all_field: function(change_status_field) {
		$("input[name^='insured_last_name'],input[name^='insured_first_name']").each(function(){
			if(change_status_field === true) {
				var result_check = check_field_error($(this).val(), TravelStep2.settings.nameReg);
				change_status_fields($(this), result_check, 'Вкажіть дані згідно закордонного паспорту');
			}
		});
		$("input[name^='cnp']").each(function(){
			if(change_status_field === true) {
				var result_check = check_field_error($(this).val(), TravelStep2.settings.passportReg);
				change_status_fields($(this), result_check, 'Вкажіть дані згідно закордонного паспорту');
			}
		});
		$("input[name^='insured_birth_date']").each(function(){
			if(change_status_field === true) {
				var text_message = 'Не вірні параметри дати народження';
				if(!TravelStep2.calculateDate($(this).val(),$(this))){
					change_status_fields($(this), true, text_message);
				}
				else{
					var result_check = check_field_error($(this).val(), TravelStep2.settings.dateReg);
					change_status_fields($(this), result_check, text_message);
				}
			}
		});


		reactive_green_button($('.valid').length, TravelStep2.settings.countInput);
	},
	submitForm: function () {
		$('.registration_travel_person .form_submit').on('click', function(e){
			TravelStep2.check_all_field(true);
			e.preventDefault();

			if ($('.valid').length  == TravelStep2.settings.countInput) {
				TravelStep2.settings.form.submit();
			}
		});
	},
}


var TravelStep3 = {

	settings:{
		form : $('#travel_step_2'),
		countInput : $('.count_input_s3').length,

		error_0 : "",
		error_phone:"Перевірте, чи правильно ви ввели номер",
		error_1 : "Вкажіть дані згідно закордонного паспорту",
		error_2 : "Введіть адресу проживання українською мовою",
		error_3 : "Помилка заповнення поля «E-mail»",
		error_3_1 : "На вказану  електронну адресу вам буде надіслано договір страхування",
		error_4 : "Не вказаний номер",
		error_5 : "Це поле є обов`язковим для заповнення",
		error_6 : "Введіть коректний індекс",
		error_7 : "Вартість доставки договора Укрпоштою складає 20 грн",

		nameReg : /^[A-Za-z'\-]{2,40}$/,
		nameNumberReg : /^[A-Za-z0-9'\- ]{2,40}$/,
		numberReg : /^[z0-9'\- ]{5}$/,
		//phoneNumberReg : /^\+38 \(039|050|066|095|099|063|093|067|096|097|098|068|091|092|094|073\) [0-9]{7}$/,
		phoneNumberReg : /(\+38 )(\()(039|050|066|095|099|063|093|067|096|097|098|068|091|092|094|073)(\))( [0-9]{7})$/,
		//phoneNumberReg : /^[\+0-9\- \(\)']{18}$/,
		passportReg : /^[A-Za-z0-9'\-]{2,20}$/,
		addressReg : /^[А-яа-я`ґєҐЄ´ІіЇї0-9\,\/\.\\ '\- ]{1,186}$/,
		dateReg : /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
		emailReg : /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,

		last_name : $('#last_name_s3'),
		first_name : $("#first_name_s3"),
		passport : $("#passport_s3"),
		date_birth : $("#date_birth_s3"),
		address : $("#address_s3"),
		email : $("#email_s3"),
		phone_input : $("#phone_input_s3"),
		checkbox_1_s3 : $("#checkbox_1_s3"),
		checkbox_2_s3 : $("#checkbox_2_s3"),
		insured_pay_system_s3 : $("#insured_pay_system_s3"),
		address_for_send_input_s3 : $("#address_for_send_input_s3"),
		index_for_send_input_s3 : $("#index_for_send_input_s3"),

	},
	init: function() {

		TravelStep3.checkList();

		TravelStep3.otherPerson();
		TravelStep3.forFix();


		if(typeof(run_check_field) != 'undefined') {
			TravelStep3.check_all_field(run_check_field);

			if(run_check_field === true) {
				$(document).on('click', '#checkbox_1_s3', function () {
					setTimeout(function() { TravelStep3.check_all_field(true); }, 500);
				});
			}
		}
		else {
			TravelStep3.check_all_field(false);
		}

		TravelStep3.submitForm();
	},

	check: function(input, nameReg, massage, massage_2) {

		var val = input.val();
		var var_name = input.selector;

		if (val.length > 0 && val != '' && val.search(nameReg)!=-1) {

			input.addClass('valid').removeClass('error');
			input.parents('.input_wrap').removeClass('error').addClass('ok').find('.message').html("<span>"+massage_2+"</span>");
			return true;
		} else {
			input.addClass('error').removeClass('valid');
			input.parents('.input_wrap').addClass('error').removeClass('ok').find('.message').html("<span>"+massage+"</span>");
			return false;
		}
	},

	calculateDate2: function(date, input){

		// var curentDate = new Date();
		// var n = date.split('.');
		// var ND = new Date(n[2] + '/' + n[1] + '/' + n[0]);
		// var d = new Date(ND.getTime());
		// var years = curentDate.getFullYear() - d.getFullYear();


		var n2 = $('#date_depart').html().split('.');
		var n = date.split('.');

		var n3 =  new Date(n[2] + '/' + n[1] + '/' + n[0]),
			b = new Date((parseInt(n2[2])+1) + '/' + n2[1] + '/' + n2[0]),
			age = b.getFullYear() - n3.getFullYear();



		var years = n3.setFullYear(1972) < b.setFullYear(1972) ? age - 1 : age;

		if($('#step_3_type').val() == 'business'){
			if(years > 64){
				$('#old_person').css('display','block');
				input.val('');
				closePopup();
				return false;
			}
		}

		if(years < 18){
			$('#too_young').css('display','block');
			input.val('');
			closePopup();
			return false;
		}
		return true;
	},

	greenButton: function() {
		countInput = $('.count_input_s3').length;
		if ($('.valid').length  == countInput) {
			$('#greenButton').removeClass('gray').addClass('green');
		}
	},

	checkList: function() {

		TravelStep3.settings.last_name.unbind().blur(function () {
			if(TravelStep3.check(TravelStep3.settings.last_name, TravelStep3.settings.nameReg, TravelStep3.settings.error_1, TravelStep3.settings.error_0)){

				TravelStep3.greenButton();
			}else{
				$('#greenButton').addClass('gray').removeClass('green');
			}
		});

		TravelStep3.settings.first_name.unbind().blur(function () {
			if(TravelStep3.check(TravelStep3.settings.first_name, TravelStep3.settings.nameReg, TravelStep3.settings.error_1, TravelStep3.settings.error_0)){

				TravelStep3.greenButton();
			}else{
				$('#greenButton').addClass('gray').removeClass('green');
			}
		});

		TravelStep3.settings.passport.unbind().blur(function () {
			if(TravelStep3.check(TravelStep3.settings.passport, TravelStep3.settings.passportReg, TravelStep3.settings.error_1, TravelStep3.settings.error_0)){

				TravelStep3.greenButton();
			}else{
				$('#greenButton').addClass('gray').removeClass('green');
			}
		});


		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth() + 1;
		var curr_year = d.getFullYear();


		TravelStep3.settings.date_birth.datepicker({
			dateFormat: 'dd.mm.yy',
			maxDate:  curr_date+'.'+curr_month+'.'+ (curr_year-18),
			firstDay: 1,
			yearRange: "-84:+0",
			//yearRange: "-30:+0",
			defaultDate: '01.01.1982',
			constraintInput: true,
			changeYear: true,
			changeMonth: true,
			minDate: curr_date+'.'+curr_month+'.'+ (curr_year - 100),
			onClose:function(evt, ui){
				TravelStep3.calculateDate2(evt, $('#date_birth_s3'));
				TravelStep3.check(TravelStep3.settings.date_birth, TravelStep3.settings.dateReg, TravelStep3.settings.error_1, TravelStep3.settings.error_0);
				TravelStep3.greenButton();
			}
		});

		TravelStep3.settings.address.unbind().blur(function () {
			if(TravelStep3.check(TravelStep3.settings.address, TravelStep3.settings.addressReg, TravelStep3.settings.error_2, TravelStep3.settings.error_0)){

				TravelStep3.greenButton();
			}else{
				$('#greenButton').addClass('gray').removeClass('green');
			}
		});

		TravelStep3.settings.email.unbind().blur(function () {
			if(TravelStep3.check(TravelStep3.settings.email, TravelStep3.settings.emailReg, TravelStep3.settings.error_3, TravelStep3.settings.error_3_1)) {
				TravelStep3.greenButton();
			}else {
				$('#greenButton').addClass('gray').removeClass('green');
			}
		});

		TravelStep3.settings.phone_input.unbind().blur(function () {
			if(TravelStep3.check(TravelStep3.settings.phone_input, TravelStep3.settings.phoneNumberReg,TravelStep3.settings.error_phone, TravelStep3.settings.error_phone)){

				TravelStep3.greenButton();
			}else{
				$('#greenButton').addClass('gray').removeClass('green');
			}
		});

		TravelStep3.settings.address_for_send_input_s3.unbind().blur(function () {
			if(TravelStep3.check(TravelStep3.settings.address_for_send_input_s3, TravelStep3.settings.addressReg, TravelStep3.settings.error_2, TravelStep3.settings.error_7)){

				TravelStep3.greenButton();
			}else{
				$('#greenButton').addClass('gray').removeClass('green');
			}
		});

		TravelStep3.settings.index_for_send_input_s3.unbind().blur(function () {
			if(TravelStep3.check(TravelStep3.settings.index_for_send_input_s3, TravelStep3.settings.numberReg, TravelStep3.settings.error_6, TravelStep3.settings.error_7)){

				TravelStep3.greenButton();
			}else{
				$('#greenButton').addClass('gray').removeClass('green');
			}
		});
	},

	check_all_field: function(change_status_field) {

		$(".count_input_s3").each(function(){
			var name_field = $(this).attr('name');
			switch(name_field) {
				case 'insurance_insured':
				case 'insured_first_name':
					if(change_status_field === true) {
						var result_check = check_field_error($(this).val(), TravelStep3.settings.nameReg);
						change_status_fields($(this), result_check, TravelStep3.settings.error_1, TravelStep3.settings.error_0);
					}
					break;
				case 'insured_passport':
					if(change_status_field === true) {
						var result_check = check_field_error($(this).val(), TravelStep3.settings.passportReg);
						change_status_fields($(this), result_check, TravelStep3.settings.error_1, TravelStep3.settings.error_0);
					}
					break;
				case 'insured_birth_date':
					if(change_status_field === true) {
						var text_message = 'Не вірні параметри дати народження';
						if(!TravelStep3.calculateDate2($(this).val(),$(this))){
							change_status_fields($(this), true, text_message);
						}
						else{
							var result_check = check_field_error($(this).val(), TravelStep3.settings.dateReg);
							change_status_fields($(this), result_check, text_message);
						}
					}
					break;
				case 'insured_city':
					if(change_status_field === true) {
						var result_check = check_field_error($(this).val(), TravelStep3.settings.addressReg);
						change_status_fields($(this), result_check, TravelStep3.settings.error_2, TravelStep3.settings.error_0);
					}
					break;
				case 'insured_email':
					if(change_status_field === true) {
						var result_check = check_field_error($(this).val(), TravelStep3.settings.emailReg);
						change_status_fields($(this), result_check, TravelStep3.settings.error_3, TravelStep3.settings.error_3_1);
					}
					break;
				case 'insured_phone':
					if(change_status_field === true) {
						var result_check = check_field_error($(this).val(), TravelStep3.settings.phoneNumberReg);
						change_status_fields($(this), result_check, TravelStep3.settings.error_phone, TravelStep3.settings.error_phone);
					}
					break;
				case 'address_for_send_input_s3':
				case 'index_for_send_input_s3':
					if(change_status_field === true) {
						if($('#checkbox_1_s3').prop("checked")){
							var result_check_address = check_field_error($('#address_for_send_input_s3').val(), TravelStep3.settings.addressReg);
							var result_check_index = check_field_error($('#index_for_send_input_s3').val(), TravelStep3.settings.numberReg);
							if(result_check_address === true) {
								change_status_fields($('#address_for_send_input_s3'), result_check_address, TravelStep3.settings.error_2, TravelStep3.settings.error_7);
							}
							else if(result_check_index === true) {
								change_status_fields($('#index_for_send_input_s3'), result_check_index, TravelStep3.settings.error_6, TravelStep3.settings.error_7);
							}
							else {
								change_status_fields($('#address_for_send_input_s3'), false, TravelStep3.settings.error_6, TravelStep3.settings.error_7);
								change_status_fields($('#index_for_send_input_s3'), false, TravelStep3.settings.error_6, TravelStep3.settings.error_7);
							}
						}
					}
					break;
				/*
				case 'index_for_send_input_s3':
					if(change_status_field === true) {
						if($('#checkbox_1_s3').prop("checked")){
							var result_check = check_field_error($(this).val(), TravelStep3.settings.numberReg);
							change_status_fields($(this), result_check, TravelStep3.settings.error_6, TravelStep3.settings.error_7);
						}
					}
					break;
					*/
				case 'pay_type':
				case 'insured_checkbox_2_s3':
					if(change_status_field === true) {
						var result_check = !$(this).prop("checked");
						change_status_fields($(this), result_check, TravelStep3.settings.error_5);
					}
					break;
			}
		});

		reactive_green_button($('.valid').length, $(".count_input_s3").length);
	},
	submitForm: function (){

		TravelStep3.checkList();
		$('.form_submit_s3').on('click', function(e){
			TravelStep3.check_all_field(true);

			if ($('.valid').length  == TravelStep3.settings.countInput) {
				$('#travel_step_3').submit();
			}
		});
	},

	otherPerson: function (){

		$('#insurance_insured').on('change', function () {

			var value = $(this).val().toString();

			if (value == "other") {
				TravelStep3.settings.last_name.val("").parents('.input_wrap').addClass('error').removeClass('ok').find('.message').html("<span>"+TravelStep3.settings.error_1+"</span>");
				TravelStep3.settings.first_name.val("").parents('.input_wrap').addClass('error').removeClass('ok').find('.message').html("<span>"+TravelStep3.settings.error_1+"</span>");
				TravelStep3.settings.passport.val("").parents('.input_wrap').addClass('error').removeClass('ok').find('.message').html("<span>"+TravelStep3.settings.error_1+"</span>");
				TravelStep3.settings.date_birth.val("").parents('.input_wrap').addClass('error').removeClass('ok').find('.message').html("<span>"+TravelStep3.settings.error_1+"</span>");
			} else if (value == "obj_0") {
				TravelStep3.calidateOnSelectChange(dateObj.obj_0.insured_last_name, dateObj.obj_0.insured_first_name, dateObj.obj_0.cnp, dateObj.obj_0.insured_birth_date);
			} else if (value == "obj_1") {
				TravelStep3.calidateOnSelectChange(dateObj.obj_1.insured_last_name, dateObj.obj_1.insured_first_name, dateObj.obj_1.cnp, dateObj.obj_1.insured_birth_date);
			} else if (value == "obj_2") {
				TravelStep3.calidateOnSelectChange(dateObj.obj_2.insured_last_name, dateObj.obj_2.insured_first_name, dateObj.obj_2.cnp, dateObj.obj_2.insured_birth_date);
			} else if (value == "obj_3") {
				TravelStep3.calidateOnSelectChange(dateObj.obj_3.insured_last_name, dateObj.obj_3.insured_first_name, dateObj.obj_3.cnp, dateObj.obj_3.insured_birth_date);
			}
		});


	},
	calidateOnSelectChange: function(param_last_name, param_first_name, param_passport, param_date_birth) {

		TravelStep3.settings.last_name.val(param_last_name).addClass('valid').removeClass('error').parents('.input_wrap').removeClass('error').addClass('ok').find('.message').text('');
		TravelStep3.settings.first_name.val(param_first_name).addClass('valid').removeClass('error').parents('.input_wrap').removeClass('error').addClass('ok').find('.message').text('');
		TravelStep3.settings.passport.val(param_passport).addClass('valid').removeClass('error').parents('.input_wrap').removeClass('error').addClass('ok').find('.message').text('');


		if(!TravelStep3.calculateDate2(param_date_birth,TravelStep3.settings.date_birth)){
			TravelStep3.settings.date_birth.addClass('error').removeClass('valid');
			TravelStep3.settings.date_birth.parents('.input_wrap').addClass('error').removeClass('ok').find('.message').html('<span>Не вірні параметри дати народження</span>');
		}else{
			TravelStep3.settings.date_birth.val(param_date_birth).addClass('valid').removeClass('error').parents('.input_wrap').removeClass('error').addClass('ok').find('.message').text('');
		}
	},
	forFix: function () {

		$('#checkbox_2_s3').on('change', function () {

			$(this).removeClass('valid');

			if($(this).prop("checked")){
				$(this).addClass('valid');
				$(this)
					.parents('.input_wrap')
					.removeClass('error')
					.addClass('ok')
					.find('.message')
					.text("");
				TravelStep3.greenButton();
			}else{
				$(this)
					.parents('.input_wrap')
					.addClass('error')
					.removeClass('ok')
					.removeClass('valid')
					.find('.message')
					.html("<span>"+TravelStep3.settings.error_5+"</span>");
				$('#greenButton').removeClass('green').addClass('gray');
			}
		});


		/**
		 * Доп поля для отправки писем.
		 */
		$('#checkbox_1_s3').on('change', function () {


			$(this).removeClass('valid');
			if($(this).prop("checked")){
				$('#greenButton').removeClass('green').addClass('gray');

				$('.for-send').removeClass('hidden');
				TravelStep3.settings.address_for_send_input_s3.addClass('count_input_s3');
				TravelStep3.settings.index_for_send_input_s3.addClass('count_input_s3');
			}else{
				$('.for-send').addClass('hidden');
				TravelStep3.settings.address_for_send_input_s3.removeClass('count_input_s3').removeClass('error');
				TravelStep3.settings.index_for_send_input_s3.removeClass('count_input_s3').removeClass('error');
				$(this).parents('.input_wrap').removeClass('error').removeClass('ok').find('.message').text("");
			}
			TravelStep3.settings.countInput = $('.count_input_s3').length;
		});


		$('#insured_pay_system_1_s3').on('change', function () {
			$(this).removeClass('valid');
			$(this).removeClass('count_input_s3');
			$(this).removeClass('valid');


			if($(this).prop("checked")){
				$(this).addClass('count_input_s3');
				$(this).addClass('valid');
				$('#insured_pay_system_2_s3')
					.removeClass('count_input_s3')
					.removeClass('valid');
				$(this).parents('.input_wrap').removeClass('error').removeClass('ok').addClass('ok').find('.message').text("");

			}else{
				$(this).removeClass('count_input_s3');
				$(this).removeClass('valid');
				$('#insured_pay_system_2_s3').addClass('count_input_s3');

			}
		});


		$('#insured_pay_system_2_s3').on('change', function () {
			$(this).removeClass('valid');
			$(this).removeClass('count_input_s3');
			$(this).removeClass('valid');

			if($(this).prop("checked")){
				$(this).addClass('count_input_s3');
				$(this).addClass('valid');
				$('#insured_pay_system_1_s3')
					.removeClass('count_input_s3')
					.removeClass('valid');
				$(this).parents('.input_wrap').removeClass('error').removeClass('ok').addClass('ok').find('.message').text("");
				//		TravelStep3.greenButton();
			}else{
				$(this).removeClass('count_input_s3');
				$(this).removeClass('valid');
				$('#insured_pay_system_1_s3').addClass('count_input_s3');
				//	$(this).parents('.input_wrap').removeClass('error').removeClass('ok').addClass('ok').find('.message').text("");
				//	$('#greenButton').removeClass('green').addClass('gray');
			}
		});
		TravelStep3.checkList();
	}
}


/*
Костылики, костылики,... Исправляем приветы от Румынов!
 */
function reactive_green_button(count_real, count_need) {
	if (count_real  == count_need && count_need>0) {
		$('#greenButton').removeClass('gray').addClass('green');
	}else{
		$('#greenButton').removeClass('green').addClass('gray');
	}
}
function check_field_error(value, nameReg) {
//	if (value.length > 0 && value != '' && nameReg.test(value)) {
	if (value.length > 0 && value != '' && value.search(nameReg)!=-1) {
		//ошибок нет
		return false;
	}
	else {
		//ошибка!
		return true;
	}
}
function change_status_fields(obj, its_error, message_error, message_valid) {
	if(its_error === true) {
		obj.addClass('error').removeClass('valid');
		obj.parents('.input_wrap').addClass('error').removeClass('ok').find('.message').html("<span>"+message_error+"</span>");
	}
	else {
		obj.addClass('valid').removeClass('error');
		obj.parents('.input_wrap').removeClass('error').addClass('ok').find('.message').text(message_valid);
	}
}




/**
 *  Нотифай
 *  FIXME : kill !!!
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
