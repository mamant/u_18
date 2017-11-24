// Main js for my-uniqa

$(function() {

	$('.toggle .document-view__header').on('click', function () {
		$(this).parent().toggleClass('on');
	});
// Inbox
	$('.inbox--open').on('click', function () {
		$(this).parent().toggleClass('on');
	});

	$(".datepicker").datepicker();

// Modal
	$('.modal-close').on('click', function () {
		$('.modal-bacckdrop').hide();
		$('.modal').hide();
	});

	$('.toggle-btn-dd').on('click', function (event) {
		const toWindowBottom = window.screenY;
		const dropdownEL = $(event.target).closest('.btn-dropdown-container').find('.btn-dropdown');
		const container = $(event.target).closest('.btn-dropdown-container');
		container.removeClass('to-top');
		container.toggleClass('is-open');
		dropdownEL.height() >= window.scrollY && container.addClass('to-top');
	});

	$('.btn-dropdown-overlay').on('click', function (e) {
		$(e.target).closest('.btn-dropdown-container').removeClass('is-open');
	});
});

function showMyModal(modal) {
	window.innerHeight <= 700 && window.scrollTo(0, 0);
	$('.modal-bacckdrop').css({'z-index': '200'}).show();
	$('.' + modal).css({'z-index': '300'}).show();
}