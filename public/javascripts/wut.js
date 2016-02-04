$(document).ready(function() {


	console.log('hi there butt');


	$hi = $('.hi');
	var timeOut = setTimeout(function() {
		// $hi.fadeOut();
		$hi.css({'visibility': 'hidden'});
	}, 10000);

	$intro = $('.intro');
	$intro.hide();
	var timeOut = setTimeout(function() {
		$intro.fadeIn();
	}, 2000);

	$deal = $('.deal');
	$deal.hide();
	var timeOut = setTimeout(function() {
	    $deal.fadeIn();
	}, 7000);

	$first = $('#firstUrl');
	$second = $('#secondUrl');
	$button = $('.butt');
	$first.hide();
	$second.hide();
	$button.hide();
	var timeOut = setTimeout(function() {
	    $first.fadeIn();
	    $second.fadeIn();
	    $button.fadeIn();
	}, 10000);


	$(function() {
    $('#baseUrl').click( function() {
    	var furl = $('#firstUrl').val();
    	var surl = $('#secondUrl').val();
		$('#firstUrl').val('');
		$('#secondUrl').val('');
        window.location = $(this).attr('href') + '/' + furl + '/' + surl;
        return false;
    	});

	});




});


