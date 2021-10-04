/* Variáveis para configurar a gravação de Áudio */
var gravar;

var btnIniciar = document.getElementById('btn-iniciar');
var btnPausar = document.getElementById('btn-pausar');
var btnSalvar = document.getElementById('btn-salvar');
var btnVoltar = document.getElementById('btn-voltar');

var gumStream;
var controladorBase64;

btnIniciar.addEventListener('click', function() {
	navigator.mediaDevices.getUserMedia({audio: true})
  		.then(function(stream) {
			let audioContext = new (window.AudioContext || window.webkitAudioContext)({
				sampleRate: 16000
			});
			
			gumStream = stream;
			
			controladorBase64 = setInterval(() => {armazenarAudio()}, 10000); // A cada 10 segundos chama a função 'armazenarAudio()'
						
			let input = audioContext.createMediaStreamSource(stream);

			gerarEspectroAudio(input);

			gravar = new Recorder(input, {numChannels: 1}),
			
			adicionarClasseGravando();
			
			gravar.record();
			
			iniciarCronometro();
			
		    btnPausar.disabled = false;
		    
		    btnSalvar.disabled = false;
		
		    btnIniciar.remove();
		    
	}).catch(() => alert("ATENÇÃO\n\nVerifique se você permitiu ou conectou o microfone e depois recarregue a página"));
});

btnPausar.addEventListener('click', function() {
	if(gravar.recording) {
		gravar.stop(); // Pausar
		
		pausarCronometro();
		
		clearInterval(controladorBase64);
		
		btnPausar.textContent = "Retornar ('F6', '*')";
		
        btnPausar.setAttribute("class", "btn btn-success btn-lg");
        
        adicionarClassePausado(); // Classe Pausado no CSS
        
	} else {
		gravar.record(); // Continuar
		
		iniciarCronometro();

        btnPausar.textContent = "Pausar ('F6', '*')";
        
        controladorBase64 = setInterval(() => {armazenarAudio()}, 10000);
        
        btnPausar.setAttribute("class", "btn btn-primary btn-lg");
        
        adicionarClasseGravando(); // Classe Gravando no CSS
	}
});

btnSalvar.addEventListener('click', function() {
	pararCronometro();
	
	gravar.stop();
	
	abrirOverlay();
	
	gumStream.getAudioTracks()[0].stop();
	
    btnPausar.remove();
	
	btnSalvar.remove();
    
    clearInterval(controladorBase64);
    
    removerDivEstadoGravacao();
	
	btnVoltar.hidden = false;
	
    gravar.exportWAV(function(blob) {
		converterBase64(blob);
	});
});

btnVoltar.addEventListener('click', function() {
	location.reload(true);
});

function armazenarAudio() {
	gravar.exportWAV(function(blob) {
		inserirOuAtualizarDados(blob); // Armazenando no IndexedDB
	});
}

document.addEventListener('keydown', function(event) {
    let codigo = event.keyCode || event.which || event.charCode;
    
    switch(true) {
        case(codigo == 111 || codigo == 116):
            $('#btn-iniciar').click(); // F5 ou NumPad '/'
        break;

        case(codigo == 106 || codigo == 117):
            $('#btn-pausar').click(); // F6 ou NumPad '*'
        break;

        case(codigo == 109 || codigo == 118):
            $('#btn-salvar').click(); // F7 ou NumPad '-'
        break;

        default:
            event.preventDefault();
        break;
    }
	
	event.preventDefault();
});
