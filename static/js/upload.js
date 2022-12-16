let btnDownload = document.createElement("a");
let audio = document.createElement("audio");

function blobToBase64(blob) {
	$("#upload").addClass("open-overlay");
	
	$(audio).prop("src", URL.createObjectURL(blob));

	$(btnDownload).html(`<i class="bi bi-download"></i> Baixar áudio`);

	$(btnDownload).prop("title", "Baixe o áudio gravado agora")
	
	$(btnDownload).prop("download", `audio_${new Date().toLocaleString()}.wav`);

	$(btnDownload).prop("href", URL.createObjectURL(blob));

	$(btnDownload).addClass("btn btn-info btn-sm text-white mb-4 ml-3");
	
 	audio.onloadeddata = function() {
		$("#upload").removeClass("open-overlay");
		
		$(audio).prop("controls", true);

		$("body").append(audio); // Áudio para ouvir

		$("body").append(btnDownload); // Botão para baixar

		$("body").append($(`<p class="ml-3"> Clique no botão <b> 'Baixar áudio' </b> e aguarde alguns instantes que a página irá recarregar!!! </p>`));
	}
}

$(btnDownload).on("click", function() {
	idxDB.deleteDB();
	setTimeout(() => location.reload(), 1500);
})