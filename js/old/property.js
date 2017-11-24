/**
 * Created by alex on 17.08.16.
 */
$(document).ready( function() {
    $.datepicker.setDefaults($.datepicker.regional['ua']);
    PropertyWidget.init();
});


var PropertyWidget = {

    settings: {
        'token':'3412sadfsadfasdfasdfcasdfa',
        input_count_all: 28,
        count_valid_form_fields:26,
        form_data:[],
    },

    init: function (){

        $('#property_square').on('blur keyup',function(){
            PropertyWidget.getPreInfo($(this));
        });

        $("#property_user_phone_number").mask("+38 (099) 9999999");

        $('#property_user_date_birth')
            .datepicker({
                dateFormat: 'dd.mm.yy',
                maxDate:  '-18 year',
                defaultDate: '01.01.1982',
                firstDay: 1,
                constraintInput: true,
                changeYear: true,
                changeMonth: true,
                minDate:"-100 year",
                beforeShow: function() {
                    $('#ui-datepicker-div').addClass("osago-picker");
                }
            });


        $('#property_user_passport_date')
            .datepicker({
                dateFormat: 'dd.mm.yy',
                defaultDate: '01.01.2000',
                maxDate:            'now',
                firstDay: 1,
                constraintInput: true,
                changeYear: true,
                changeMonth: true,
                beforeShow: function() {
                    $('#ui-datepicker-div').addClass("osago-picker");
                }
            });

        $('#property_desired_start_date')
            .datepicker({
                dateFormat: 'dd.mm.yy',
                maxDate:  '+30 day',
                firstDay: 1,
                constraintInput: true,
                minDate:"now +1 day",
                beforeShow: function() {
                    $('#ui-datepicker-div').addClass("osago-picker");
                }
            });

        PropertyWidget.cheackForm($('#property_step2 input,#property_step2 select'));


        $('#property_submit').on('click',function(){
            PropertyWidget.submitForm($('#property_step2 input,#property_step2 select'));
        });

        //Поумолчанию выключаем все поля...
        // $('fieldset.closed input,fieldset.closed select,fieldset.closed radio').attr("disabled", true);
    },

    getPreInfo:function(e){

        var square  = e.val();
        var err     = 0;
        var class_name = '_form';
        if(square == ''){
            err =1;
        }

        // if(square.length <2){
        //     err =1;
        // }

        if(parseFloat(square) < 14.99){
            err =1;
        }else if(parseFloat(square) > 999.99){
            err = 1;
        }

        if(err > 0){
            PropertyWidget
                .validateField(
                    e.attr('id'),
                    'error',
                    e.attr('data'),
                    e.attr('data-label'),
                    class_name
                );
            return;
        }else{
            PropertyWidget
                .validateField(
                    e.attr('id'),
                    e.val(),
                    e.attr('data'),
                    e.attr('data-label'),
                    class_name
                );
        }


        var data = {};
        data['property_square'] = e.val();

        data['ulr']    = '/ua/private/home/kvartira/pokupka_kvartyra/?type=property';
        data['ajax']   = true;

        PropertyWidget.sendAjaxStep1(data,PropertyWidget.showPreInfo);
    },
    /**
     * Метод выводит информацию полученую по AJAX - запросу для предварительного
     * просчета стоимости по франшизам.
     * @param result
     */
    showPreInfo:function( result ){

        if(result != ''){
            $('.dgo-inner').css('display','block');

            $('#pre_sum_std20').html(result.ajax[0].SUM);
            $('#pre_sum_std21').html(result.ajax[1].SUM);

        }else{
            $('.dgo-inner').css('display','none');
        }

    },

    /**
     * Преобразование даты.
     * @param date
     * @returns {Date}
     */
    getNewDate: function(date){
        var new_date = date.split('.');
        return new Date(new_date[2],new_date[1],new_date[0]);
    },

    /**
     * Метод сверки дат
     * (Выдачи паспота и даты рождения)
     * @param date_birth
     * @param date_passport
     * @returns {boolean}
     */
    cheackDatePassport: function (date_birth,date_passport) {
        var date_now = new Date();
        if(!date_birth)
            return false;

        date_birth      = PropertyWidget.getNewDate(date_birth);
        date_passport   = PropertyWidget.getNewDate(date_passport);

        if (date_birth.getTime() > date_passport.getTime()) {
            return false;
        } else{
            if((date_passport.getTime() - 30*24*60*60*1000 ) >= date_now.getTime()){
                return false;
            }
            return true;
        }
    },
    
    
    
    
    /**
     * Метод валидации всех полей формы.
     * @param form
     * @param sub
     */
    cheackForm: function (form,sub) {

       var  class_name ='_form';
        var now_year = new Date().getFullYear();


        form.on('change',function () {
            var class_name ='_form';
            if($(this).attr('id') == 'property_desired_start_date'){

                var date = $(this).val();
                var n = date.split('.');

                if(n[1] > 12 || n[0] >31){
                    PropertyWidget
                        .validateField(
                            $(this).attr('id'),
                            'error',
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                    return;
                }

                /**
                 * Проверка кода подтверждения для номера телефона
                 */
                if($(this).attr('id') == 'property_user_phone_number_confirm'){

                    var data  = {
                        'code':  $(this).val(),
                        'token':    PropertyWidget.settings.token
                    }
                    PropertyWidget.sendAjax(data,PropertyWidget.getSmsResponse);
                }


                var data =  {
                    'token'         :   '3412sadfsadfasdfasdfcasdfa',
                    'desired_start_date'    :$(this).val()
                }
                PropertyWidget.sendAjax(data,PropertyWidget.getStartDateResponse);
            }

            if( $(this).attr('id') !=='property_user_phone_number' &&
                $(this).attr('id') !=='property_user_phone_number_confirm' &&
                $(this).attr('id') !=='property_pay_type_liqpay' &&
                $(this).attr('id') !=='property_pay_type_portmone'&&
                //  $(this).attr('id') !=='property_conditions' &&
                $(this).attr('id') != undefined
            ){
                PropertyWidget.onOffSms();
            }


            if($(this).attr('id') == 'property_form_1_auto_serial_number' ) {
                $(this).val($(this).val().toUpperCase());
            }

            if($(this).attr('id') == 'property_form_1_auto_reg_number' ) {
                $(this).val($(this).val().toUpperCase());
            }

            /**
             * Обработка данных для поля района.
             */
            if($(this).attr('id') == 'property_user_obl'){
                $('#property_as_user_data').attr('checked',false);
                $('#property_as_user_data').prop('checked',false);

                var data  = {
                    'obl_id':   $(this).val(),
                    'token':    PropertyWidget.settings.token
                }

                $('#property_user_city').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok') ;
                $('#property_user_region').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok') ;
                $('#property_user_index').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok');


                if($(this).val() == '10'){
                    PropertyWidget.stateKiev($(this).val());
                }
                PropertyWidget.sendAjax(data,PropertyWidget.setRegion);

            }

            if($(this).attr('id') == 'property_user_region'){
             //   $('#property_as_user_data').prop('checked',false);

                if($(this).val() !== ''){
                    var data  = {
                        'reg_id':   $(this).val(),
                        'obl_id':   $('#property_user_obl').val(),
                        'token':    PropertyWidget.settings.token
                    }

                    $('#property_user_city').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');
                    $('#property_user_index').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');


                    PropertyWidget.sendAjax(data,PropertyWidget.getCity);
                }
            }

            if($(this).attr('id') == 'property_user_city'){
              //  $('#property_as_user_data').prop('checked',false);
                if($(this).val() !== ''){
                    var data  = {
                        'reg_id':   $('#property_user_region').val(),
                        'obl_id':   $('#property_user_obl').val(),
                        'city_id':  $(this).val(),
                        'token':    PropertyWidget.settings.token
                    }

                    $('#property_user_index').parents('.input_wrap').removeClass('ok').removeClass('valid_form') ;

                    PropertyWidget.sendAjax(data,PropertyWidget.getCityIndex);
                }
            }

            if($(this).attr('id') != 'property_conditions' ) {
                PropertyWidget
                    .validateField(
                        $(this).attr('id'),
                        $(this).val(),
                        $(this).attr('data'),
                        $(this).attr('data-label'),
                        class_name
                    );
            }

            if($(this).attr('id') == 'property_conditions' ){
                if(!$(this).prop( "checked" )){
                    $(this)
                        .removeClass('valid'+class_name+'')
                        .parents('.input_wrap')
                        .removeClass('ok')
                        .removeClass('valid'+class_name+'')
                        .addClass('error')
                        .find('.message')
                        .html('<span>'+ $(this).attr('data-label')+'</span>');
                }else{
                    PropertyWidget
                        .validateField(
                            $(this).attr('id'),
                            $(this).val(),
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                }
            }


            /**
             * property_user_obl_owner
             * property_user_region_owner
             * property_user_city
             * property_user_index_owner
             * property_user_adress_owner
             * property_user_email_owner
             *
             * property_as_user_data -- при нажатии срабатывание подстановки данных из полей
             * выше заполненной формы.
             */


            if($(this).attr('id') == 'property_as_user_data' ){

                console.log($(this).prop( "checked" ),$(this).attr( "checked" ));

                if($(this).prop( "checked" ) === true){

                    //$('#property_user_obl_owner option').removeAttr('selected');
                    //$('#property_user_obl_owner option[value="'+$('#property_user_obl option:selected').val()+'"]').attr('selected', 'selected');


                    $('#property_user_obl_owner').html($('#property_user_obl').html());
                    $('#property_user_obl_owner option[value="'+$('#property_user_obl option:selected').val()+'"]').attr('selected', 'selected');

                    $('#property_user_region_owner').html($('#property_user_region').html());
                    $('#property_user_region_owner option[value="'+$('#property_user_region option:selected').val()+'"]').attr('selected', 'selected');

                    $('#property_user_city_owner').html($('#property_user_city').html());
                    $('#property_user_city_owner option[value="'+$('#property_user_city option:selected').val()+'"]').attr('selected', 'selected');

                    $('#property_user_index_owner').html($('#property_user_index').html());
                    $('#property_user_index_owner option[value="'+$('#property_user_index option:selected').val()+'"]').attr('selected', 'selected');

                    $('#property_user_adress_owner').val($('#property_user_adress').val());

                    var class_name = '_form';

                    PropertyWidget
                        .validateField(
                            $('#property_user_region_owner').attr('id'),
                            $('#property_user_region_owner').val(),
                            $('#property_user_region_owner').attr('data'),
                            $('#property_user_region_owner').attr('data-label'),
                            class_name
                        );

                    PropertyWidget
                        .validateField(
                            $('#property_user_city_owner').attr('id'),
                            $('#property_user_city_owner').val(),
                            $('#property_user_city_owner').attr('data'),
                            $('#property_user_city_owner').attr('data-label'),
                            class_name
                        );
                    PropertyWidget
                        .validateField(
                            $('#property_user_index_owner').attr('id'),
                            $('#property_user_index_owner').val(),
                            $('#property_user_index_owner').attr('data'),
                            $('#property_user_index_owner').attr('data-label'),
                            class_name
                        );
                    PropertyWidget
                        .validateField(
                            $('#property_user_adress_owner').attr('id'),
                            $('#property_user_adress_owner').val(),
                            $('#property_user_adress_owner').attr('data'),
                            $('#property_user_adress_owner').attr('data-label'),
                            class_name
                        );

                    PropertyWidget
                        .validateField(
                            $('#property_user_obl_owner').attr('id'),
                            $('#property_user_obl_owner').val(),
                            $('#property_user_obl_owner').attr('data'),
                            $('#property_user_obl_owner').attr('data-label'),
                            class_name
                        );

                }
            }



           /**
            * Обработка данных для поля района.
            */

            if($(this).attr('id') == 'property_user_obl_owner'){

                var data  = {
                    'obl_id':   $(this).val(),
                    'token':    PropertyWidget.settings.token
                }

                $('#property_user_city_owner').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok') ;
                $('#property_user_region_owner').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok') ;
                $('#property_user_index_owner').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok');


                if($(this).val() == '10'){
                    PropertyWidget.stateKievOwner($(this).val());
                }
                PropertyWidget.sendAjax(data,PropertyWidget.setRegionOwner);

            }



            if($(this).attr('id') == 'property_user_region_owner'){

                if($(this).val() !== ''){
                    var data  = {
                        'reg_id':   $(this).val(),
                        'obl_id':   $('#property_user_obl_owner').val(),
                        'token':    PropertyWidget.settings.token
                    }

                    $('#property_user_city_owner').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');
                    $('#property_user_index_owner').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');


                    PropertyWidget.sendAjax(data,PropertyWidget.getCityOwner);
                }
            }

            if($(this).attr('id') == 'property_user_city_owner'){
                if($(this).val() !== ''){
                    var data  = {
                        'reg_id':   $('#property_user_region_owner').val(),
                        'obl_id':   $('#property_user_obl_owner').val(),
                        'city_id':  $(this).val(),
                        'token':    PropertyWidget.settings.token
                    }

                    $('#property_user_index_owner').parents('.input_wrap').removeClass('ok').removeClass('valid_form') ;

                    PropertyWidget.sendAjax(data,PropertyWidget.getCityIndexOwner);
                }
            }



            PropertyWidget.addButton(form,false);

        });

        form.on('blur',function () {

            var class_name ='_form';
            if($(this).attr('id') == 'property_form_1_auto_date') {
                var year_claim = now_year - $(this).val();

                if(year_claim  == 0){
                    PropertyWidget
                        .validateField(
                            $(this).attr('id'),
                            $(this).val(),
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                }

            }


            if($(this).attr('id') == 'property_desired_start_date'){

                var date = $(this).val();
                var n = date.split('.');

                if(n[1] > 12 || n[0] >31){
                    PropertyWidget
                        .validateField(
                            $(this).attr('id'),
                            'error',
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                    return;
                }

                var data =  {
                    'token'         :   '3412sadfsadfasdfasdfcasdfa',
                    'desired_start_date'    :$(this).val()
                }
                PropertyWidget.sendAjax(data,PropertyWidget.getStartDateResponse);
            }


            if( $(this).attr('id') !=='property_user_phone_number' &&
                $(this).attr('id') !=='property_user_phone_number_confirm' &&
                $(this).attr('id') !=='property_pay_type_liqpay' &&
                $(this).attr('id') !=='property_pay_type_portmone'&&
                //  $(this).attr('id') !=='property_conditions' &&
                $(this).attr('id') != undefined
            ){
                PropertyWidget.onOffSms();
            }

            /**
             * Формула для валидации ИНН
             */
            if($(this).attr('id') == 'property_user_inn'){

                var inn = $(this).val();
                var inn_sum             = (-1*inn[0]+5*inn[1]+7*inn[2]+9*inn[3]+4*inn[4]+6*inn[5]+10*inn[6]+5*inn[7]+7*inn[8]);
                var inn_mod_11          = inn_sum%11;

                if(inn_mod_11 >9 )
                    inn_mod_11 = inn_mod_11%10;

                if(inn[9] != inn_mod_11){
                    $(this)
                        .removeClass('valid'+class_name+'')
                        .parents('.input_wrap')
                        .removeClass('ok')
                        .removeClass('valid'+class_name+'')
                        .addClass('error')
                        .find('.message')
                        .html('<span>'+ $(this).attr('data-label')+'</span>');
                }
            }
            /**
             * Проверка кода подтверждения для номера телефона
             */
            if($(this).attr('id') == 'property_user_phone_number_confirm'){

                var data  = {
                    'code':  $(this).val(),
                    'token':    PropertyWidget.settings.token
                }
                PropertyWidget.sendAjax(data,PropertyWidget.getSmsResponse);
            }



            if($(this).attr('id') == 'property_user_passport_date'){

                var date = $(this).val();
                var n = date.split('.');

                if(n[1] > 12 || n[0] >31){
                    DgooWidget
                        .validateField(
                            $(this).attr('id'),
                            'error',
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                    return;
                }

                var data =  {
                    'token'         :   '3412sadfsadfasdfasdfcasdfa',
                    'date_birth'    :   $('#property_user_date_birth').val(),
                    'date_passport' :   $(this).val()
                }
                PropertyWidget.sendAjax(data,PropertyWidget.getPassportDateResponse);
            }

            if($(this).attr('id') == 'property_form_1_auto_serial_number' ) {
                $(this).val($(this).val().toUpperCase());
            }

            if($(this).attr('id') == 'property_form_1_auto_reg_number' ) {

                $(this).val($(this).val().toUpperCase());
                console.log($(this).val());
            }


            if($(this).attr('id') == 'property_user_date_birth'){

                var date = $(this).val();
                var n = date.split('.');

                var date = $(this).val();
                var n = date.split('.');

                if(n[1] > 12 || n[0] >31){
                    PropertyWidget
                        .validateField(
                            $(this).attr('id'),
                            'error',
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                    return;
                }


                var n3 =  new Date(n[2] + '/' + n[1] + '/' + n[0]),
                    b = new Date(),
                    age = b.getFullYear() - n3.getFullYear();

                var years = n3.setFullYear(1972) < b.setFullYear(1972) ? age - 1 : age;

                if(years < 18){

                    PropertyWidget
                        .validateField(
                            $(this).attr('id'),
                            'error',
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                    return;
                }else{
                    if(years >= 100){
                        PropertyWidget
                            .validateField(
                                $(this).attr('id'),
                                'error',
                                $(this).attr('data'),
                                $(this).attr('data-label'),
                                class_name
                            );
                        return;
                    }
                }
            }


            if($(this).attr('id') == 'property_user_passport_series' ) {

                if( $('#property_user_passport_number').val()=='' ||
                    $('#property_user_passport_number').val().length != 6  ){

                    $(this)
                        .parents('.input_wrap')
                        .removeClass('ok')
                        .removeClass('valid'+class_name+'');
                }

            }
            if($(this).attr('id') == 'property_user_passport_number' ) {
                if($('#property_user_passport_series').val().length < 2 )

                    $(this)
                        .removeClass('error')
                        .parents('.input_wrap')
                        .removeClass('ok')
                        .removeClass('valid'+class_name+'')
                        .removeClass('error')
                        .find('.message')
                        .html('');
            }

            PropertyWidget.addButton(form,false);
        });
    },
    stateKiev: function(id){
        // console.log(id);

        //10|70|800

        var token = '3412sadfsadfasdfasdfcasdfa';
        var data_city  = {
            'reg_id':   70,
            'obl_id':   $('#property_user_obl').val(),
            'token' :   token
        }

        $('#property_user_city').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');
        $('#property_user_index').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');

        PropertyWidget.sendAjax(data_city,PropertyWidget.getCity);

        var data  = {
            'reg_id'    :   70,
            'obl_id'    :   $('#property_user_obl').val(),
            'city_id'   :   800,
            'token'     :   token
        }

        PropertyWidget.sendAjax(data,PropertyWidget.getCityIndex);

    },
    stateKievOwner: function(id){
        // console.log(id);

        //10|70|800

        var token = '3412sadfsadfasdfasdfcasdfa';
        var data_city  = {
            'reg_id':   70,
            'obl_id':   $('#property_user_obl_owner').val(),
            'token' :   token
        }

        $('#property_user_city_owner').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');
        $('#property_user_index_owner').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');

        PropertyWidget.sendAjax(data_city,PropertyWidget.getCityOwner);

        var data  = {
            'reg_id'    :   70,
            'obl_id'    :   $('#property_user_obl_owner').val(),
            'city_id'   :   800,
            'token'     :   token
        }

        PropertyWidget.sendAjax(data,PropertyWidget.getCityIndexOwner);

    },
    onOffSms: function(){
        var class_name ='_form';
        $('#property_user_phone_number,#property_user_phone_number_confirm').val('')
        // .parents('.input_wrap')
        // .removeClass('ok')
        // .removeClass('error')
        // .removeClass('valid'+class_name+'');

            .removeClass('osago_phone_ok')
            .removeClass('valid')
            .removeClass('valid_form')
            .parents('.input_wrap')
            .removeClass('ok')
            .removeClass('osago_phone_ok')
            .removeClass('error')
            .removeClass('valid'+class_name+'')
            .find('.message')
            .removeClass('osago_phone_ok')
            .html('');

        //  console.log('sadfasdf');

        $('input[name=property_phone_button]')
            .val('Пiдтвердити через SMS')
            .removeClass('green')
            .removeClass('blue')
            .addClass('grey');

        var data  = {
            'code_off'  : true   ,
            'token'     : PropertyWidget.settings.token
        }
        PropertyWidget.sendAjax(data,function(response){
            // console.log(response);
        });

        if($('#property_user_phone_number_confirm').hasClass('notif')) {

            $('#property_user_phone_number_confirm').removeClass('notif');
            notify($('#property_phone_cheak_sms').html());
        }
    },
    /**
     * Проходимся по всем полям формы и если все сходится то добавляем
     * зеленую кнопку.
     * @param form
     * @param cheack_all
     * @returns {boolean}
     */
    addButton: function (form,cheack_all){

        // console.log('Add Button !');

        var class_name ='_form';
        var i_count = 1;
        form.each(function(nf, form) {

            if($(this).attr('id') == undefined) {
                return;
            }
            if($(this).attr('name') == 'property_phone_button'){
                return ;
            }

            if(cheack_all)
                if($(this).attr('id') == 'property_user_phone_number_confirm'){

                    var data  = {
                        'code':  $(this).val(),
                        'token':    PropertyWidget.settings.token
                    }
                    PropertyWidget.sendAjax(data,PropertyWidget.getSmsResponse);
                    return;
                }

            if($(this).attr('id') == 'property_user_passport_date'){

                var date = $(this).val();
                var n = date.split('.');

                if(cheack_all)
                    if($(this).val() ==''){
                        PropertyWidget
                            .validateField(
                                $(this).attr('id'),
                                'error',
                                $(this).attr('data'),
                                $(this).attr('data-label'),
                                class_name
                            );
                        return;
                    }

                if(n[1] > 12 || n[0] >31 ){
                    PropertyWidget
                        .validateField(
                            $(this).attr('id'),
                            'error',
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                    return;
                }

                var data =  {
                    'token'         :   '3412sadfsadfasdfasdfcasdfa',
                    'date_birth'    :   $('#property_user_date_birth').val(),
                    'date_passport' :   $(this).val()
                }
                PropertyWidget.sendAjax(data,PropertyWidget.getPassportDateResponse);
                return;
            }


            if($(this).attr('id') == 'property_user_inn'){

                if(cheack_all){
                    var inn = $(this).val();
                    var inn_sum             = (-1*inn[0]+5*inn[1]+7*inn[2]+9*inn[3]+4*inn[4]+6*inn[5]+10*inn[6]+5*inn[7]+7*inn[8]);
                    var inn_mod_11          = inn_sum%11;

                    if(inn_mod_11 >9 )
                        inn_mod_11 = inn_mod_11%10;

                    if(inn[9] != inn_mod_11){
                        $(this)
                            .removeClass('valid')
                            .removeClass('valid'+class_name)
                            .parents('.input_wrap')
                            .removeClass('ok')
                            .removeClass('valid'+class_name)
                            .addClass('error')
                            .find('.message')
                            .html('<span>'+ $(this).attr('data-label')+'</span>');
                        return;
                    }
                }
            }
            if($(this).attr('id') == 'go_user_date_birth'){


                var date = $(this).val();
                var n = date.split('.');


                if(n[1] > 12 || n[0] >31){
                    OsagoWidget.step2
                        .validateField(
                            $(this).attr('id'),
                            'error',
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                    return;
                }


                var n3 =  new Date(n[2] + '/' + n[1] + '/' + n[0]),
                    b = new Date(),
                    age = b.getFullYear() - n3.getFullYear();

                var years = n3.setFullYear(1972) < b.setFullYear(1972) ? age  : age - 1;

                //console.log(date,years,age);

                if(years < 18){

                    OsagoWidget.step2
                        .validateField(
                            $(this).attr('id'),
                            'error',
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                    return;
                }else{
                    if(years >=100){
                        OsagoWidget.step2
                            .validateField(
                                $(this).attr('id'),
                                'error',
                                $(this).attr('data'),
                                $(this).attr('data-label'),
                                class_name
                            );
                        return;
                    }
                }
            }
            if($(this).attr('id') == 'property_conditions' ){
                if(!$(this).prop( "checked" )){
                    if(cheack_all)
                        $(this)
                            .removeClass('valid'+class_name+'')
                            .parents('.input_wrap')
                            .removeClass('ok')
                            .removeClass('valid'+class_name+'')
                            .addClass('error')
                            .find('.message')
                            .html('<span>'+ $(this).attr('data-label')+'</span>');

                    return ;
                }
            }

            if(cheack_all)
                if($(this).attr('id') == 'property_desired_start_date'){



                    var date = $(this).val();
                    var n = date.split('.');


                    if(n[1] > 12 || n[0] >31 || $(this).val() == '' ){
                        PropertyWidget
                            .validateField(
                                $(this).attr('id'),
                                'error',
                                $(this).attr('data'),
                                $(this).attr('data-label'),
                                class_name
                            );
                        return;
                    }


                    var data =  {
                        'token'         :   '3412sadfsadfasdfasdfcasdfa',
                        'desired_start_date'    :$(this).val()
                    }
                    PropertyWidget.sendAjax(data,PropertyWidget.getStartDateResponse);
                    return;
                }


            // if($(this).attr('id') != 'property_pay_type_portmone' &&
            //     $(this).attr('id') != 'property_pay_type_liqpay'
            // ){
            if(cheack_all)
                PropertyWidget
                    .validateField(
                        $(this).attr('id'),
                        $(this).val(),
                        $(this).attr('data'),
                        $(this).attr('data-label'),
                        class_name
                    );

            i_count ++;
            // }
        });
        /**
         * добавляем ++ если выбрали платежную систему
         */


        if($('input[name=property_pay_type]').filter(':checked').val() != undefined){
            //убиваем все валидные теги
            $('input[name=property_pay_type]')
                .removeClass('ok')
                .removeClass('valid'+class_name+'')
                .removeClass('valid');

            PropertyWidget
                .validateField(
                    $('input[name=property_pay_type]').filter(':checked').attr('id'),
                    $('input[name=property_pay_type]').filter(':checked').val(),
                    $('input[name=property_pay_type]').filter(':checked').attr('data'),
                    $('input[name=property_pay_type]').filter(':checked').attr('data-label'),
                    class_name
                );
            i_count ++;
        }else{
            if(cheack_all)
                $('input[name=property_pay_type]')
                    .removeClass('valid'+class_name+'')
                    .parents('.input_wrap')
                    .removeClass('ok')
                    .removeClass('valid'+class_name+'')
                    .addClass('error')
                    .find('.message')
                    .html('<span>Помилка платіжної системи</span>');
        }


        //  console.log(i_count,PropertyWidget.settings.input_count_all);

        /**
         * общая проверка на вшивость.
         */
        var len = $('.valid'+class_name+'').length;



        //if(PropertyWidget.settings.input_count_all ==  i_count ){
//console.log(len,PropertyWidget.settings.count_valid_form_fields);
        PropertyWidget.enableDisablePhone(len);
        if(len  == PropertyWidget.settings.count_valid_form_fields){
           // console.log('Можно отравлять данные.');
            $('#property_submit').addClass('green').removeClass('gray');
            return true;
        }else{
           // console.log('Не все обязательные поля заполнили !!!');
            $('#property_submit').addClass('gray').removeClass('green');
            return false;
        }
        //}else{ //проверка для открытия редактирования мобильного .
        //    PropertyWidget.enableDisablePhone(len);
        //    $('#property_submit').addClass('gray').removeClass('green');
        //  return false;
        // }
    },
    enableDisablePhone: function(len){


        if($('#property_pay_type_liqpay').hasClass('valid_form')){
            len = len-1;
        }
        if($('#property_pay_type_portmone').hasClass('valid_form')){
            len = len-1;
        }
        if($('#property_user_phone_number').hasClass('valid_form')){
            len = len-1;
        }
        if($('#property_user_phone_number_confirm').hasClass('valid_form')){
            len = len-1;
        }


        if(len >= PropertyWidget.settings.input_count_all - 5 ){
            // console.log('Можно включать валидацю по СМС!');
            $('#property_user_phone_number,input[name=property_phone_button],#property_user_phone_number_confirm')
                .prop('disabled',false);
            $('#phone_verification').css('display','block');
        }else{
            /* console.log('Clean !!!');
             //Видаляємо код смс з сесії
             var data  = {
             'code_off'  : true   ,
             'token'     : PropertyWidget.settings.token
             }
             PropertyWidget.sendAjax(data,function(response){
             // console.log(response);
             });*/

            $('#property_user_phone_number,input[name=property_phone_button],#property_user_phone_number_confirm')
                .prop('disabled',true).attr('disabled');

            $('#phone_verification').css('display','none');
        }
    },

    getPassportDateResponse: function (data){

        var class_name ='_form';
        var pass_field = $('#property_user_passport_date');


        if(data.years == undefined){
            PropertyWidget
                .validateField(
                    pass_field.attr('id'),
                    'error',
                    pass_field.attr('data'),
                    pass_field.attr('data-label'),
                    class_name
                );
            return;
        }



        if(data.years >  0){
            if(data.years_now > 0){
                PropertyWidget
                    .validateField(
                        pass_field.attr('id'),
                        pass_field.val(),
                        pass_field.attr('data'),
                        pass_field.attr('data-label'),
                        class_name
                    );
            }else{
                if(data.days_now >= 0){
                    PropertyWidget
                        .validateField(
                            pass_field.attr('id'),
                            pass_field.val(),
                            pass_field.attr('data'),
                            pass_field.attr('data-label'),
                            class_name
                        );
                }else{
                    PropertyWidget
                        .validateField(
                            pass_field.attr('id'),
                            'error',
                            pass_field.attr('data'),
                            pass_field.attr('data-label'),
                            class_name
                        );
                }
            }
        }else{
            PropertyWidget
                .validateField(
                    pass_field.attr('id'),
                    'error',
                    pass_field.attr('data'),
                    pass_field.attr('data-label'),
                    class_name
                );
        }
    },
    /**
     * Метод для отправки формы
     * @param form
     */
    submitForm: function(form){
        if(PropertyWidget.addButton(form,true)){
            $('#property_step2').submit();
        }
    },
    /**
     * Валидация полей
     * @param feild_id
     * @param field_val
     */
    validateField: function (feild_id,field_val,reg,error_message,class_name){

        // console.log(error_message);

        var err =0;
        reg = new RegExp(reg,'');

        if(field_val.search(reg)!=-1){ err=1 }

        if(err == 1){
            if(feild_id == 'property_user_phone_number')
                $('input[name=property_phone_button]').addClass('green');

            $('#'+feild_id)
                .addClass('valid'+class_name+'')
                .removeClass('error')
                .parents('.input_wrap')
                .removeClass('error')
                .addClass('ok')
                .find('.message')
                .text('');
        }else{
            if(feild_id == 'property_user_phone_number')
                $('input[name=property_phone_button]').removeClass('green');

            $('#'+feild_id)
                .removeClass('valid'+class_name+'')
                .removeClass('valid')
                .parents('.input_wrap')
                .removeClass('ok')
                .removeClass('valid'+class_name+'')
                .addClass('error')
                .find('.message')
                .html('<span>'+error_message+'</span>');
        }
    },
    /**
     * Колбек для обработки данных по желаемой дате
     * @param data
     */
    getStartDateResponse: function(data){

        var start_field = $('#property_desired_start_date');
        var  class_name ='_form';
        if(data.years_now > 0){
            PropertyWidget
                .validateField(
                    start_field.attr('id'),
                    'error',
                    start_field.attr('data'),
                    start_field.attr('data-label'),
                    class_name
                );
        }else{
            if(data.mounth > 0){
                PropertyWidget
                    .validateField(
                        start_field.attr('id'),
                        'error',
                        start_field.attr('data'),
                        start_field.attr('data-label'),
                        class_name
                    );
            }else{
                if(data.days_now < 0){
                    PropertyWidget
                        .validateField(
                            start_field.attr('id'),
                            'error',
                            start_field.attr('data'),
                            start_field.attr('data-label'),
                            class_name
                        );
                }else{
                    PropertyWidget
                        .validateField(
                            start_field.attr('id'),
                            start_field.val(),
                            start_field.attr('data'),
                            start_field.attr('data-label'),
                            class_name
                        );
                }
            }
        }
    },
    /**
     * callback -  обработчик для регионов
     * @param regions
     */
    setRegion: function (regions) {
        $('#property_user_region').prepend('<option>').prop('disabled',false);
        $.each(regions, function (index, val) {
            $('#property_user_region').append($('<option/>', {
                value: val.reg2,
                text : val.title
            }));
        });

        if($('#property_user_obl').val() == 10){
            $('#property_user_region').val('70').prop('selected', true);

            if( $('#property_user_region').val() == 70){
                var class_name  = '_form';
                PropertyWidget
                    .validateField(
                        $('#property_user_region').attr('id'),
                        $('#property_user_region').val(),
                        $('#property_user_region').attr('data'),
                        $('#property_user_region').attr('data-label'),
                        class_name
                    );
            }
        }
    },
    /**
     * callback -  обработчик для регионов
     * @param regions
     */
    setRegionOwner: function (regions) {
        $('#property_user_region_owner').prepend('<option>').prop('disabled',false);
        $.each(regions, function (index, val) {
            $('#property_user_region_owner').append($('<option/>', {
                value: val.reg2,
                text : val.title
            }));
        });

        if($('#property_user_obl_owner').val() == 10){
            $('#property_user_region_owner').val('70').prop('selected', true);

            if( $('#property_user_region_owner').val() == 70){
                var class_name  = '_form';
                PropertyWidget
                    .validateField(
                        $('#property_user_region_owner').attr('id'),
                        $('#property_user_region_owner').val(),
                        $('#property_user_region_owner').attr('data'),
                        $('#property_user_region_owner').attr('data-label'),
                        class_name
                    );
            }
        }
    },


    /**
     * callback -  обработчик для городов.
     * @param cities
     */
    getCity:function (cities){

        $('#property_user_city').prepend('<option>').prop('disabled',false);

        $.each(cities, function (index, val) {
            $('#property_user_city').append($('<option/>', {
                value: val.reg3,
                text : val.title
            }));
        });

        if($('#property_user_obl').val() == 10){
            $('#property_user_city').val('800').prop('selected', true);


            if( $('#property_user_city').val() == 800){
                var class_name  = '_form';
                PropertyWidget
                    .validateField(
                        $('#property_user_city').attr('id'),
                        $('#property_user_city').val(),
                        $('#property_user_city').attr('data'),
                        $('#property_user_city').attr('data-label'),
                        class_name
                    );
            }
        }

    },
    /**
     * callback -  обработчик для городов.
     * @param cities
     */
    getCityOwner:function (cities){


       // console.log('City Owner !!!',cities);

        $('#property_user_city_owner').prepend('<option>').prop('disabled',false);

        $.each(cities, function (index, val) {
            $('#property_user_city_owner').append($('<option/>', {
                value: val.reg3,
                text : val.title
            }));
        });

        if($('#property_user_obl_owner').val() == 10){
            $('#property_user_city_owner').val('800').prop('selected', true);


            if( $('#property_user_city_owner').val() == 800){
                var class_name  = '_form';
                PropertyWidget
                    .validateField(
                        $('#property_user_city_owner').attr('id'),
                        $('#property_user_city_owner').val(),
                        $('#property_user_city_owner').attr('data'),
                        $('#property_user_city_owner').attr('data-label'),
                        class_name
                    );
            }
        }

    },
    /**
     * callback -  обработчик для индексов.
     * @param indexes
     */
    getCityIndex: function (indexes) {

        $('#property_user_index').prepend('<option>').prop('disabled',false);
        $.each(indexes, function (index, val) {
            $('#property_user_index').append($('<option/>', {
                value: val.reg4,
                text : val.title
            }));
        });
    },
    /**
     * callback -  обработчик для индексов.
     * @param indexes
     */
    getCityIndexOwner: function (indexes) {

        $('#property_user_index_owner').prepend('<option>').prop('disabled',false);
        $.each(indexes, function (index, val) {
            $('#property_user_index_owner').append($('<option/>', {
                value: val.reg4,
                text : val.title
            }));
        });
    },
    /**
     * Отправка СМС
     */
    sendSms : function (){

        if(!$('input[name=property_phone_button]').hasClass('green') && !$('input[name=property_phone_button]').hasClass('blue'))
            return false;

        var data  = {
            'phone':    $('#property_user_phone_number').val(),
            'token':    PropertyWidget.settings.token
        }
        PropertyWidget.sendAjax(data,PropertyWidget.getSendSmsRessponse);
        notify($('#property_notify_sms').html());

    },

    getSendSmsRessponse: function (res){
        alert('Ліміт спроб авторизації через смс повідомлення перевищено. Превірте правильність внесення мобільного номеру телефону. Спробуйте ще раз через 180 хв.')
    },
    /**
     * callback  - обработчик для отвтов от смс - оператора.
     * @param res
     */
    getSmsResponse: function (res) {
        //  console.log(res);
        if(res.error){

            $('#property_user_phone_number_confirm')
                .removeClass('valid_form')
                .removeClass('valid')
                .parents('.input_wrap')
                .removeClass('ok')
                .removeClass('valid_form')
                .addClass('error')
                .find('.message')
                .removeClass('osago_phone_ok')
                .html('<span>'+$('#property_notify_code_sms').html()+'</span>');

            $('input[name=property_phone_button]')
                .removeClass('green')
                .addClass('blue')
                .val('Згенерувати код ще раз');
        }else{
            $('input[name=property_phone_button]')
                .removeClass('blue')
                .removeClass('green')

                .addClass('grey');

            $('#property_user_phone_number_confirm')
                .addClass('notif')
                .parents('.input_wrap')
                .find('.message')
                .addClass('osago_phone_ok')
                .html('<span>'+$('#property_user_phone_number_confirm').attr('data-phoneok')+'</span>');
        }

    },
    /**
     * Отправка Аякс запроса.
     * @param data
     */
    sendAjax: function (data,callback) {

        $.ajax({
            method: "POST",
            url: "/property.php",
            data: data
        })
            .done(function( response ) {
                callback(response);
            });
    },
    sendAjaxStep1: function (data,callback) {


        console.log(data);

        $.ajax({
            method: "POST",
            url: data.url,
            data: data
        })
            .done(function( response ) {
                console.log(response);
                callback(response);
            });
    }
}