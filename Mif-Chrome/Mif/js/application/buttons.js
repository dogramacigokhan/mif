var addButtonListeners = function() {

	$("#btn_close").click(function(){onCloseButtonPressed();});
	$("#btn_try_again").click(function(){onTryAgainButtonPressed();});

	$("img", ".movie_image_container").click(function(){onShowInImdbButtonPressed();});

	$("#btn_watch_movie").click(function(){onWatchMovieButtonPressed();});
	$("#btn_find_subtitle").click(function(){onFindSubtitleButtonPressed();});
	$("#btn_watch_trailer").click(function(){onWatchTrailerButtonPressed();});
	$("#btn_show_in_imdb").click(function(){onShowInImdbButtonPressed();});
    $("#btn_not_this_movie").click(function(){onNotThisMovieButtonPressed();});

    $("#btn_start_page_search_movie").click(function(){onStartPageSearchMovieButtonPressed();});
    $("#btn_try_with_custom_name").click(function(){onTryWithCustomNameButtonPressed();});

    $("#clear_search_history").click(function() {
        if (confirm("Are you sure to clear all history?")) {
            chrome.storage.sync.remove(Manager.movieConstants.MOVIE_HISTORY_STORAGE_KEY, function() {});
            Manager.movieSyncManager.setRecentSearchItems();
        }
    });
};

var addPossibleMovieButtonListeners = function() {
    $(".possible_movie").click(function(){
        onPossibleMovieButtonPressed($(this));
    });
};

var addRecentMovieButtonListeners = function() {

    $(".remove_recent_search").click(function() {
        Manager.movieSyncManager.removeHistoryItem($(this).parent().data("id"));
    });

    $(".recent_search_img").click(function() {
        Manager.movieManager.getMovieWithIMDBid($(this).parent().data("id"));
    });
};

var onCloseButtonPressed = function() {
	// Exit is too slow...
	//Ti.App.exit();
	if (typeof Ti !== 'undefined') {
		Ti.UI.getMainWindow().close();
	}
};

var onTryAgainButtonPressed = function() {
	if (Manager.movieManager !== undefined) {
		Manager.movieManager.tryAgain();
	}
};

var onWatchMovieButtonPressed = function() {
    var movie = Manager.movieManager.getMovie();
	if (typeof movie !== "undefined" && movie != null) {
        chrome.tabs.create({ url: movie.getWatchOnlineLink() });
	}
};

var onFindSubtitleButtonPressed = function() {
	if (Manager.movieManager !== undefined) {
		if (typeof Ti !== 'undefined') {
			Ti.Platform.openURL(Manager.movieConstants.SUBTITLE_API_URL.format(encodeURIComponent(Manager.movieManager._movieName)));
		}
	}
};

var onWatchTrailerButtonPressed = function() {
    var movie = Manager.movieManager.getMovie();
    if (typeof movie !== "undefined" && movie !== null) {
        chrome.tabs.create({ url: movie.getTrailerLink() });
	}
};

var onShowInImdbButtonPressed = function() {
	if (Manager.movieManager !== undefined) {
        chrome.tabs.create({ url: Manager.movieManager.ImdbUrl.format(Manager.movieManager.ImdbId) });
	}
};

var onNotThisMovieButtonPressed = function() {
	if (typeof Manager.movieManager !== "undefined") {
        Manager.movieManager.showPossibleMovies();
	}
};

var onStartPageSearchMovieButtonPressed = function() {
    if (typeof Manager.movieManager !== "undefined") {
        Manager.movieManager.findMovie($("#start_page_movie_search_text_box").val());
    }
    else {
        alert("MovieManager not found!");
    }
};

var onTryWithCustomNameButtonPressed = function() {
    if (typeof Manager.movieManager !== "undefined") {
        Manager.movieManager.findMovie($("#try_with_custom_name_text").val());
    }
    else {
        alert("MovieManager not found!");
    }
};

var onPossibleMovieButtonPressed = function(container) {
    if (typeof Manager.movieManager !== "undefined") {
        Manager.movieManager.getMovieWithIMDBid(container.find("a").data("id"));
    }
    else {
        alert("MovieManager not found!");
    }
};

$(document).ready(function(){
	addButtonListeners();
});

