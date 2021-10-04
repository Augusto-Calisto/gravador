var div = document.getElementById('estado-gravacao');

function adicionarClasseGravando() {
	div.hidden = false;
	
	removerClasse('pausado');

	div.classList.add('gravando');
}

function adicionarClassePausado() {
	removerClasse('gravando');

	div.classList.add('pausado');
}

function removerClasse(classe) {
    if(div.classList.contains(classe)) {
    	div.classList.remove(classe);
	}
}

function removerDivEstadoGravacao() {
	div.remove();
}

var upload = document.getElementById("upload");

function abrirOverlay() {
	upload.classList.add('open-overlay');
}

function fecharOverlay() {
  	upload.classList.remove('open-overlay');
}
