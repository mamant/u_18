/**
 * Created by alex on 16.06.16.
 */

$(document).ready( function() {
    /**
     * TODO: Убить если не понадобится
     * ЗЫ: ловит меседж , или будет ловить из куки и засовывать в
     * нотифай.
     * @type {string}
     */



    $('#casco_city').selectric(/*onOpen: function() {},*/);
    $('#casco_brend').selectric(); //TODO : закоментить если включать автокомплит
    $('#casco_currency').selectric();
    $('#casco_date_manufacture').selectric();
    $('#casco_pay_type').selectric();
    $('#casco_pay_type_check').selectric();


    //TODO: нужно для автокомплита , пока не работает
    // $( "#casco_brend" ).autocomplete({
    //     source: availableTags,
    //     select: function (event, ui) {
    //         $('#casco_brend_auto').val(ui.item.label);
    //         $('#casco_brend').val(ui.item.value);
    //         return false;
    //     },
    //     change: function( event, ui ) {
    //         $("#casco_brend").val(ui.item ? ui.item.value : 0);
    //     }
    // });

    var loc = window.location.hash.replace("#","");
    if (loc == "casco_message") {
		notify($('#casco_second').find('.content').html());
        //$('#casco_second').css('display','block');
        //closePopup();
    }
    if (loc == "casco_message2") {
		notify($('#casco_first').find('.content').html());
        //$('#casco_first').css('display','block');
        //closePopup();
    }

    CascoWidget.init();
});


var CascoWidget = {


    count_valid_fields          :   6,
    count_valid_form_fields     :   3,
    input_count                 :   7, //Базовое количество полей для заполнения
    input_count_all             :   3,
     /**
     * Метод инициализации вижета.
     * Запускаем базовые настройки для провильной обработки.
     */
    init: function(){

        $(document).on('blur change', '#casco input,#casco select', function () {
            $('#casco_price')
                .val($('#casco_price')
                    .val().replace(/(\s)/g, '')
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ")
                );
            CascoWidget.cheakAllFields();
        });



        CascoWidget.checkForms($('#casco_all_franshices input'));
        CascoWidget.checkForms($('#casco_form input'));

        $('#casco_submit').on('click',function(){
            CascoWidget.submitForm($('#casco_all_franshices input'));
            return false;
        });

     },

    /**
     * Метод обработки формы для всех франшиз.
     */
    checkForms: function(form,submit){
        
     //   $("#casco_all_phone").mask("+38 (099) 9999999");
        if(submit) {
        //    console.log('валидация полей для формы по франшизам.');

            var i = 0;
            class_name ='_form';
            form.each(function(nf, form){

                i=i+1;
                CascoWidget
                    .validateField(
                        $(this).attr('id'),
                        $(this).val(),
                        $(this).attr('data'),
                        $(this).attr('data-label'),
                        class_name
                    );

            });

          //  console.log('asdfasd');
            if(CascoWidget.input_count_all == i){
                if($('.valid'+class_name+'').length  == CascoWidget.count_valid_form_fields){

                 //   console.log('Можно отравлять данные.');
                    $('#casco_submit').addClass('green').removeClass('gray');
                    return true;
                }else{
                //    console.log('Не все обязательные поля заполнили !!!');
                    $('#casco_submit').addClass('gray').removeClass('green');
                    return false;
                }
            }else{
             //   console.log('invalid',i);
                $('#casco_submit').addClass('gray').removeClass('green');
                return false;
            }
        }else{
            form.on('blur',function () {
                // $(document).on('blur', '#casco_all_franshices input', function () {


				class_name ='_form';
				CascoWidget
					.validateField(
						$(this).attr('id'),
						$(this).val(),
						$(this).attr('data'),
						$(this).attr('data-label'),
						class_name
					);
				var i = 0;
                /**
                 * FIXME: Тот кто переписывал потом пускай и мучается , так - ка закоменчиванием убывается провеку на
                 * валидность всех полей.
                 *
                 */
				form.each(function(nf, form){
					i=i+1;});

				// вариант который точно работал но светился красным
				/*
				var i = 0;
                class_name ='_form';
                form.each(function(nf, form){
                    i=i+1;
                    CascoWidget
                        .validateField(
                            $(this).attr('id'),
                            $(this).val(),
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                });
                */

                if(CascoWidget.input_count_all == i){
                    if($('.valid'+class_name+'').length  == CascoWidget.count_valid_form_fields){

                    //    console.log('Можно отравлять данные.');
                        $('#casco_submit').addClass('green').removeClass('gray');
                        return true;
                    }else{
                    //    console.log('Не все обязательные поля заполнили !!!');
                        $('#casco_submit').addClass('gray').removeClass('green');
                        return false;
                    }
                }else{
                 //   console.log('invalid',i);
                    $('#casco_submit').addClass('gray').removeClass('green');
                    return false;
                }

            });
        }
    },

    submitForm: function(form){
        if(CascoWidget.checkForms(form,true)){
            $('#casco_all_franshices').submit();//TODO : псле тестов сделать рефакторинг
        }
    },
    /**
     * Фанка проверяет все ли поля заполнены .
     * ЗЫ: не валидирует .
     * @param input_count
     */
    cheakAllFields: function (){

        var i = 0,data = {};
        $('#casco input,#casco select').each(function(nf, form){


        //    console.log($(this).attr('id'));

            class_name ='';
            if($(this).attr('id') =='casco_sto_0' || $(this).attr('id') =='casco_sto_1'){
                $(this).removeClass('ok').removeClass('valid');

                if($(this).prop( "checked" )){
                    i=i+1;
                    var sto = $(this).attr('id').split('_');
                    data[sto[0]+"_"+sto[1]] = $(this).val();
                    CascoWidget
                        .validateField(
                            $(this).attr('id'),
                            $(this).val(),
                            '',
                            '',
                            class_name
                        );
                }
            }else{
                if($(this).val() !=='' ){

                    i=i+1;
                    data[$(this).attr('id')] = $(this).val();

                    if($(this).attr('id') !=='casco_currency')

                    CascoWidget
                        .validateField(
                            $(this).attr('id'),
                            $(this).val(),
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                }
            }
        });

     //   console.log('Count of inputs '+CascoWidget.input_count,'Valid fields '+CascoWidget.count_valid_fields,'Actual length '+$('.valid').length);

        if(CascoWidget.input_count == i){
            if($('.valid').length  == CascoWidget.count_valid_fields){
           //     console.log("Форму по расчету для КАСКО можно тправлять.");
                CascoWidget.getCascoCalcResult(data);
            }else{
            //    console.log('Не все обязательные поля заполнили !!!');
            }
        }else{
            $('.pre_sum').html(0);
        }
    },


    /**
     * Валидация полей
     * @param feild_id
     * @param field_val
     */
    validateField: function (feild_id,field_val,reg,error_message,class_name){



        var err =0;
        reg = new RegExp(reg,'i');

        if(field_val.search(reg)!=-1){ err=1 }

        if(err == 1){
            $('#'+feild_id)
                .addClass('valid'+class_name+'')
                .removeClass('error')
                .parents('.input_wrap')
                .removeClass('error')
                .addClass('ok')
                .find('.message')
                .text('');
        }else{
            $('#'+feild_id)
                .parents('.input_wrap')
                .removeClass('ok')
                .removeClass('valid'+class_name+'')
                .addClass('error')
                .find('.message')
                .html('<span>'+error_message+'</span>');
        }
    },
    /**
     * Фанка для получение результатов расчета калькулятора.
     * @param data
     */
    getCascoCalcResult: function (data){

        data['ajax'] = true;

        //  console.log(data);

        $.ajax({
            method: "POST",
            url: "ua/private/auto/kasko/pokupka_kasko/",
            data: data
        })
        .done(function( response ) {

            console.log( response );
            if( response ){

                $('#pre_sum_0').html(number_format(response.base_rate[0].ins_sum.replace(',', '.'), 2, ',', ' ')+" грн");
                $('#pre_sum_1').html(number_format(response.base_rate[1].ins_sum.replace(',', '.'), 2, ',', ' ')+" грн");
                $('#pre_sum_2').html(number_format(response.base_rate[2].ins_sum.replace(',', '.'), 2, ',', ' ')+" грн");
                $('#pre_sum_3').html(number_format(response.base_rate[3].ins_sum.replace(',', '.'), 2, ',', ' ')+" грн");

                var hr_0 = $("#travel_tourism_next_green_0").attr('href').split('&');
                hr_0_str ='';
                for(i0 in hr_0 ){
                    if(hr_0[i0].search(/ins_/)!=-1){
                       hr_0[i0] ='ins_id='+response.base_rate[0].id;
                    }
                }
                hr_0_str = hr_0.join('&');

                var hr_1 = $("#travel_tourism_next_green_1").attr('href').split('&');
                hr_1_str ='';
                for(i1 in hr_1 ){
                    if(hr_1[i1].search(/ins_/)!=-1){
                        hr_1[i1] ='ins_id='+response.base_rate[1].id;
                    }
                }
                hr_1_str = hr_1.join('&');

                var hr_2 = $("#travel_tourism_next_green_2").attr('href').split('&');
                hr_2_str ='';
                for(i2 in hr_2 ){
                    if(hr_2[i2].search(/ins_/)!=-1){
                        hr_2[i2] ='ins_id='+response.base_rate[2].id;
                    }
                }
                hr_2_str = hr_2.join('&');

                var hr_3 = $("#travel_tourism_next_green_3").attr('href').split('&');
                hr_3_str ='';

                for(i3 in hr_3 ){
                    if(hr_3[i3].search(/ins_/)!=-1){
                        hr_3[i3] ='ins_id='+response.base_rate[3].id;
                    }
                }
                hr_3_str = hr_3.join('&');

                $("#travel_tourism_next_green_0").attr('href',hr_0_str);
                $("#travel_tourism_next_green_1").attr('href',hr_1_str);
                $("#travel_tourism_next_green_2").attr('href',hr_2_str);
                $("#travel_tourism_next_green_3").attr('href',hr_3_str);

                // console.log($("#travel_tourism_next_green_0").attr('href'));
                // console.log($("#travel_tourism_next_green_1").attr('href'));
                // console.log($("#travel_tourism_next_green_2").attr('href'));
                // console.log($("#travel_tourism_next_green_3").attr('href'));

                
                $('#you_chise_casco_city').html(response.post.casco_city);
                $('#you_chise_casco_brend').html(response.post.casco_brend);
                $('#you_chise_casco_price').html(response.post.casco_price);
                $('#you_chise_casco_date_manufacture').html(response.post.casco_date_manufacture);


                $('#your_choise').css('display','block');
                $('#franchice').css('display','block');
                $('#faq_content').css('display','none');
            }else{
                //console.log( response );
            }
        });
    },



}