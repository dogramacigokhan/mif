/**
 * Only one movie manager instance exists, so we can use closures for encapsulation
 */
Manager.movieManager = (function() {

    /**
     * The current processing movie
     * @type {Movie}
     */
    var _currentMovie;

    /**
     * Array of the found popular titles
     * The order of match rate is generally popular > exact > approximate
     * @type {Array}
     */
    var _popularTitles = [];

    /**
     * Array of the found exact titles
     * @type {Array}
     */
    var _exactTitles = [];

    /**
     * Array of the found approximate titles
     * @type {Array}
     */
    var _approximateTitles = [];

    /**
     * Cache indicator for the possible movies page
     * @type {boolean}
     */
    var _possibleMoviesPageIsSet = false;

    return {

        /**
         * Returns the current movie
         * @returns {Movie}
         */
        getMovie: function ()
        {
            return _currentMovie;
        },

        /**
         * Processes the movie name
         * @param {Movie} movie
         * @returns {boolean}
         */
        processMovieName: function (movie) {

            if (!movie || !movie.getRawMovieName()) {
                return false;
            }

            var movieName = movie.getRawMovieName().trim();
            // TODO: Parse operations
            // movieName = Manager.movieNameParser.parseMovieName(movieName);

            if (movieName !== "") {
                movie.setMovieName(movieName);
                return true;
            }

            return false;
        },

        /**
         * The main function of the Movie Finder which starts the movie finding operation
         * @param {string} movieName
         */
        findMovie: function (movieName, skipProcess) {

            _currentMovie = new Movie(movieName);
            if (typeof skipProcess === "undefined" || skipProcess === false) {
                if (!this.processMovieName(_currentMovie))
                    return;
            }

            Manager.movieManager.showLoading("Finding movie...");
            _possibleMoviesPageIsSet = false;

            var IMDbId = movieName.match(Manager.movieConstants.IMDb_ID_REGEXP);
            if (IMDbId != null) {
                // The IMDB id is given, start searching with that id
                _currentMovie.setIMDbId(IMDbId[0]);
                return this.getMovieWithIMDBid(IMDbId[0]);
            }
            else {
                // Find movie title
                $.ajax({
                    type: "GET",
                    url: Manager.movieConstants.IMDb_API_URL,
                    data: {t: movieName},
                    success: this.getTitles.bind(this),
                    error: this.requestError.bind(this),
                    timeout: Manager.movieConstants.REQUEST_TIMEOUT
                });
            }
        },

        getTitles: function (data, textStatus, jqXHR) {

            if (data.hasOwnProperty("single_tconst")) {
                return this.getMovieWithIMDBid(data["single_tconst"]);
            }

            _popularTitles = data["title_popular"];
            _exactTitles = data["title_exact"];
            _approximateTitles = data["title_approx"];

            if (typeof _popularTitles !== "undefined" && _popularTitles.length == 1) {
                // We have a single popular title
                this.getMovieWithIMDBid(_popularTitles[0]["id"]);
            }
            else {
                // We have no popular titles or we have more than one
                this.showPossibleMovies();
            }
        },

        getMovieWithIMDBid: function (movieId) {
            // Get the movie
            $.ajax({
                type: "GET",
                url: Manager.movieConstants.IMDb_API_URL,
                data: {id: movieId},
                success: this.setMovieInfos.bind(this),
                error: this.requestError.bind(this),
                timeout: Manager.movieConstants.REQUEST_TIMEOUT
            });

            _currentMovie.setIMDbId(movieId);
            Manager.movieManager.showLoading("Retrieving movie...");
        },

        setMovieInfos: function (data, textStatus, jqXHR) {

            // Re-check the popular title
            if (data["data"] === undefined) {
                this.showError("An error occured while retrieving the movie.");
                return;
            }

            _currentMovie.setData(data["data"]);
            _currentMovie.setMovieName(_currentMovie.getData("title") || _currentMovie.getMovieName());
            this.setMovieInfoTexts();

            showPage("movie_info_page");
            setPageTitle(_currentMovie.getMovieName());

            this.setWatchOnlineLink(_currentMovie.getMovieName());
            this.setTrailerLink(_currentMovie.getMovieName());

            // TODO: Move this into cache manager
            Manager.manager.addRecentSearch(_currentMovie.getData("tconst"), _currentMovie.getData("title"), _currentMovie.getData("rating"));
        },

        showPossibleMovies: function () {

            if (!_possibleMoviesPageIsSet) {

                // Clear the container first
                var moviesContainer = $(".possible_movies_list");
                moviesContainer.empty();
                var possible_movies_found = false;

                // Set popular movies first
                if (typeof _popularTitles !== "undefined") {
                    for (var i = 0, titleLength = _popularTitles.length; i < Manager.movieConstants.MAX_POPULAR_MOVIE_SUGGESTION && i < titleLength; i++) {
                        var movie = _popularTitles[i];
                        var movieTemplate = Manager.templateManager.getPossibleMovieTemplate(movie["id"], movie["title"], movie["description"]);

                        movieTemplate.appendTo(moviesContainer);
                        possible_movies_found = true;

                        this.setMovieThumbnail($(movieTemplate), movie);
                    }
                }

                // Set alternative suggestions
                if (typeof _exactTitles !== "undefined") {
                    for (var i = 0, titleLength = _exactTitles.length; i < Manager.movieConstants.MAX_ALTERNATIVE_MOVIE_SUGGESTION && i < titleLength; i++) {
                        var movie = _exactTitles[i];
                        var movieTemplate = Manager.templateManager.getPossibleMovieTemplate(movie["id"], movie["title"], movie["description"]);

                        movieTemplate.appendTo(moviesContainer);
                        possible_movies_found = true;

                        this.setMovieThumbnail($(movieTemplate), movie);
                    }
                }

                // Set the hover info
                $("a", ".possible_movie").attr("title", function () {
                    return $(this).text();
                });

                // No movie found
                if (!possible_movies_found) {
                    $("#movie_info_text", ".possible_movies_container").show();
                    $("#movie_info_text", ".possible_movies_container").text(_currentMovie.getMovieName() + " not found.");
                    $("#possible_movies_seperator_container").hide();
                    setPageTitle("Movie Not Found");
                }
                else {
                    $("#movie_info_text", ".possible_movies_container").hide();
                    $("#possible_movies_seperator_container").show();
                    setPageTitle("Possible Tags");
                }

                showPage("possible_movies_page");
                addPossibleMovieButtonListeners();
                _possibleMoviesPageIsSet = true;
            }
            else {

                // Possible movies page is already set, so just show the page
                showPage("possible_movies_page");
            }
        },

        setMovieThumbnail: function (movieObj, movie) {
            this.setImageSrc($(".movie_thumbnail", movieObj), movie["id"], 40, 40);
        },

        setWatchOnlineLink: function (movieName) {
            $("#btn_watch_movie").text("Finding movie...").attr("disabled", "disabled");
            Manager.movieWatchManager.getWatchOnlineLink(movieName, function (link) {
                if (link == null) {
                    $("#btn_watch_movie").text("Movie not found");
                } else {
                    _currentMovie.setWatchOnlineLink(link);
                    $("#btn_watch_movie").text("Watch Online").removeAttr("disabled");
                }
            });
        },

        setTrailerLink: function (movieName) {

            $("#btn_watch_trailer").text("Finding trailer...").attr("disabled", "disabled");

            $.ajax({
                type: "GET",
                url: Manager.movieConstants.YOUTUBE_API_URL.format(encodeURIComponent(movieName)),
                success: this.setTrailer.bind(this),
                error: this.trailerError.bind(this),
                timeout: Manager.movieConstants.REQUEST_TIMEOUT
            });
        },

        setTrailer: function (data, textStatus, jqXHR) {

            var trailerLink = "";
            try {
                trailerLink = data["feed"]["entry"][0]["link"][0]["href"];
            } catch (e) {
                trailerLink = "Trailer not found";
            }

            _currentMovie.setTrailerLink(trailerLink);
            $("#btn_watch_trailer").text("Watch Trailer").removeAttr("disabled");
        },

        trailerError: function (jqXHR, textStatus, errorThrown) {
            _currentMovie.setTrailerLink("Trailer not found");
            $("#btn_watch_trailer").text(_currentMovie.getTrailerLink());
        },

        showError: function (errorText) {
            $("#error_text").text(errorText);
            showPage("error_page");
        },

        showLoading: function (loadingText) {
            $("#loading_text").text(loadingText);
            showPage("loading_page");
        },

        tryAgain: function () {
            this.findMovie(_currentMovie.getMovieName(), true);
        },

        requestError: function (jqXHR, textStatus, errorThrown) {
            this.showError("An error occured: " + textStatus);
        },

        /*
        renameMovie: function () {

            if (typeof this._file !== 'undefined' && _file.exists()) {
                var filename = this.FileWithRatingPattern.format(this._movie["title"], this._movie["year"], this._movie["rating"] || "0.0") + "." + this._file.extension();
                filename = this.encryptFilename(filename);

                try {
                    var result = this._file.rename(filename);
                    if (result === true) {
                        this._file = Ti.Filesystem.getFile(this._file.parent() + Ti.Filesystem.getSeparator() + filename);
                    }
                    else {
                        alert("Rename failed!");
                    }
                } catch (e) {
                    alert(e.toString());
                }
            }
            else {
                alert("Can't find movie at: " + this._file.nativePath());
            }
        };

        encryptFilename: function (filename) {
            var regexp = /[\\\/\:\*\?<>\|"]/gi;
            return filename.replace(regexp, "");
        },

        */

        getAdjustedImageUrl: function (id, width, height) {
            return Manager.movieConstants.IMDb_IMAGE_URL.format(id, width, height);
        },

        setMovieInfoTexts: function () {
            var movieData = _currentMovie.getAllData();
            var notAvailableText = "Not available";
            var runtime, genre, director, plot, img;

            try { runtime = movieData["runtime"]["time"]; }
            catch (e) { runtime = notAvailableText; }

            try { genre = movieData["genres"].toString(); }
            catch (e) { genre = notAvailableText; }

            try { director = movieData["directors_summary"][0]["name"]["name"]; }
            catch (e) { director = notAvailableText; }

            try { plot = movieData["plot"]["outline"]; }
            catch (e) { plot = notAvailableText; }


            // TODO: This is not a good place to set attributes
            // Set attributes
            $("#title", ".movie_property").text(movieData["title"] || notAvailableText);
            $("#year", ".movie_property").text(movieData["year"] || notAvailableText);
            $("#runtime", ".movie_property").text(runtime);
            $("#genre", ".movie_property").text(genre);
            $("#director", ".movie_property").text(director);
            $("#rating", ".movie_property").text(movieData["rating"] || notAvailableText);
            $("#votes", ".movie_property").text(movieData["num_votes"] || notAvailableText);
            $("#movie_plot").text(plot);
            var movieImage = $("#movie_image", ".movie_image_container");

            // Set the image
            this.setImageSrc(movieImage, movieData["tconst"], 95, 0);

            // Set titles
            $("#title, #genre, #director", ".movie_property").attr("title", function () {
                return $(this).text();
            });
        }
    }
})();