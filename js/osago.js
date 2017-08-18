/**
 * Created by alex on 17.08.16.
 */
$(document).ready( function() {

    $.datepicker.regional['ua'] = {clearText: 'Очистити', clearStatus: '',
        closeText: 'Закрити', closeStatus: '',
        prevText: '&lt;&lt;',  prevStatus: '',
        nextText: '&gt;&gt;', nextStatus: '',
        currentText: 'Сьогодні', currentStatus: '',
        monthNames: ['Січень','Лютий','Березень','Квітень','Травень','Червень',
            'Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'],
        monthNamesShort: ['Січ','Лют','Бер','Кві','Тра','Чер',
            'Лип','Сер','Вер','Жов','Лис','Гру'],
        monthStatus: '', yearStatus: '',
        weekHeader: 'Не', weekStatus: '',
        dayNames: ['неділя','понеділок','вівторок','середа','четвер','пятниця','суббота'],
        dayNamesShort: ['нед','пнд','вів','срд','чтв','птн','сбт'],
        dayNamesMin: ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'],
        dayStatus: 'DD', dateStatus: 'D, M d',
        dateFormat: 'dd.mm.yy', firstDay: 1,
        initStatus: '', isRTL: false};


    $.datepicker.setDefaults($.datepicker.regional['ua']);




    if($('#osago_claims_step2').val() == undefined)
        OsagoWidget.step1.calc();
    else
        OsagoWidget.step2.init();
});


var OsagoWidget = {

    settings: {
        'osago_claims':{
            '04':0,
            '05':1,
            '06':2,
            '07':3,
            '08':4
        },
        input_count_all: 33,
        count_valid_form_fields:28,
        form_data:[],
    },


    step1:{

        calc: function(){
            $(document).on('change', '#osago', function () {
                OsagoWidget.step1.getCalcResult();
            });
        },

        getCalcResult: function(){

            var data = {};

            $('#osago select').each(function(nf, form){

                if($(this).attr('id') == 'osago_claims' && $(this).val() == '01'){
                    $(this).val($("#osago_claims option:first").val());
                    notify( $('#osago_notify').html());
                } else
                    data[$(this).attr('id')] = $(this).val();

            });

            OsagoWidget.step1.sendAjax(data);

        },

        sendAjax: function (data) {

           // console.log(data);
            data['ajax'] = true;

            $.ajax({
                method: "POST",
                url: "/ua/private/auto/avtograzhdanka/pokupka_avtocyvilka_osago/?type=osago",
                data: data
            })
            .done(function( response ) {
               // console.log(response);

                $('#pre_sum_tdp2').html(OsagoWidget.step1.number_format(response.tdp2,'',' ',' ') + ' грн в рік');
                $('#pre_sum_tdp1').html(OsagoWidget.step1.number_format(response.tdp1,'',' ',' ') + ' грн в рік');
                $('#pre_sum_std2').html(OsagoWidget.step1.number_format(response.std2,'',' ',' ') + ' грн в рік');

            });
        },
        number_format: function ( number, decimals, dec_point, thousands_sep ) {

            var i, j, kw, kd, km;
            // input sanitation & defaults
            if( isNaN(decimals = Math.abs(decimals)) ){
                decimals = 2;
            }
            if( dec_point == undefined ){
                dec_point = ",";
            }
            if( thousands_sep == undefined ){
                thousands_sep = ".";
            }

            i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

            if( (j = i.length) > 3 ){
                j = j % 3;
            } else{
                j = 0;
            }

            km = (j ? i.substr(0, j) + thousands_sep : "");
            kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
            //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
            kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
            return km + kw + kd;
        }

    },

    step2:{

        init: function (){

            $("#osago_user_phone_number").mask("+38 (099) 9999999");

            $('#osago_user_date_birth')
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


            $('#osago_user_passport_date')
                .datepicker({
                    dateFormat:         'dd.mm.yy',
                    maxDate:            'now',
                    defaultDate:        '01.01.2000',
                    firstDay:           1,
                    constraintInput:    true,
                    changeYear:         true,
                    changeMonth:        true,
					beforeShow:         function() {
						$('#ui-datepicker-div').addClass("osago-picker");
					}
                });

            $('#osago_desired_start_date')
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

            OsagoWidget.step2.cheackForm($('#osago_step2_1 input,#osago_step2_1 select'));

            $('#osago_submit').on('click',function(){
                OsagoWidget.step2.submitForm($('#osago_step2_1 input,#osago_step2_1 select'));
            });


           class_name ='_form';
          OsagoWidget.step2
               .validateField(
                   $('#osago_delivery_type').attr('id'),
                   $('#osago_delivery_type').val(),
                   $('#osago_delivery_type').attr('data'),
                   $('#osago_delivery_type').attr('data-label'),
                   class_name
               );

               OsagoWidget.step2.deliverySelect();


            //Поумолчанию выключаем все поля...
            $('fieldset.closed input,fieldset.closed select,fieldset.closed radio').attr("disabled", true);
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
        // cheackDatePassport: function (date_birth,date_passport) {
        //     var date_now = new Date();
        //     if(!date_birth)
        //         return false;
        //
        //     date_birth      = OsagoWidget.step2.getNewDate(date_birth);
        //     date_passport   = OsagoWidget.step2.getNewDate(date_passport);
        //
        //     if(date_birth.getTime() > date_passport.getTime())
        //         return false;
        //     else{
        //
        //         console.log(date_birth,date_passport);
        //
        //         if((date_passport.getTime() - 30*24*60*60*1000 ) >= date_now.getTime()){
        //             return false;
        //         }
        //         return true;
        //     }
        // },
        cheackForm: function (form,sub) {

            class_name ='_form';
            var now_year = new Date().getFullYear();


            form.on('change',function () {

                if( $(this).attr('id') !=='osago_user_phone_number' &&
                    $(this).attr('id') !=='osago_user_phone_number_confirm' &&
                    $(this).attr('id') !=='osago_pay_type_liqpay' &&
                    $(this).attr('id') !=='osago_pay_type_portmone'&&
                //    $(this).attr('id') !=='osago_conditions' &&
                    $(this).attr('id') != undefined
                ){
                    OsagoWidget.step2.onOffSms();
                }


                if($(this).attr('id') == 'osago_form_1_auto_serial_number' ) {
                    $(this).val($(this).val().toUpperCase());
                }

                if($(this).attr('id') == 'osago_form_1_auto_reg_number' ) {
                    $(this).val($(this).val().toUpperCase());
                }

                /**
                 * Обработка данных для поля района.
                 */
                if($(this).attr('id') == 'osago_user_obl'){

                    var data  = {
                        'obl_id':   $(this).val(),
                        'token':    '3412sadfsadfasdfasdfcasdfa'
                    }


                    $('#osago_user_city').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok') ;
                    $('#osago_user_region').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok') ;
                    $('#osago_user_index').html('').prop('disabled',true).removeClass('valid_form').parents('.input_wrap').removeClass('ok');


                    if($(this).val() == '10'){
                        OsagoWidget.step2.stateKiev($(this).val());
                    }

                    OsagoWidget.step2.sendAjax(data,OsagoWidget.step2.setRegion);
                }

                if($(this).attr('id') == 'osago_user_region'){

                    if($(this).val() !== ''){
                        var data  = {
                            'reg_id':   $(this).val(),
                            'obl_id':   $('#osago_user_obl').val(),
                            'token':    '3412sadfsadfasdfasdfcasdfa'
                        }

                        $('#osago_user_city').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');
                        $('#osago_user_index').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');


                        OsagoWidget.step2.sendAjax(data,OsagoWidget.step2.getCity);
                    }
                }

                if($(this).attr('id') == 'osago_user_city'){
                    if($(this).val() !== ''){
                        var data  = {
                            'reg_id':   $('#osago_user_region').val(),
                            'obl_id':   $('#osago_user_obl').val(),
                            'city_id':  $(this).val(),
                            'token':    '3412sadfsadfasdfasdfcasdfa'
                        }

                        $('#osago_user_index').parents('.input_wrap').removeClass('ok').removeClass('valid_form') ;

                        OsagoWidget.step2.sendAjax(data,OsagoWidget.step2.getCityIndex);
                    }
                }


                if($(this).attr('id') == 'osago_delivery_region'){

                    $('#osago_delivery_office').parents('.input_wrap').removeClass('ok').removeClass('valid_form') ;

                    OsagoWidget.step2.addButton(form,false);

                    var data = {
                        'uniqa_regin_id':  $(this).val(),
                        'token':    '3412sadfsadfasdfasdfcasdfa'
                    }
                    OsagoWidget.step2.sendAjax(data,OsagoWidget.step2.deliveryOffices);
                }


                if($(this).attr('id') != 'osago_conditions' ) {
                    OsagoWidget.step2
                        .validateField(
                            $(this).attr('id'),
                            $(this).val(),
                            $(this).attr('data'),
                            $(this).attr('data-label'),
                            class_name
                        );
                }

                if($(this).attr('id') == 'osago_conditions' ){

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

                        OsagoWidget.step2
                            .validateField(
                                $(this).attr('id'),
                                $(this).val(),
                                $(this).attr('data'),
                                $(this).attr('data-label'),
                                class_name
                            );
                    }
                }


                OsagoWidget.step2.addButton(form,false);

            });

            form.on('blur',function () {

                if($(this).attr('id') == 'osago_desired_start_date'){


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

                    var data =  {
                        'token'         :   '3412sadfsadfasdfasdfcasdfa',
                        'desired_start_date'    :$(this).val()
                    }

                    OsagoWidget.step2.sendAjax(data,OsagoWidget.step2.getStartDateResponse);
                }


                if( $(this).attr('id') !=='osago_user_phone_number' &&
                    $(this).attr('id') !=='osago_user_phone_number_confirm' &&
                    $(this).attr('id') !=='osago_pay_type_liqpay' &&
                    $(this).attr('id') !=='osago_pay_type_portmone'&&
             //       $(this).attr('id') !=='osago_conditions' &&
                    $(this).attr('id') != undefined
                ){
                    OsagoWidget.step2.onOffSms();
                }


                if($(this).attr('id') == 'osago_user_inn'){

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
                            .removeClass('valid'+class_name+'')
                            .addClass('error')
                            .find('.message')
                            .html('<span>'+ $(this).attr('data-label')+'</span>');
                    }

                    // console.log(inn[9],inn_mod_11);

                }


                if($(this).attr('id') == 'osago_form_1_auto_date') { //проверка года машини и проезда без дтп.

                    var year_claim = now_year - $(this).val();

                    if (year_claim <= 4 ) {

                        var claim = OsagoWidget.settings.osago_claims[$('#osago_claims_step2').val()];
                        if (year_claim < claim) {

                            $('fieldset.open input,fieldset.open select,fieldset.open radio')
                                .attr("disabled", true);
                            $('fieldset.open').addClass('closed').removeClass('open');

                            //console.log($(this).attr('data-label'));

                            $(this)
                                .parents('.input_wrap')
                                .removeClass('ok')
                                .removeClass('valid'+class_name+'')
                                .addClass('error')
                                .find('.message')
                                .html('<span>'+ $(this).attr('data-label')+'</span>');

                                notify($('#osago_notify_year').html());
                            return;
                        } else {
                            $('fieldset.closed').addClass('open').removeClass('closed');
                            $('fieldset.open input,fieldset.open select,fieldset.open radio')
                                .attr("disabled", false);
                        }
                    } else {



                        $('fieldset.closed').addClass('open').removeClass('closed');
                        $('fieldset.open input,fieldset.open select,fieldset.open radio')
                            .attr("disabled", false);

                        OsagoWidget.step2
                            .validateField(
                                $(this).attr('id'),
                                $(this).val(),
                                $(this).attr('data'),
                                $(this).attr('data-label'),
                                class_name
                            );
                    }

                    $('#osago_user_phone_number,input[name=osago_phone_button],#osago_user_phone_number_confirm')
                        .prop('disabled',true);

                }


                if($(this).attr('id') == 'osago_user_phone_number_confirm'){

                  //  console.log($(this).val());

                    var data  = {

                        'code':  $(this).val(),
                        'token':    '3412sadfsadfasdfasdfcasdfa'
                    }
                    OsagoWidget.step2.sendAjax(data,OsagoWidget.step2.getSmsResponse);
                }
//проверка даты выдачи паспорта
                if($(this).attr('id') == 'osago_user_passport_date'){

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

                    var data =  {
                        'token'         :   '3412sadfsadfasdfasdfcasdfa',
                        'date_birth'    :   $('#osago_user_date_birth').val(),
                        'date_passport' :   $(this).val()
                    }





                    OsagoWidget.step2.sendAjax(data,OsagoWidget.step2.getPassportDateResponse);
                }

                if($(this).attr('id') == 'osago_form_1_auto_serial_number' ) {
                    $(this).val($(this).val().toUpperCase());
                }

                if($(this).attr('id') == 'osago_form_1_auto_reg_number' ) {

                    $(this).val($(this).val().toUpperCase());
                   // console.log($(this).val());
                }


                if($(this).attr('id') == 'osago_user_date_birth'){


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

                if($(this).attr('id') == 'osago_user_passport_series' ) {

                    if( $('#osago_user_passport_number').val()=='' ||
                        $('#osago_user_passport_number').val().length != 6  ){

                        $(this)
                            .parents('.input_wrap')
                            .removeClass('ok')
                            .removeClass('valid'+class_name+'');
                    }

                }
                if($(this).attr('id') == 'osago_user_passport_number' ) {
                    if($('#osago_user_passport_series').val().length < 2 )

                        $(this)
                            .removeClass('error')
                            .parents('.input_wrap')
                            .removeClass('ok')
                            .removeClass('valid'+class_name+'')
                            .removeClass('error')
                            .find('.message')
                            .html('');
                }

                OsagoWidget.step2.addButton(form,false);
            });
        },

        showClosePhoneBlock : function(){

        },

        stateKiev: function(id){
           // console.log(id);

            //10|70|800

            var token = '3412sadfsadfasdfasdfcasdfa';
            var data_city  = {
                'reg_id':   70,
                'obl_id':   $('#osago_user_obl').val(),
                'token' :   token
            }

            $('#osago_user_city').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');
            $('#osago_user_index').html('').parents('.input_wrap').removeClass('ok').removeClass('valid_form');

            OsagoWidget.step2.sendAjax(data_city,OsagoWidget.step2.getCity);

             var data  = {
                 'reg_id'    :   70,
                 'obl_id'    :   $('#osago_user_obl').val(),
                 'city_id'   :   800,
                 'token'     :   token
             }

            OsagoWidget.step2.sendAjax(data,OsagoWidget.step2.getCityIndex);

        },

        onOffSms: function(){

            $('#osago_user_phone_number,#osago_user_phone_number_confirm').val('')

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

            $('input[name=osago_phone_button]')
                .val('Пiдтвердити через SMS')
                .removeClass('green')
                .removeClass('blue')
                .addClass('grey')    ;


          //  OsagoWidget.step2.addButton($('#osago_step2_1 input,#osago_step2_1 select'));

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


                if($(this).attr('name') == 'osago_phone_button'){
                    return ;
                }

                if($(this).attr('id') == 'osago_user_inn'){

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

                if($(this).attr('id') == 'osago_user_date_birth'){


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
                if($(this).attr('id') == 'osago_user_passport_date'){


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

                    var data =  {
                        'token'         :   '3412sadfsadfasdfasdfcasdfa',
                        'date_birth'    :   $('#osago_user_date_birth').val(),
                        'date_passport' :   $(this).val()
                    }

                    OsagoWidget.step2.sendAjax(data,OsagoWidget.step2.getPassportDateResponse);
                }


                if($(this).attr('id') == 'osago_desired_start_date'){


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

                    var data =  {
                        'token'         :   '3412sadfsadfasdfasdfcasdfa',
                        'desired_start_date'    :$(this).val()
                    }

                    OsagoWidget.step2.sendAjax(data,OsagoWidget.step2.getStartDateResponse);
                    return ;
                }

                if($(this).attr('id') == 'osago_claims_step2')
                    return;

                if($(this).attr('id') == 'osago_conditions' ){
                    if(!$(this).prop( "checked" )){
                        if(cheack_all)
                            $(this)
                                .parents('.input_wrap')
                                .removeClass('ok')
                                .removeClass('valid'+class_name+'')
                                .addClass('error')
                                .find('.message')
                                .html('<span>'+ $(this).attr('data-label')+'</span>');

                        return ;
                    }
                }


                // if($(this).attr('id') != 'osago_pay_type_portmone' &&
                //     $(this).attr('id') != 'osago_pay_type_free' &&
                //     $(this).attr('id') != 'osago_pay_type_liqpay'
                // ){

                    if(cheack_all)
                        OsagoWidget.step2
                            .validateField(
                                $(this).attr('id'),
                                $(this).val(),
                                $(this).attr('data'),
                                $(this).attr('data-label'),
                                class_name
                            );


                // }
                i_count ++;



               // console.log($(this).attr('id'));

            });
            /**
             * добавляем ++ если выбрали платежную систему
             */


            if($('input[name=osago_pay_type]').filter(':checked').val() != undefined){

                //console.log($('input[name=osago_pay_type]').filter(':checked').val());
                //убиваем все валидные теги
                $('input[name=osago_pay_type]')
                   // .removeClass('valid'+class_name+'')
                  //  .parents('.input_wrap')
                    .removeClass('ok')
                    .removeClass('valid'+class_name+'');

                OsagoWidget.step2
                    .validateField(
                        $('input[name=osago_pay_type]').filter(':checked').attr('id'),
                        $('input[name=osago_pay_type]').filter(':checked').val(),
                        $('input[name=osago_pay_type]').filter(':checked').attr('data'),
                        $('input[name=osago_pay_type]').filter(':checked').attr('data-label'),
                        class_name
                    );
                i_count ++;
            }else{

                if(cheack_all){
                    $('input[name=osago_pay_type]')
                        .removeClass('valid'+class_name+'')
                        .parents('.input_wrap')
                        .removeClass('ok')
                        .removeClass('valid'+class_name+'')
                        .addClass('error')
                        .find('.message')
                        .html('<span>Помилка платіжної системи</span>');
                }
            }



            var len =  OsagoWidget.step2.sendType();




            //if(OsagoWidget.settings.input_count_all ==  len ){

                OsagoWidget.step2.enableDisablePhone(len);

            // console.log(
            //     len,
            //     i_count,
            //     OsagoWidget.settings.input_count_all,
            //     OsagoWidget.settings.count_valid_form_fields
            // );

                if(len  == OsagoWidget.settings.count_valid_form_fields){
                  // console.log('Можно отравлять данные.');
                    $('#osago_submit').addClass('green').removeClass('gray');
                    return true;
                }else{
                  //  console.log('Не все обязательные поля заполнили !!!');
                    $('#osago_submit').addClass('gray').removeClass('green');
                    return false;
                }
            //}else{
            //    OsagoWidget.step2.enableDisablePhone(len);
            //    $('#osago_submit').addClass('gray').removeClass('green');
            //    return false;
            //}
        },
        enableDisablePhone: function(len){

            if($('#osago_pay_type_liqpay').hasClass('valid_form')){
                len = len-1;
            }
            if($('#osago_pay_type_portmone').hasClass('valid_form')){
                len = len-1;
            }
            if($('#osago_user_phone_number').hasClass('valid_form')){
                len = len-1;
            }
            if($('#osago_user_phone_number_confirm').hasClass('valid_form')){
                len = len-1;
            }

            //console.log(len);
            //console.log(OsagoWidget.settings.count_valid_form_fields);

            if(len == OsagoWidget.settings.count_valid_form_fields - 3 ){
               // console.log('Можно включать валидацю по СМС!');

                $('#osago_user_phone_number,input[name=osago_phone_button],#osago_user_phone_number_confirm')
                    .prop('disabled',false);

                $('#phone_verification').css('display','block');
            }else{

                //Видаляємо код смс з сесії
                var data  = {
                    'code_off'  : true   ,
                    'token'     : DgoWidget.settings.token
                }
                OsagoWidget.step2.sendAjax(data,function(response){
                    console.log(response);
                });


                $('#osago_user_phone_number,input[name=osago_phone_button],#osago_user_phone_number_confirm')
                    .prop('disabled',true);

                $('#phone_verification').css('display','none');
            }

        },

        sendType: function () {

            //Уника
            if($('#osago_delivery_type').val() == '1' ){

                $('#osago_nova_posta_city,#osago_nova_posta_sklad_number')
                    .removeClass('valid'+class_name+'')
                    .parents('.input_wrap')
                    .removeClass('ok');
                    //.addClass('error');

                //    console.log('type 1',$('.valid'+class_name+'').length);

            }
            //ТЕС
            if($('#osago_delivery_type').val() == '2' ){

                $('#osago_delivery_region, #osago_nova_posta_sklad_number,#osago_delivery_office,#osago_nova_posta_city')
                    .removeClass('valid'+class_name+'')
                    .parents('.input_wrap')
                    .removeClass('ok');
                   // .addClass('error');

                //   console.log('type 2',$('.valid'+class_name+'').length);
            }
            //Нова Пошта
            if($('#osago_delivery_type').val() == '3' ){

                $('#osago_delivery_region,#osago_delivery_office')
                    .removeClass('valid'+class_name+'')
                    .parents('.input_wrap')
                    .removeClass('ok');
                    //.addClass('error');


              //  console.log('type 3',$('.valid'+class_name+'').length);
            }
            //2 - поля для
            var len = $('.valid'+class_name+'').length;

            if($('#osago_delivery_type').val() == '2' ){
                len = len+2;
            }
            return len;
        },

        submitForm: function(form){
            if(OsagoWidget.step2.addButton(form,true)){
              //  console.log('Valid');
                $('#osago_step2_1').submit();
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
                if(feild_id == 'osago_user_phone_number')
                    $('input[name=osago_phone_button]').addClass('green');

                $('#'+feild_id)
                    .addClass('valid'+class_name+'')
                    .removeClass('error')
                    .parents('.input_wrap')
                    .removeClass('error')
                    .addClass('ok')
                    .find('.message')
                    .text('');
            }else{
                if(feild_id == 'osago_user_phone_number')
                        $('input[name=osago_phone_button]').removeClass('green');

                $('#'+feild_id)
                    .addClass('error')
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
         * callback -  обработчик для регионов
         * @param regions
         */
        setRegion: function (regions) {
            $('#osago_user_region').prepend('<option>').prop('disabled',false);
            $.each(regions, function (index, val) {
                $('#osago_user_region').append($('<option/>', {
                    value: val.reg2,
                    text : val.title
                }));
            });
            if($('#osago_user_obl').val() == 10){
                $('#osago_user_region').val('70').prop('selected', true);

                if( $('#osago_user_region').val() == 70){
                    var class_name  = '_form';
                    OsagoWidget.step2
                        .validateField(
                            $('#osago_user_region').attr('id'),
                            $('#osago_user_region').val(),
                            $('#osago_user_region').attr('data'),
                            $('#osago_user_region').attr('data-label'),
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

            $('#osago_user_city').prepend('<option>').prop('disabled',false);

            $.each(cities, function (index, val) {
                $('#osago_user_city').append($('<option/>', {
                    value: val.reg3,
                    text : val.title
                }));
            });
            if($('#osago_user_obl').val() == 10){
                $('#osago_user_city').val('800').prop('selected', true);


                if( $('#osago_user_city').val() == 800){
                    var class_name  = '_form';
                    OsagoWidget.step2
                        .validateField(
                            $('#osago_user_city').attr('id'),
                            $('#osago_user_city').val(),
                            $('#osago_user_city').attr('data'),
                            $('#osago_user_city').attr('data-label'),
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

            $('#osago_user_index').prepend('<option>').prop('disabled',false);
            $.each(indexes, function (index, val) {
                $('#osago_user_index').append($('<option/>', {
                    value: val.reg4,
                    text : val.title
                }));
            });


        },
        /**
         * Отправка СМС
         */
        sendSms : function (){

            var data  = {
                'phone':    $('#osago_user_phone_number').val(),
                'token':    '3412sadfsadfasdfasdfcasdfa'
            }
            OsagoWidget.step2.sendAjax(data,OsagoWidget.step2.getSendSmsRessponse);
            notify($('#osago_notify_sms').html());

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

                $('#osago_user_phone_number_confirm')
                    .parents('.input_wrap')
                    .removeClass('ok')
                    .removeClass('valid_form')
                    .addClass('error')
                    .find('.message')
                    .removeClass('osago_phone_ok')
                    .html('<span>'+$('#osago_notify_code_sms').html()+'</span>');

                $('input[name=osago_phone_button]')
                    .removeClass('green')
                    .addClass('blue')
                    .val('Згенерувати код ще раз');
            }else{
                //osago_phone_ok
                $('input[name=osago_phone_button]')
                    .removeClass('blue')
                    .removeClass('green')
                    .addClass('grey');

                $('#osago_user_phone_number_confirm')
                    .parents('.input_wrap')
                    .find('.message')
                    .addClass('osago_phone_ok')
                    .html('<span>'+$('#osago_user_phone_number_confirm').attr('data-phoneok')+'</span>');
            }

        },

        getStartDateResponse: function(data){

            var start_field = $('#osago_desired_start_date');
            class_name ='_form';
            if(data.years_now > 0){
                OsagoWidget.step2
                    .validateField(
                        start_field.attr('id'),
                        'error',
                        start_field.attr('data'),
                        start_field.attr('data-label'),
                        class_name
                    );
            }else{
                if(data.mounth > 0){
                    OsagoWidget.step2
                        .validateField(
                            start_field.attr('id'),
                            'error',
                            start_field.attr('data'),
                            start_field.attr('data-label'),
                            class_name
                        );
                }else{
                    if(data.days_now < 0){
                        OsagoWidget.step2
                            .validateField(
                                start_field.attr('id'),
                                'error',
                                start_field.attr('data'),
                                start_field.attr('data-label'),
                                class_name
                            );
                    }else{
                        OsagoWidget.step2
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

        getPassportDateResponse: function (data){

            class_name ='_form';
            var pass_field = $('#osago_user_passport_date');


            if(data.years == undefined){
                OsagoWidget.step2
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
                    OsagoWidget.step2
                        .validateField(
                            pass_field.attr('id'),
                            pass_field.val(),
                            pass_field.attr('data'),
                            pass_field.attr('data-label'),
                            class_name
                        );
                }else{
                    if(data.days_now >= 0){
                        OsagoWidget.step2
                            .validateField(
                                pass_field.attr('id'),
                                pass_field.val(),
                                pass_field.attr('data'),
                                pass_field.attr('data-label'),
                                class_name
                            );
                    }else{
                        OsagoWidget.step2
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
                OsagoWidget.step2
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
         * Отправка Аякс запроса.
         * @param data
         */
        sendAjax: function (data,callback) {

            $.ajax({
                method: "POST",
                url: "/osago.php",
                data: data
            })
                .done(function( response ) {
                    callback(response);
                });
        },
        /**
         * Метод для обработки отравки для ОСАГО
         */
        deliverySelect: function () {

            $('#osago_delivery_type').on('change',function(){

                for(var i =1; i < 4; i++){
                    $('#osago_delivery_options_' + i).css('display','none');
                    $('#osago_delivery_options_' + i + ' input,#osago_delivery_options_' + i + ' select')
                        .attr("disabled", true);
                }
                $('#osago_delivery_options_' + $(this).val()).css('display','block');
                $('#osago_delivery_options_' +  $(this).val() + ' input,#osago_delivery_options_' +  $(this).val() + ' select')
                    .attr("disabled", false);

            });
        },
        /**
         * Метод callback - для отображения офисов продаж вторй шаг, третья форма.
         * @param offices
         */
        deliveryOffices: function(offices){

            $('#osago_delivery_office').html('');
            $('#osago_delivery_office').prepend('<option>');
            $.each(offices, function (index, val) {
                $('#osago_delivery_office').append($('<option/>', {
                    value: val.id,
                    text : val.address_ua
                }));
            });

        }
    }
}
