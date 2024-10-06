let hist = [];


function saveHist() {
	localStorage.setItem("hist", JSON.stringify(hist));
}

function getHist() {
	const storedHist = localStorage.getItem("hist");
	return storedHist ? JSON.parse(storedHist) : [];
}

document.addEventListener('DOMContentLoaded', function () {
	hist = getHist();
	update();
});

document.addEventListener('keyup', (event) => {
	if (event.key === 'Enter') {
		submit();
	}
}, false);

function submit() {
	const latex = document.getElementById('latex');
	hist.push(latex.value);
	latex.value = "";
	update();
}

function update() {
	const imgs = document.getElementById("imgs");
	imgs.innerHTML = "";

	hist.forEach(function (data, i) {
		const imgGrp = document.createElement('div');
		imgGrp.classList.add("imgGrp");
		imgs.appendChild(imgGrp);

		const mathElement = document.createElement('div');
		mathElement.classList.add('math');
		// Wrap the LaTeX content in inline math delimiters
		mathElement.innerText = `\\(${data}\\)`;
		imgGrp.appendChild(mathElement);

		imgGrp.addEventListener('click', function () {
			console.log(data)
			document.getElementById('latex').value = data;
		});

		const del = document.createElement("i");
		del.classList.add('fa-times', 'fa', 'del');
		imgGrp.appendChild(del);
		del.addEventListener('click', function () {
			remove(i);
		});
	});

	// Ensure that the typesetting is complete before considering the rendering done
	MathJax.typesetPromise().then(() => {
		console.log("MathJax typesetting complete");
	}).catch((err) => {
		console.error("MathJax typesetting failed", err);
	});

	saveHist();
}

function remove(i) {
	hist.splice(i, 1);
	update();
}