// Selection text or link
var selection = "";

// Create context menu items
var contexts = ["all"];

for (var i = 0; i < contexts.length; i++) {
	var context = contexts[i];
	var title = "Find Movie Info";
	var id = chrome.contextMenus.create({
		"title": title,
		"contexts": [context],
		"onclick": findMovieInfo
	});
}

function findMovieInfo(info, tab) {
	console.log(info);
	selection = getSelection(info);
	chrome.runtime.sendNativeMessage('com.movieinfofinder.application', {text:selection}, function(response) {
		if (response !== undefined)
		{
			console.log(response);
		}
		if (chrome.runtime.lastError !== undefined) {
			console.log(chrome.runtime.lastError);
		}
	});
};

function getSelection(info) {
	
	return info.selectionText;	

	if (typeof info.linkUrl !== "undefined") {
		return info.linkUrl;
	}
	else if (typeof info.selectionText !== "undefined") {
		return info.selectionText;
	}
}