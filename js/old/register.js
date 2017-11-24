// Registeration form
$(document).ready( function() {

  $.datepicker.regional['ua'] = {
    clearText: 'Очистити', clearStatus: '',
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

  registration.init();
});

var registration = {
  init: function () {
    $("#registration-phone").mask("+38 (099) 9999999");
    $('.date')
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
  }
};
