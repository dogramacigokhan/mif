/**
 * Global Manager namespace
 * @type {Object}
 */
var Manager = Manager || {};

/**
 * Only one manager instance exists, so we can use closures for encapsulation
 */
Manager.manager = (function(){

    return {

    }
})();

$(document).ready(function() {
    Manager.movieSyncManager.setRecentSearchItems();
});
