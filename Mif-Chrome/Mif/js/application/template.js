Manager.templateManager = (function() {

    return {

        getPossibleMovieTemplate: function(movieId, movieTitle, movieDescription) {
            // Strip description tags first
            var description = $("<p>").append(movieDescription).text();

            // Return the template
            var link = '<a class="ellipsis" href="javascript:void(0)" data-id="' + movieId.trim() + '">' + movieTitle.trim() + ' (' + description.trim() + ')' + '</a>';
            return $('<div class="possible_movie clearfix"><img class="movie_thumbnail" />' + this.getLoadingContainerTemplate() + link + '</div>');
        },

        getRecentSearchMovieTemplate: function(id, title, rating) {
            // Return the template
            return $('<div class="recent_search" data-id="' + id + '" title="' + title + '">' +
                        '<div class="remove_recent_search"><img alt="Remove" src="images/close_button.png" /></div>' +
                        '<img class="recent_search_img" src="images/not_available.jpg" alt="" />' +
                        '<div class="rating_recent_search"><span>' + rating + '</span></div>' +
                        this.getLoadingContainerTemplate() +
                     '</div>');
        },

        getLoadingContainerTemplate: function() {
            return '<div class="loading_image_container">' +
                       '<img class="loading_image" src="images/loading.gif" />' +
                   '</div>';
        }

    }
})();