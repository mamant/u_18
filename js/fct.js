// functions.js
function runajax(objID, serverPage)
{
	//Create a boolean variable to check for a valid Internet Explorer instance.
	var xmlhttp = false;
	//Check if we are using IE.
	try {
	//If the JavaScript version is greater than 5.
	xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
	//If not, then use the older ActiveX object.
	try {
	//If we are using Internet Explorer.
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	} catch (E) {
	//Else we must be using a non-IE browser.
	xmlhttp = false;
	}
	}
	// If we are not using IE, create a JavaScript instance of the object.
	if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
	xmlhttp = new XMLHttpRequest();
	}
	var obj = document.getElementById(objID);
	xmlhttp.open("GET", serverPage);
	xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	obj.innerHTML = xmlhttp.responseText;
	}
	}
	xmlhttp.send(null);
}

function debugTick(label){
    runajax("debugInfo","/index.php?obj=ajax&action=tick&label="+label);
}

function debugDisplay(){
    runajax("debugInfo","/index.php?obj=ajax&action=display_debug");
}

function replyTo( elem_id ){
    var elem = "reply" + elem_id;
    $(".replyBoxes").empty();
    document.getElementById( "reply_id" ).value = elem_id;
    $("#reply_contain div").clone().appendTo("#"+elem);
    $( "#"+elem ).show('slide');
}

function reportComment( elem_id ){
    var elem = "reply" + elem_id;
    $(".replyBoxes").empty();
    document.getElementById( "report_comment_id" ).value = elem_id;
    $("#report_contain div").clone().appendTo("#"+elem);
    $( "#"+elem ).show('slide');
}

$(document).ready(function() {
	// Date pickers
	$( ".news_date input[type=text]" ).datepicker({
		dateFormat: 'yy-mm-dd'
	});

});

function find_zip(city, street, result_box){
    runajax(result_box, "/data/find-zip-codes/?locality="+city+"&street="+street);
}
