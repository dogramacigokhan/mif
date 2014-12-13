/**
 * Only one movie sync manager instance exists, so we can use closures for encapsulation
 */
Manager.movieSyncManager = (function(){

    return {

        getMovieHistory: function(callback) {

            chrome.storage.sync.get(Manager.movieConstants.MOVIE_HISTORY_STORAGE_KEY, function(data) {

                var movieHistory = data[Manager.movieConstants.MOVIE_HISTORY_STORAGE_KEY];
                if (movieHistory) {
                    if (movieHistory.hasOwnProperty("movies") && movieHistory["movies"].length > 0)
                    {
                        callback(movieHistory);
                        return;
                    }
                }
                callback(null);
            });
        },

        addRecentSearch: function(movieId, movieTitle, movieRating) {

            this.getMovieHistory(function(movieHistory) {

                var movieData =
                {
                    'tconst': movieId || "",
                    'title': movieTitle || "",
                    'rating': movieRating || ""
                };

                if (movieHistory) {

                    // We already have history data, so check the movie exists in that data or not
                    if (movieHistory.indexOf(movieData) == -1) {
                        movieHistory["movies"].push(movieData);
                        Manager.movieSyncManager.setMovieHistoryStorage(movieHistory);
                    }
                } else {
                    Manager.movieSyncManager.setMovieHistoryStorage({'movies': [movieData]});
                }
            });
        },

        /* Not a good implementation
        removeHistoryDuplicate: function(movie, movieHistory) {

            if (movieHistory == null || !movieHistory.hasOwnProperty("movies") || movieHistory["movies"].length == 0) {
                return;
            }

            var i, movies = movieHistory["movies"];
            for (i = 0; i < movies.length; i++) {
                if (movies[i].hasOwnProperty("tconst") && movies[i]["tconst"] == movie["tconst"]) {
                    break;
                }
            }
            movieHistory["movies"].splice(i, 1);
        },
        */

        removeHistoryItem: function(movieId) {

            this.getMovieHistory(function(movieHistory) {

                if (movieHistory) {
                    var i, movies = movieHistory["movies"];
                    for (i = 0; i < movies.length; i++) {
                        if (movies[i].hasOwnProperty("tconst") && movies[i]["tconst"] == movieId) {
                            break;
                        }
                    }
                    movieHistory["movies"].splice(i, 1);
                    Manager.movieSyncManager.setMovieHistoryStorage(movieHistory, function() {
                        Manager.movieSyncManager.setRecentSearchItems();
                    });
                }
            });
        },

        setMovieHistoryStorage: function(data, callback) {
            var pair = {};
            pair[Manager.movieConstants.MOVIE_HISTORY_STORAGE_KEY] = data;
            chrome.storage.sync.set(pair, callback);
        },

        setRecentSearchItems: function() {

            var recentSearches = this.clearRecentSearches();
            this.getMovieHistory(function(movieHistory) {
                if (movieHistory) {
                    recentSearches.parent().show();
                    var movies = movieHistory["movies"];
                    this.setRecentSearches(movies);
                    addRecentMovieButtonListeners();
                } else {
                    recentSearches.parent().hide();
                }
                adjustPageSize();
            });
        },

        setRecentSearches: function(movies) {

            var recentSearches = this.clearRecentSearches();
            for (var i = movies.length - 1; i >= 0 && i >= movies.length - Manager.movieConstants.MAX_RECENT_SEARCHED_MOVIE_COUNT; i--) {
                var movie = movies[i];
                var searchItem = Manager.templateManager.getRecentSearchMovieTemplate(movie["tconst"], movie["title"], movie["rating"]);
                recentSearches.append(searchItem);
                this.setImageSrc($(".recent_search_img", searchItem), movie["tconst"], 84, 0);
            }
        },

        clearRecentSearches: function() {
            return $(".recent_searches").empty();
        },

        setImageSrc: function(imageDOM, movieId, width, height) {
            imageDOM.hide();
            imageDOM.parent().find(".loading_image_container").show();

            imageDOM.load(function() {
                $(this).show();
                $(this).parent().find(".loading_image_container").hide();
            }).error(function() {
                $(this).attr("src", "images/not_available.jpg");
                $(this).show();
                $(this).parent().find(".loading_image_container").hide();
            });

            var src = Manager.movieManager.getAdjustedImageUrl(movieId, width, height);
            imageDOM.attr("src", src);
        }
    }
})();