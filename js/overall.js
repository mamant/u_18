$(document).ready(function() {
	$('.phone-mask').mask("+38(099) 999-99-99");
	// Change contact box content
	$('.contact-box .tabs a').click(function(){
		// Show Content
		$('.contact-box .content').hide();
		$('#' + $(this).attr('id') + '-content').show();

		// Make link selected
		$('.contact-box .tabs a').removeAttr('class');
		$(this).addClass('selected');
	});

	scrollTopPage();


// Open mobile menu

	var openMobileNav = false;

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
				$('.section, header, footer').css('position', 'relative');
			});

			$('.mobile-nav, .overlay-background').show().animate({ left: '100%' }, 458, 'swing', function(){
				$('.overlay-background').removeClass('mob-nav');
				$(this).hide();
			});
			openMobileNav = false;
		}
	});


// Toggle mobile submenu & footer mobile submenu
	$('.mobile-nav .main, .footer-links h4').click(function(){
		$(this).next().slideToggle();
		$('i', this).toggleClass('minus');
	});

	/*
	$('.open_submenu').on('click', function (e) {
		e.preventDefault();



		var opened = $(this).parent().hasClass('open');

		if (opened) {
			console.log('opened');
			$(this).parent().removeClass('open');
		}
		else {
			console.log('closed');
			$(this).parent().addClass('open');
		}
	});
*/

});




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




