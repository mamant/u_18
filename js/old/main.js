var overlayTimeout;
$(document).ready(function() {

	$('.newmap-select-map').click(function () {
		$('.newmap-list').addClass('up');
		$('.newmap-select-list').removeClass('actv');
		$(this).addClass('actv');
	});
	$('.newmap-select-list').click(function () {
		$('.newmap-list').removeClass('up');
		$('.newmap-select-map').removeClass('actv');
		$(this).addClass('actv');
	});


    $(".open_legal").click(function(){
       openLegal('left');
    });
	// Close overlays
	$('.overlay-content .close, .overlay-background').click(function(){
		$("#systemmsg").remove();
		$('.overlay-content, .overlay-background').hide();
	});

	$(".city").autocomplete({
        source: '/data/select-city/',
        selectFirst: true,
        minLength: 2
    });

    try {
    	$('.label.bestbuy span').rotate(-41);
    }
    catch(err) {}
	// Set background height - костыль по нашему
	$('.bg1600px').css('height', $('body').outerHeight() + 35 + 'px'); // 35 высота футера +/-, убирает белую полосу под футером

	// White overlay

	$('.overlay-background.white').css('height', ($('body').outerHeight() - 515) + 'px');

	overlayTimeout = setTimeout(function(){
		$('.overlay-background.white').hide();
	}, 5000);

	var petitions = 5;

	var petitionInterval = setInterval(function(){
		$('.petitions').text(--petitions);

		if(petitions == 0)
			clearInterval(petitionInterval);
	}, 1000);

	var openMobileNav = false;

	// Open mobile menu
	$('#show-mobile-menu').click(function(){
		if(!openMobileNav) {
			$(this).addClass('close');
			$('.section, header, footer').css('position', 'relative');
			$('.section, header, footer, #carousel').animate({ left: '-85%' }, 458, 'swing');
			$('.section.top-links').css('z-index', '99');
			$('.overlay-background').addClass('mob-nav').css('height', $('body').outerHeight() + 'px');
			$('.mobile-nav, .overlay-background').show().animate({ left: '15%' }, 458, 'swing');
			openMobileNav = true;
		}
		else {
			$(this).removeClass('close');
			$('.section, header, footer, #carousel').animate({ left: '0' }, 458, 'swing', function(){
				$('.section, header, footer').css('position', 'static');
			});

			$('.mobile-nav, .overlay-background').show().animate({ left: '100%' }, 458, 'swing', function(){
				$('.overlay-background').removeClass('mob-nav');
				$(this).hide();
			});
			openMobileNav = false;
		}
		/*
		$('.section, header, footer, #carousel').css('position', 'relative').animate({ left: '-85%' }, 458, 'swing');
		$('.section.top-links').css('z-index', '99');
		$('.overlay-background').addClass('mob-nav').css('height', $('body').outerHeight() + 'px');
		$('.mobile-nav, .overlay-background').show().animate({ left: '15%' }, 458, 'swing');
		*/
	});


	// Toggle mobile submenu & footer mobile submenu
	$('.selection-summary h2').click(function(){
		$(this).next().slideToggle();
		$('i', this).toggleClass('minus');
	});

/*
	$('.mobile-nav .main').click(function(){
		$(this).next().slideToggle();
		$('i', this).toggleClass('minus');
	});
	*/

	/*
	$('.footer-links h4').click(function(){
		$(this).next().slideToggle();
		$('i', this).toggleClass('minus');
	});
	*/


	$('.message-summary h2').click(function(){
		$(this).parent().removeClass('unread');
		$(this).next().slideToggle();
		$('i.right', this).toggleClass('minus');
	});


	// Expand / Collapse my account

	$('.account-section h3').click(function(){
		$('a', this).toggleClass('collapse');
		$('ul.list', $(this).parent()).slideToggle();
	});

	// Pretty all checkboxes and radio buttons
	//$('input[type=checkbox], input[type=radio]').prettyCheckable();
	$('input[type=checkbox], input[type=radio]').each(function() {
        $(this).prettyCheckable();
    });

    // Pretty radios and checkboxes
    $(".prettyradio label, .prettycheckbox label").click(function (){ var label = $(this).attr("for"); $("#"+label).valid();});
    $(".prettyradio a, .prettycheckbox a").click(function (){ var input = $(this).prev(); $(input).valid();});

	// Default date pickers

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

	$( ".date-field input[type=text]" ).datepicker({
		dateFormat: 'dd.mm.yy',
		minDate: 0
	});

	// if (!$('select').hasClass('select')) {
	// 	$('select').select2({
	// 		minimumResultsForSearch: -1
	// 	});
	// }


	$(".select2-container input").prop("readonly",true);
	//
	// Checkbox click
	$('.product-box .prettycheckbox').click(function(){
		if($('a', this).hasClass('checked'))
			$('label i', this).removeClass('tickred').addClass('tickgreen');

		else
			$('label i', this).removeClass('tickgreen').addClass('tickred');
	});


	// Homepage Carousel Init
	var hpSlider = $('#carousel ul.mainUL').bxSlider({
		nextSelector: '.directions.next',
  		prevSelector: '.directions.prev',
  		auto: true,
  		autoHover: true,
  		onSlideBefore: function($slideElement) {
  			hpSlider.setPause($slideElement.attr('data-duration'));
  		}
	});


	// Open the login form
	$('.account-action.login, .login_modal').click(function(){
        $('html, body').animate({
            scrollTop: $("#login_form").offset().top-400
        }, 1000);

	    $('.overlay-content, .overlay-background').hide();
		$('.overlay-background').css('height', $('body').outerHeight() + 'px');
		$('.overlay-background, .login-form').show();
	});


	// Open the register form
	$('.account-action.register').click(function(){
		$('.overlay-content, .overlay-background').hide();
        $('.overlay-background').css('height', $('body').outerHeight() + 'px');
		$('.overlay-background, .register-form').show();
        //validate_register();
	});

	// Open the register form from modal
	$('.register_modal').click(function(){
        $('html, body').animate({
            scrollTop: $("#login_form").offset().top-400
        }, 1000);

	    $('.overlay-content, .overlay-background').hide();
		$('.overlay-background').css('height', $('body').outerHeight() + 'px');
		$('.overlay-background, .register-form').show();
        validate_register();


	});

	// Open the reset pass form
	$('.reset-pass-lnk').click(function(){
	    $('.overlay-content, .overlay-background').hide();
		$('.overlay-background').css('height', $('body').outerHeight() + 'px');
		$('.overlay-background, .reset-pass-form').show();
        validate_reset_pass();
	});


	// Life Situation Content

	$('.life-event i.size60, .life-event span').click(function(){
		$('.life-event-active', $(this).parent()).toggle();
	});

	$('.life-event-active .close').click(function(){
		$(this).parent().hide();
	});


	// Close overlays
	$('.overlay-content .close, .overlay-background').click(function(){
		$('.overlay-content, .overlay-background:not(".white")').hide();
		$('.mobile-nav').animate({ left: '100%' }, 458, 'swing', function(){
			$(this).hide();
		});
	});

	// Close modals

	$('.closemodal').click(function(){

		var $parent = $(this).closest('.modal');

		if($parent.hasClass('popup'))
			$parent.hide();
		else
			$(this).closest('.modal').slideUp();

		$('.overlay-background').hide();

	});
});



function openLegal(id) {
	clearTimeout(overlayTimeout);
	$('.overlay-background:not(".white")').css('height', $('body').outerHeight() + 'px');
	$('.overlay-background:not(".white"), .legal-content').show();
	$('.overlay-background.white').hide();
}