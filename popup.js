//document.cookie = "hist=";

hist = []


function getCookie(cookiename) {
  // Get name followed by anything except a semicolon
  var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}

function saveHist() {
  document.cookie = "hist=" + encodeURIComponent(JSON.stringify(hist));

}

document.addEventListener('DOMContentLoaded', function() {
 	cookie = getCookie('hist')
 	console.log(cookie)
 	if (cookie != "") {
 		hist = JSON.parse(cookie)
 		update()
 	}
	//console.log(hist)
});

document.addEventListener('keyup', (event) => {
  const keyName = event.key;

  // As the user release the Ctrl key, the key is no longer active.
  // So event.ctrlKey is false.
  if (keyName === 'Enter') {
  	submit();
  }
}, false);


// The handler also must go in a .js file
function submit() {
  	var latex = document.getElementById('latex')
	hist.push(latex.value)
  	latex.value = "";

  	update()

}

function update() {
	var imgs = document.getElementById("imgs");
	imgs.innerHTML = "";

	hist.forEach(function (data, i){
		var imgGrp = document.createElement('div');
		imgGrp.classList.add("imgGrp");

  		imgs.appendChild(imgGrp);

		var img = new Image();
		img.src = "https://latex.codecogs.com/png.latex?%5Chuge%20" + data;
		imgGrp.addEventListener('click', function(){
			latex.value = data
		});

		var del = document.createElement("i");
		del.classList.add('fa-times');
		del.classList.add('fa');
		del.classList.add('del');
		imgGrp.appendChild(del);
		del.addEventListener('click', function(){
			remove(i)
		});

		
  		imgGrp.appendChild(img);

		/*
		var copy = document.createElement("i");
		copy.classList.add('fa-edit');
		copy.classList.add('fa');
		copy.classList.add('copy');
		imgGrp.appendChild(copy);
		copy.addEventListener('click', function(){
			img.select();
  			document.execCommand("Copy");
		});
		*/

	});
	saveHist();
}

function remove(i) {
	hist.splice(i,1);
	update()
}