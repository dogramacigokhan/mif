/**
 * The movie constructor
 * @param {String} movieName
 * @constructor
 */
var Movie = function(rawMovieName)
{
    this._rawMovieName = rawMovieName;
    this._movieName = "";

    this._IMDbId = "";
    this._trailerLink = "";
    this._watchOnlineLink = "";

    this._data = {};
};

/**
 * Sets the movie data
 * @param {Object} data
 */
Movie.prototype.setData = function(data)
{
    this._data = data;
};

/**
 * Returns the movie data element
 * @param {Object} el
 * @returns {Object}
 */
Movie.prototype.getData = function(el)
{
    if (this._data) {
        return this._data[el];
    }

    return null;
};

/**
 * Returns the all data
 * @returns {Object|*}
 */
Movie.prototype.getAllData = function()
{
    return this._data;
}

/**
 * Returns the original movie name before the trim and regex-match operations
 * @returns {String}
 */
Movie.prototype.getRawMovieName = function()
{
    return this._rawMovieName;
};

/**
 * Sets the movie name
 * @param {String} movieName
 */
Movie.prototype.setMovieName = function(movieName)
{
    this._movieName = movieName;
};

/**
 * Returns the processed movie name
 * @returns {String}
 */
Movie.prototype.getMovieName = function()
{
    return this._movieName;
};

/**
 * Sets the IMDb id
 * @param {String} IMDbId
 */
Movie.prototype.setIMDbId = function(IMDbId)
{
    this._IMDbId = IMDbId;
};

/**
 * Returns the IMDb id
 * @returns {String}
 */
Movie.prototype.getIMDbId = function()
{
    return this._IMDbId;
};

/**
 * Sets the trailer link
 * @param {String} trailerLink
 */
Movie.prototype.setTrailerLink = function(trailerLink)
{
    this._trailerLink = trailerLink;
};

/**
 * Gets the trailer link
 * @returns {String}
 */
Movie.prototype.getTrailerLink = function()
{
    return this._trailerLink;
};

/**
 * Sets the watch online link
 * @param {String} trailerLink
 */
Movie.prototype.setWatchOnlineLink = function(watchOnlineLink)
{
    this._watchOnlineLink = watchOnlineLink;
};

/**
 * Gets the watch online link
 * @returns {String}
 */
Movie.prototype.getWatchOnlineLink = function()
{
    return this._watchOnlineLink;
};



