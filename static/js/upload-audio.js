var btnDownload = document.createElement('a');
var audio = document.createElement('audio');

function converterBase64(blob) {
	/* Este método é chamado quando o btnSalvar for clicado */
	
	let link = URL.createObjectURL(blob);
	
	audio.src = link;
	
	btnDownload.textContent = 'Download';

	btnDownload.download = `audio_${new Date().toLocaleString()}.wav`;
	
	btnDownload.href = link;
	
	btnDownload.setAttribute('class', 'btn btn-info btn-sm');
		
 	audio.onloadeddata = function() {
		fecharOverlay();
		
		audio.controls = true;
		
		document.body.appendChild(audio);

		document.body.appendChild(btnDownload);
	}
}

btnDownload.addEventListener('click', function() {
	deleteDB();

	setTimeout(() => {
		this.remove();

		console.log(this);
	
		audio.remove();
	}, 2000);

	createDB();
});