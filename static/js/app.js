let controladorSetInterval;

function createThreadArmazenarBlob() {
    controladorSetInterval = setInterval(() => gravador.backupBlob(), 10000);
}

function stopThreadArmazenarBlob() {
    clearInterval(controladorSetInterval);
}

$("#btn-iniciar").on("click", function() {   
    $("#estado-gravacao").prop("hidden", false);

    $("#estado-gravacao").addClass("gravando");

    gravador.iniciar();

    createThreadArmazenarBlob();

    cronometro.iniciar();

    $("#btn-pausar").prop("disabled", false);

    $("#btn-salvar").prop("disabled", false);

    $(this).remove();
})

$("#btn-pausar").on("click", function() {
    if(gravador.isGravando()) {
        cronometro.pausar();

        gravador.pausar();

        stopThreadArmazenarBlob()

		$(this).html(`<i class="bi bi-play-fill"></i> Retornar ('F6', '*')`);

        $(this).removeClass("btn-primary");

        $(this).addClass("btn btn-success");

        $("#estado-gravacao").removeClass("gravando");

        $("#estado-gravacao").addClass("pausado");

    } else {
        gravador.continuar();
		
		cronometro.iniciar();

        createThreadArmazenarBlob();

        $(this).html(`<i class="bi bi-pause-fill"></i> Pausar ('F6', '*')`);

        $(this).removeClass("btn-success");
        
        $(this).addClass("btn btn-primary");
        
        $("#estado-gravacao").removeClass("pausado");

        $("#estado-gravacao").addClass("gravando");
    }
})

$("#btn-salvar").on("click", function() {
    cronometro.parar();
	
	gravador.finalizar();

    stopThreadArmazenarBlob();
			
    $("#btn-pausar").remove();
	
	$(this).remove();
        
    $("#estado-gravacao").remove();
	
	$("#btn-voltar").prop("hidden", false);
})

$("#btn-voltar").on("click", function() {
    location.reload();
})