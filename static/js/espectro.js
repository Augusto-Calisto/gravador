function gerarEspectroAudio(input) {
	const canvas = document.querySelector('#espectro');
	
	const ctx = canvas.getContext('2d');

	ctx.lineWidth = 2;

	ctx.strokeStyle = '#FF0000';

	const scope = new Oscilloscope(input);

	scope.animate(ctx);
}