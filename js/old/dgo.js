/**
 * Created by alex on 17.08.16.
 */
$(document).ready( function() {
    $.datepicker.setDefaults($.datepicker.regional['ua']);
    DgoWidget.init();
});


var DgoWidget = {

    settings: {
        'token':'3412sadfsadfasdfasdfcasdfa',
        input_count_all: 28,
        count_valid_form_fields:25,
        form_data:[],
    },

    init: function (){

         $("#dgo_user_phone_number").mask("+38 (099) 9999999");

        $('#dgo_user_date_birth')
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


        $('#dgo_user_passport_date')
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

        $('#dgo_desired_start_date')
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

        DgoWidget.cheackForm($('#dgo_step2 input,#dgo_step2 select'));


        $('#dgo_submit').on('click',function(){
           DgoWidget.submitForm($('#dgo_step2 input,#dgo_step2 select'));
        });

        //Поумолчанию выключаем все поля...
        // $('fieldset.closed input,fieldset.closed select,fieldset.closed radio').attr("disabled", true);
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

        date_birth      = DgoWidget.getNewDate(date_birth);
        date_passport   = DgoWidget.getNewDate(date_passport);

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

        class_name ='_form';
        var now_year = new Date().getFullYear();


        form.on('change',function () {

            if($(this).attr('id') == 'dgo_desired_start_date'){

                var date = $(this).val();
                var n = date.split('.');

                if(n[1] > 12 || n[0] >31){
                    DgoWidget
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
                if($(this).attr('id') == 'dgo_user_phone_number_confirm'){

                    var data  = {
                        'code':  $(this).val(),
                        'token':    DgoWidget.settings.token
                    }
                    DgoWidget.sendAjax(data,DgoWidget.getSmsResponse);
                }


                var data =  {
                    'token'         :   '3412sadfsadfasdfasdfcasdfa',
                    'desired_start_date'    :$(this).val()
                }
                DgoWidget.sendAjax(data,DgoWidget.getStartDateResponse);
            }

            if( $(this).attr('id') !=='dgo_user_phone_number' &&
                $(this).attr('id') !=='dgo_user_phone_number_confirm' &&
                $(this).attr('id') !=='dgo_pay_type_liqpay' &&
                $(this).attr('id') !=='dgo_pay_type_portmone'&&
              //  $(this).attr('id') !=='dgo_conditions' &&
                $(this).attr('id') != undefined
            ){
                DgoWidget.onOffSms();
            }


            if($(this).attr('id') == 'dgo_form_1_auto_serial_number' ) {
                $(this).val($(this).val().toUpperCase());
            }

            if($(this).attr('id') == 'dgo_form_1_auto_reg_number' ) {
                $(this).val($(this).val().toUpperCase());
            }

            /**
             * Обработка данных для поля района.
             */
            if($(this).attr('id') == 'dgo_user_obl'){

                var data  = {
                    'obl_id':   $(this).val(),
                    'token':    DgoWidget.settings.token
                }

                $('#dgo_user_city').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok') ;
                $('#dgo_user_region').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok') ;
                $('#dgo_user_index').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok');


                if($(this).val() == '10'){
                    DgoWidget.stateKiev($(this).val());
                }
                DgoWidget.sendAjax(data,DgoWidget.setRegion);

            }

            if($(this).attr('id') == 'dgo_user_region'){

                if($(this).val() !== ''){
                    var data  = {
                        'reg_id':   $(this).val(),
                        'obl_id':   $('#dgo_user_obl').val(),
                        'token':    DgoWidget.settings.token
                    }

                    $('#dgo_user_city').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');
                    $('#dgo_user_index').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');


                    DgoWidget.sendAjax(data,DgoWidget.getCity);
                }
            }

            if($(this).attr('id') == 'dgo_user_city'){
                if($(this).val() !== ''){
                    var data  = {
                        'reg_id':   $('#dgo_user_region').val(),
                        'obl_id':   $('#dgo_user_obl').val(),
                        'city_id':  $(this).val(),
                        'token':    DgoWidget.settings.token
                    }

                    $('#dgo_user_index').parents('.input_wrap').removeClass('ok').removeClass('valid_form') ;

                    DgoWidget.sendAjax(data,DgoWidget.getCityIndex);
                }
            }

            if($(this).attr('id') != 'dgo_conditions' ) {
                DgoWidget
                    .validateField(
                        $(this).attr('id'),
                        $(this).val(),
                        $(this).attr('data'),
                        $(this).attr('data-label'),
                        class_name
                    );
            }

            if($(this).attr('id') == 'dgo_conditions' ){
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
                    DgoWidget
                        .validateField(
                            $(this).attr('id'),
                            $(this).val(),
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                }
            }


            DgoWidget.addButton(form,false);

        });

        form.on('blur',function () {


            if($(this).attr('id') == 'dgo_form_1_auto_date') {
                var year_claim = now_year - $(this).val();

                if(year_claim  == 0){
                    DgoWidget
                        .validateField(
                            $(this).attr('id'),
                            $(this).val(),
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                }

            }


            if($(this).attr('id') == 'dgo_desired_start_date'){

                var date = $(this).val();
                var n = date.split('.');

                if(n[1] > 12 || n[0] >31){
                    DgoWidget
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
                DgoWidget.sendAjax(data,DgoWidget.getStartDateResponse);
            }


            if( $(this).attr('id') !=='dgo_user_phone_number' &&
                $(this).attr('id') !=='dgo_user_phone_number_confirm' &&
                $(this).attr('id') !=='dgo_pay_type_liqpay' &&
                $(this).attr('id') !=='dgo_pay_type_portmone'&&
              //  $(this).attr('id') !=='dgo_conditions' &&
                $(this).attr('id') != undefined
            ){
                DgoWidget.onOffSms();
            }

            /**
             * Формула для валидации ИНН
             */
            if($(this).attr('id') == 'dgo_user_inn'){

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
            if($(this).attr('id') == 'dgo_user_phone_number_confirm'){

                var data  = {
                    'code':  $(this).val(),
                    'token':    DgoWidget.settings.token
                }
                DgoWidget.sendAjax(data,DgoWidget.getSmsResponse);
            }



            if($(this).attr('id') == 'dgo_user_passport_date'){

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
                    'date_birth'    :   $('#dgo_user_date_birth').val(),
                    'date_passport' :   $(this).val()
                }
                DgoWidget.sendAjax(data,DgoWidget.getPassportDateResponse);
            }

            if($(this).attr('id') == 'dgo_form_1_auto_serial_number' ) {
                $(this).val($(this).val().toUpperCase());
            }

            if($(this).attr('id') == 'dgo_form_1_auto_reg_number' ) {

                $(this).val($(this).val().toUpperCase());
                console.log($(this).val());
            }


            if($(this).attr('id') == 'dgo_user_date_birth'){

                var date = $(this).val();
                var n = date.split('.');

                var date = $(this).val();
                var n = date.split('.');

                if(n[1] > 12 || n[0] >31){
                    DgoWidget
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

                    DgoWidget
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
                        DgoWidget
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


            if($(this).attr('id') == 'dgo_user_passport_series' ) {

                if( $('#dgo_user_passport_number').val()=='' ||
                    $('#dgo_user_passport_number').val().length != 6  ){

                    $(this)
                        .parents('.input_wrap')
                        .removeClass('ok')
                        .removeClass('valid'+class_name+'');
                }

            }
            if($(this).attr('id') == 'dgo_user_passport_number' ) {
                if($('#dgo_user_passport_series').val().length < 2 )

                    $(this)
                        .removeClass('error')
                        .parents('.input_wrap')
                        .removeClass('ok')
                        .removeClass('valid'+class_name+'')
                        .removeClass('error')
                        .find('.message')
                        .html('');
            }

            DgoWidget.addButton(form,false);
        });
    },
    stateKiev: function(id){
        // console.log(id);

        //10|70|800

        var token = '3412sadfsadfasdfasdfcasdfa';
        var data_city  = {
            'reg_id':   70,
            'obl_id':   $('#dgo_user_obl').val(),
            'token' :   token
        }

        $('#dgo_user_city').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');
        $('#dgo_user_index').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');

        DgoWidget.sendAjax(data_city,DgoWidget.getCity);

        var data  = {
            'reg_id'    :   70,
            'obl_id'    :   $('#dgo_user_obl').val(),
            'city_id'   :   800,
            'token'     :   token
        }

        DgoWidget.sendAjax(data,DgoWidget.getCityIndex);

    },
    onOffSms: function(){

        $('#dgo_user_phone_number,#dgo_user_phone_number_confirm').val('')
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

        $('input[name=dgo_phone_button]')
            .val('Пiдтвердити через SMS')
            .removeClass('green')
            .removeClass('blue')
            .addClass('grey');

        var data  = {
            'code_off'  : true   ,
            'token'     : DgoWidget.settings.token
        }
        DgoWidget.sendAjax(data,function(response){
            // console.log(response);
        });

        if($('#dgo_user_phone_number_confirm').hasClass('notif')) {

            $('#dgo_user_phone_number_confirm').removeClass('notif');
            notify($('#dgo_phone_cheak_sms').html());
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

        class_name ='_form';
        var i_count = 1;
        form.each(function(nf, form) {

            if($(this).attr('id') == undefined) {
                return;
            }
            if($(this).attr('name') == 'dgo_phone_button'){
                return ;
            }

            if(cheack_all)
                if($(this).attr('id') == 'dgo_user_phone_number_confirm'){

                    var data  = {
                        'code':  $(this).val(),
                        'token':    DgoWidget.settings.token
                    }
                    DgoWidget.sendAjax(data,DgoWidget.getSmsResponse);
                    return;
                }

            if($(this).attr('id') == 'dgo_user_passport_date'){

                var date = $(this).val();
                var n = date.split('.');

                if(cheack_all)
                    if($(this).val() ==''){
                        DgoWidget
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
                    DgoWidget
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
                    'date_birth'    :   $('#dgo_user_date_birth').val(),
                    'date_passport' :   $(this).val()
                }
                DgoWidget.sendAjax(data,DgoWidget.getPassportDateResponse);
                return;
            }


            if($(this).attr('id') == 'dgo_user_inn'){

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
            if($(this).attr('id') == 'dgo_conditions' ){
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


            if($(this).attr('id') == 'dgo_desired_start_date'){



                var date = $(this).val();
                var n = date.split('.');


                if(n[1] > 12 || n[0] >31 || $(this).val() == '' ){
                    DgoWidget
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
                DgoWidget.sendAjax(data,DgoWidget.getStartDateResponse);
                return;
            }


            // if($(this).attr('id') != 'dgo_pay_type_portmone' &&
            //     $(this).attr('id') != 'dgo_pay_type_liqpay'
            // ){
                if(cheack_all)
                    DgoWidget
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


        if($('input[name=dgo_pay_type]').filter(':checked').val() != undefined){
            //убиваем все валидные теги
            $('input[name=dgo_pay_type]')
                .removeClass('ok')
                .removeClass('valid'+class_name+'')
                .removeClass('valid');

            DgoWidget
                .validateField(
                    $('input[name=dgo_pay_type]').filter(':checked').attr('id'),
                    $('input[name=dgo_pay_type]').filter(':checked').val(),
                    $('input[name=dgo_pay_type]').filter(':checked').attr('data'),
                    $('input[name=dgo_pay_type]').filter(':checked').attr('data-label'),
                    class_name
                );
            i_count ++;
        }else{
            if(cheack_all)
                $('input[name=dgo_pay_type]')
                    .removeClass('valid'+class_name+'')
                    .parents('.input_wrap')
                    .removeClass('ok')
                    .removeClass('valid'+class_name+'')
                    .addClass('error')
                    .find('.message')
                    .html('<span>Помилка платіжної системи</span>');
        }


      //  console.log(i_count,DgoWidget.settings.input_count_all);

        /**
         * общая проверка на вшивость.
         */
        var len = $('.valid'+class_name+'').length;



        //if(DgoWidget.settings.input_count_all ==  i_count ){

            DgoWidget.enableDisablePhone(len);
            if(len  == DgoWidget.settings.count_valid_form_fields){
                console.log('Можно отравлять данные.');
                $('#dgo_submit').addClass('green').removeClass('gray');
                return true;
            }else{
                console.log('Не все обязательные поля заполнили !!!');
                $('#dgo_submit').addClass('gray').removeClass('green');
                return false;
            }
        //}else{ //проверка для открытия редактирования мобильного .
        //    DgoWidget.enableDisablePhone(len);
        //    $('#dgo_submit').addClass('gray').removeClass('green');
         //  return false;
       // }
    },
    enableDisablePhone: function(len){


        if($('#dgo_pay_type_liqpay').hasClass('valid_form')){
            len = len-1;
        }
        if($('#dgo_pay_type_portmone').hasClass('valid_form')){
            len = len-1;
        }
        if($('#dgo_user_phone_number').hasClass('valid_form')){
            len = len-1;
        }
        if($('#dgo_user_phone_number_confirm').hasClass('valid_form')){
            len = len-1;
        }

        if(len >= DgoWidget.settings.input_count_all - 6 ){
            // console.log('Можно включать валидацю по СМС!');
            $('#dgo_user_phone_number,input[name=dgo_phone_button],#dgo_user_phone_number_confirm')
                .prop('disabled',false);
            $('#phone_verification').css('display','block');
        }else{
           /* console.log('Clean !!!');
            //Видаляємо код смс з сесії
            var data  = {
                'code_off'  : true   ,
                'token'     : DgoWidget.settings.token
            }
            DgoWidget.sendAjax(data,function(response){
                // console.log(response);
            });*/

            $('#dgo_user_phone_number,input[name=dgo_phone_button],#dgo_user_phone_number_confirm')
                .prop('disabled',true).attr('disabled');

            $('#phone_verification').css('display','none');
        }
    },

    getPassportDateResponse: function (data){

        class_name ='_form';
        var pass_field = $('#dgo_user_passport_date');


        if(data.years == undefined){
            DgoWidget
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
                DgoWidget
                    .validateField(
                        pass_field.attr('id'),
                        pass_field.val(),
                        pass_field.attr('data'),
                        pass_field.attr('data-label'),
                        class_name
                    );
            }else{
                if(data.days_now >= 0){
                    DgoWidget
                        .validateField(
                            pass_field.attr('id'),
                            pass_field.val(),
                            pass_field.attr('data'),
                            pass_field.attr('data-label'),
                            class_name
                        );
                }else{
                    DgoWidget
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
            DgoWidget
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
        if(DgoWidget.addButton(form,true)){
            $('#dgo_step2').submit();
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
            if(feild_id == 'dgo_user_phone_number')
                $('input[name=dgo_phone_button]').addClass('green');

            $('#'+feild_id)
                .addClass('valid'+class_name+'')
                .removeClass('error')
                .parents('.input_wrap')
                .removeClass('error')
                .addClass('ok')
                .find('.message')
                .text('');
        }else{
            if(feild_id == 'dgo_user_phone_number')
                    $('input[name=dgo_phone_button]').removeClass('green');

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

        var start_field = $('#dgo_desired_start_date');
        class_name ='_form';
        if(data.years_now > 0){
            DgoWidget
                .validateField(
                    start_field.attr('id'),
                    'error',
                    start_field.attr('data'),
                    start_field.attr('data-label'),
                    class_name
                );
        }else{
            if(data.mounth > 0){
                DgoWidget
                    .validateField(
                        start_field.attr('id'),
                        'error',
                        start_field.attr('data'),
                        start_field.attr('data-label'),
                        class_name
                    );
            }else{
                if(data.days_now < 0){
                    DgoWidget
                        .validateField(
                            start_field.attr('id'),
                            'error',
                            start_field.attr('data'),
                            start_field.attr('data-label'),
                            class_name
                        );
                }else{
                    DgoWidget
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
        $('#dgo_user_region').prepend('<option>').prop('disabled',false);
        $.each(regions, function (index, val) {
            $('#dgo_user_region').append($('<option/>', {
                value: val.reg2,
                text : val.title
            }));
        });

        if($('#dgo_user_obl').val() == 10){
            $('#dgo_user_region').val('70').prop('selected', true);

            if( $('#dgo_user_region').val() == 70){
                var class_name  = '_form';
                DgoWidget
                    .validateField(
                        $('#dgo_user_region').attr('id'),
                        $('#dgo_user_region').val(),
                        $('#dgo_user_region').attr('data'),
                        $('#dgo_user_region').attr('data-label'),
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

        $('#dgo_user_city').prepend('<option>').prop('disabled',false);

        $.each(cities, function (index, val) {
            $('#dgo_user_city').append($('<option/>', {
                value: val.reg3,
                text : val.title
            }));
        });

        if($('#dgo_user_obl').val() == 10){
            $('#dgo_user_city').val('800').prop('selected', true);


            if( $('#dgo_user_city').val() == 800){
                var class_name  = '_form';
                DgoWidget
                    .validateField(
                        $('#dgo_user_city').attr('id'),
                        $('#dgo_user_city').val(),
                        $('#dgo_user_city').attr('data'),
                        $('#dgo_user_city').attr('data-label'),
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

        $('#dgo_user_index').prepend('<option>').prop('disabled',false);
        $.each(indexes, function (index, val) {
            $('#dgo_user_index').append($('<option/>', {
                value: val.reg4,
                text : val.title
            }));
        });
    },
    /**
     * Отправка СМС
     */
    sendSms : function (){

        if(!$('input[name=dgo_phone_button]').hasClass('green') && !$('input[name=dgo_phone_button]').hasClass('blue'))
            return false;

        var data  = {
            'phone':    $('#dgo_user_phone_number').val(),
            'token':    DgoWidget.settings.token
        }
        DgoWidget.sendAjax(data,DgoWidget.getSendSmsRessponse);
        notify($('#dgo_notify_sms').html());

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

            $('#dgo_user_phone_number_confirm')
                .removeClass('valid_form')
                .removeClass('valid')
                .parents('.input_wrap')
                .removeClass('ok')
                .removeClass('valid_form')
                .addClass('error')
                .find('.message')
                .removeClass('osago_phone_ok')
                .html('<span>'+$('#dgo_notify_code_sms').html()+'</span>');

            $('input[name=dgo_phone_button]')
                .removeClass('green')
                .addClass('blue')
                .val('Згенерувати код ще раз');
        }else{
            $('input[name=dgo_phone_button]')
                .removeClass('blue')
                .removeClass('green')

                .addClass('grey');

            $('#dgo_user_phone_number_confirm')
                .addClass('notif')
                .parents('.input_wrap')
                .find('.message')
                .addClass('osago_phone_ok')
                .html('<span>'+$('#dgo_user_phone_number_confirm').attr('data-phoneok')+'</span>');
        }

    },
    /**
     * Отправка Аякс запроса.
     * @param data
     */
    sendAjax: function (data,callback) {

        $.ajax({
            method: "POST",
            url: "/dgo.php",
            data: data
        })
            .done(function( response ) {
                callback(response);
            });
    }
}