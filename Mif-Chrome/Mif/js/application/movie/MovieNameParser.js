Manager.movieNameParser = (function() {

    /**
     * Irrelevant words before the name
     * @type {string[]}
     */
    var PossibleIrrelevantWordsBeforeMovieName = [
        "oneclickmoviez","com","refined","santi","psig","www"
    ];

    /**
     * Irrelevant words after the name
     * @type {string[]}
     */
    var PossibleIrrelevantWordsAfterMovieName = [
        "tr","en","dual","bdrip","brrip","hdcam","ts","dvdrip","xvid","hd","hdtv","hdrip","720p","1080p","absurdity","cocain","bow","webrip","margin","sparks","vip3r"
    ];

    /**
     * [A-Z][a-z]+ = Match uppercase and then lowercase
     * (?<=\D)\d(?=\D) = Match only one digit
     * @type {RegExp}
     */
    var TitledRegex = /[A-Z][a-z]+|\d{1}(?=\D)/g;

    /**
     * Match four digit (year) number if the string is not starting with it
     * @type {RegExp}
     */
    var YearRegex = /(.+?)?\d{4}.*/g;

    /**
     * \W = Match everything but not letter
     * [Ss]\d\d[Ee]\d\d.* = Match tv-show episode numbers for example s01e01 or S01E01
     * @type {RegExp}
     */
    var SplitRegex = /\W|[Ss]\d\d[Ee]\d\d.*/;


    return {
        /**
         * Parses the given movie name
         * @param movieName
         * @returns {string}
         */
        parseMovieName: function (movieName) {

            // Drop irrelevant words from the movie name
            movieName = Manager.movieNameParser.dropIrrelevantWords(movieName);

            /*
             * Add whitespace after every upper cased word to separate the words.
             * For example "ManOfSteel" becomes "Man Of Steel" after the split operation.
             */
            movieName = movieName.replace(TitledRegex, function (match) {
                return match + " ";
            });

            // Remove everything after year definition
            movieName = movieName.replace(YearRegex, function ($0, $1) {
                return $1 ? $1 : $0;
            });

            // Get each words
            var words = movieName.split(SplitRegex);

            return words.join(" ").trim();
        },

        /**
         * Removes the matched irrelevant words
         * @param movieName
         * @returns {string}
         */
        dropIrrelevantWords: function (movieName) {
            // TODO: Implement the dropping of irrelevant words
            return movieName;
        }
    }
})();