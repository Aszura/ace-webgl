function loadFile(url, callback, errorCallback) {
	var response;
	
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
	
    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseText);
            } else { // Failed
				errorCallback();
            }
        }
    };
    request.send(null);  
}