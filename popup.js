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
		// Convert SVGs to PNGs
		convertSVGtoPNG();
	}).catch((err) => {
		console.error("MathJax typesetting failed", err);
	});

	saveHist();
}

function convertSVGtoPNG() {
	document.querySelectorAll('.math svg').forEach(svgElement => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(svgElement);
		console.log(svgString);

		// Create an image from the SVG
		const img = new Image();
		const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(svgBlob);
		console.log(url);
		img.onload = function () {
			// Set canvas dimensions
			canvas.width = img.width;
			canvas.height = img.height;
			// Draw the SVG image on the canvas
			ctx.drawImage(img, 0, 0);

			// Convert the canvas to a PNG data URL
			const pngUrl = canvas.toDataURL('image/png');

			// Replace the SVG element with the PNG image
			const pngImg = new Image();
			pngImg.src = pngUrl;
			svgElement.parentNode.replaceChild(pngImg, svgElement);

			// Revoke the blob URL to free memory
			URL.revokeObjectURL(url);
		};
		img.src = url;
	});
}


function remove(i) {
	hist.splice(i, 1);
	update();
}