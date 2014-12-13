var windowResizeDelta = 5;
var windowResizeInterval = 5;
var windowResizeIntervalId = -1;

var resetAppWindowSize = function() {

	var app_window = Ti.UI.getCurrentWindow();

	app_window.setHeight($(".page_container").height()+10);
	app_window.setWidth(386);

	app_window.setX(screen.width-app_window.getWidth());
	app_window.setY(screen.availHeight-app_window.getHeight());
};

var resetAppWindowHeight = function() {

	clearInterval(windowResizeIntervalId);	
	var app_window = Ti.UI.getCurrentWindow();
	
	var finalHeight = $(".page_container").height()+10;
	var initialDiff = finalHeight - app_window.getHeight();
	var initialDiffSign = initialDiff ? initialDiff < 0 ? -1 : 1 : 0;

	windowResizeIntervalId = window.setInterval(function(){

		var diff = finalHeight - app_window.getHeight();
		var sign = diff ? diff < 0 ? -1 : 1 : 0;

		if (sign == 0 || initialDiffSign != sign) {
			clearInterval(windowResizeIntervalId);
		}
		app_window.setHeight(app_window.getHeight() + (windowResizeDelta * sign));
		app_window.setY(screen.availHeight-app_window.getHeight());

	}, windowResizeInterval);
};

var setPageTitle = function(title) {
	$("#page_title").text(title);
};

var showPage = function(pageName) {
	var activePage = $(".page_active");
	$("#"+pageName).addClass("page_active");

	// Remove after animation
	activePage.removeClass("page_active");
	$("#"+pageName).addClass("page_active");

    adjustPageSize();
};

var adjustPageSize = function() {
    $("body").css("height", $(".page_container").css("height"));
    $("html").css("height", $(".page_container").css("height"));
}

var timer;
var startTimer = function() {
	var timePassed = 0;
	timer = setInterval(function() {
		timePassed += 100;
		$("#timer_text").text((timePassed/1000).toString());
	}, 100);
};

var setEnterKey = function() {
    $("input").keypress(function(event) {
        if (event.which == 13) {
            if ($('#start_page_movie_search_text_box').is(':focus')) {
                onStartPageSearchMovieButtonPressed();
            } else if ($('#try_with_custom_name_text').is(':focus')) {
                onTryWithCustomNameButtonPressed();
            }
            return false;
        }
    });
};

$(document).ready(function() {
    setEnterKey();
	//startTimer();

    setPageTitle("Movie Info Finder");
    $("#start_page_movie_search_text_box").focus();
});