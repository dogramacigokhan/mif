// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		var sprintfRegex = /\{(\d+)\}/g;
		var sprintf = function (match, number) {
		  return number in args ? args[number] : match;
		};
		return this.replace(sprintfRegex, sprintf);
	};
}

if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

if (!String.prototype.splice) {
	String.prototype.splice = function( idx, rem, s ) {
	    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
	};
}