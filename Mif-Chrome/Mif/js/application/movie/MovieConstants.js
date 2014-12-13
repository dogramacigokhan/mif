/**
 * @type {Object}
 */
Manager.movieConstants = {};

/**
 * The IMDB URL
 * @type {string}
 */
Manager.movieConstants.IMDb_URL = "http://www.imdb.com/title/{0}";

/**
 * The IMDB API URL
 * @type {string}
 */
Manager.movieConstants.IMDb_API_URL = "http://localhost/Mif-Chrome/Mif/MifServer/index.php?fm=1";

/**
 * The IMDB image URLs
 * @type {string}
 */
Manager.movieConstants.IMDb_IMAGE_URL = "http://localhost/Mif-Chrome/Mif/MifServer/index.php?fi=1&id={0}&w={1}&h={2}";

/**
 * The subtitle API URL
 * @type {string}
 */
Manager.movieConstants.SUBTITLE_API_URL = "http://localhost/Mif-Chrome/Mif/MifServer/index.php?fs=1&t={0}";

/**
 * The youtube API URL
 * @type {string}
 */
Manager.movieConstants.YOUTUBE_API_URL = "http://gdata.youtube.com/feeds/api/videos?max-results=1&alt=json&q={0}%20trailer";

/**
 * {0} = File name
 * {1} = Year
 * {2} = Movie rating
 * @type {string}
 */
Manager.movieConstants.FILE_WITH_RATING_PATTERN = "{0} - {1} ({2})";

/**
 * The RegExp to match Imdb Id
 * @type {RegExp}
 */
Manager.movieConstants.IMDb_ID_REGEXP = /tt\d{7}/i;

/**
 * The movie history cookie name
 * @type {string}
 */
Manager.movieConstants.MOVIE_HISTORY_STORAGE_KEY = "movie_history";

/**
 * The count of the recently searched movies shown in the start page
 * @type {number}
 */
Manager.movieConstants.MAX_RECENT_SEARCHED_MOVIE_COUNT = 3;

/**
 * Maximum movie suggestion count for the popular tags
 * @type {number}
 */
Manager.movieConstants.MAX_POPULAR_MOVIE_SUGGESTION = 3;

/**
 * Maximum movie suggestion count for the relative tags
 * @type {number}
 */
Manager.movieConstants.MAX_ALTERNATIVE_MOVIE_SUGGESTION = 3;

/**
 * Request timeout in milliseconds
 * @type {number}
 */
Manager.movieConstants.REQUEST_TIMEOUT = 20000;