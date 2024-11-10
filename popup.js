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

		mathElement.innerText = `\\( \\huge ${data} \\)`;
		console.log(mathElement.innerText);
		imgGrp.appendChild(mathElement);

		imgGrp.addEventListener('click', function () {
			document.getElementById('latex').value = data;
		});

		const del = document.createElement("i");
		del.classList.add('fa-times', 'fa', 'del');
		imgGrp.appendChild(del);
		del.addEventListener('click', function () {
			remove(i);
		});
	});


	MathJax.typesetPromise().then(() => {
		console.log("MathJax typesetting complete");

		mathjaxToPngs();
	}).catch((err) => {
		console.error("MathJax typesetting failed", err);
	});

	saveHist();
}

function mathjaxToPngs() {
	document.querySelectorAll('.math svg').forEach(svgElement => {
		svgToPng(svgElement).then((pngImg) => {
			const mathjax_container = svgElement.parentNode.parentElement;
			mathjax_container.innerHTML = '';
			mathjax_container.appendChild(pngImg);
		}).catch((error) => {
			console.error(error);
		});
	});
}

const scaleFactor = 2.75;

function svgToPng(svgElement) {
	return new Promise((resolve, reject) => {
		const svgData = new XMLSerializer().serializeToString(svgElement);
		const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(svgBlob);

		const img = new Image();
		img.src = url;
		img.onload = function () {
			const canvas = document.createElement('canvas');
			canvas.width = svgElement.clientWidth * scaleFactor;
			canvas.height = svgElement.clientHeight * scaleFactor;
			const ctx = canvas.getContext('2d');
			ctx.scale(scaleFactor, scaleFactor);

			ctx.drawImage(img, 0, 0, svgElement.clientWidth, svgElement.clientHeight);
			URL.revokeObjectURL(url);

			const pngUrl = canvas.toDataURL('image/png');
			const pngImg = new Image();
			pngImg.src = pngUrl;
			resolve(pngImg);
		};

		img.onerror = function () {
			URL.revokeObjectURL(url);
			reject(new Error('Failed to load SVG image.'));
		};
	});
}


function remove(i) {
	hist.splice(i, 1);
	update();
}