Manager.movieWatchManager = (function() {

    // TODO: Implement an API
    var watchOnlineSites = [
        {
            site: 'bicaps.net',
            url: 'http://www.bicaps.net/?s={0}',
            movieIndicator: '.moviefilm',
            linkIndicator: 'a',
            has: '.imdb p'
        },
        {
            site: 'unutulmazfilmler.com',
            url: 'http://unutulmazfilmler.com/arama.php?arama={0}',
            movieIndicator: '.leftflmbg_right_button',
            linkIndicator: 'a'
        }
    ];

    var onlineSiteIndex = 0;

    return {

        getWatchOnlineLink: function(movieTitle, callback) {

            if (onlineSiteIndex < watchOnlineSites.length) {

                var site = watchOnlineSites[onlineSiteIndex];
                $.get(site['url'].format(encodeURIComponent(movieTitle)), function(html) {

                    var movieIndicator = $(html).find(site['movieIndicator']);
                    movieIndicator = site.hasOwnProperty('has') ? movieIndicator.has(site['has']) : movieIndicator;

                    if (movieIndicator.length > 0) {

                        var link = $(movieIndicator).find(site['linkIndicator']);
                        if (link.length > 0) {
                            // Link is found
                            callback(link[0]['href']);
                            return;
                        }
                    }
                    onlineSiteIndex++;
                    Manager.movieWatchManager.getWatchOnlineLink(movieTitle, callback);
                });
            } else {
                onlineSiteIndex = 0;
                callback(null);
            }
        }
    }
})();
