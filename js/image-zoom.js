$(document).ready(function(){
	$('span.zoom-img').bind('click',function(){
		//$('div.imagine-zoom').remove();
		var el = $(this);
		var index = el.attr('data-index');
		$('html, body').animate({
            scrollTop: $("img.csr-image").offset().top-400
    	}, 1000);
		$('.overlay-content, .overlay-background').hide();
		$('.overlay-background').css('height', $('body').outerHeight() + 'px');
		changepicture(index);
		$('.overlay-background, .zoom_form').show();
	});
});

function changepicture(index){
	$cale=$('img.zoom-img[data-index="'+index+'"]').attr("src");
	$("div.imagine-zoom").html("<img class='imagine-galerie' src='"+$cale+"' />");
}

$("#scroll-to").click(function() {
    $('html,body').animate({
        scrollTop: $("#card-de-fidelitate").offset().top},
        'slow');
});