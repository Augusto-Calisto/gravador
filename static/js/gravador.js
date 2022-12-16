let gumStream;
let gravacao;
let input;

var gravador = {
    iniciar: function() {
        navigator.mediaDevices.getUserMedia({audio: true})
            .then((stream) => {
                let audioContext = new (window.AudioContext || window.webkitAudioContext);

                gumStream = stream;

                input = audioContext.createMediaStreamSource(stream);

                gerarEspectroAudio(input);

                gravacao = new Recorder(input, {numChannel: 1})

                gravacao.record();
            })
            .catch((error) => {
                alert("ATENÇÃO\n\nVerifique se você permitiu ou se conectou o microfone. Feito isso, recarregue a página");
                console.error(error);
            })
    },

    pausar: function() {
        gravacao.stop();
        input.context.suspend(); // Para o espectro não criar ondas sonoras
    },

    continuar: function() {
        gravacao.record();
        input.context.resume(); // Para o espectro continuar capturando o áudio e criar ondas sonoras
    },

    finalizar: function() {
        gravacao.stop();

        gumStream.getAudioTracks()[0].stop();

        gravacao.exportWAV(function(blob) {
            blobToBase64(blob);
        });
    },

    isGravando: function() {
        return gravacao.recording;
    },

    backupBlob: function() {
        gravacao.exportWAV(function(blob) {
            idxDB.update(blob);
        });
    },
}