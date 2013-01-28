function ProgressBar(){
	var progress = document.getElementById('progress');
	
	this.SetProgress = function(value){
		progress.style.width = value + "%";
	};
	
	this.HideAndShowElement = function(elementToShow){
		document.getElementById('progressbar').style.display = "none";
		elementToShow.style.display = "block";
	};
}