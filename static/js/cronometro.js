"use strict";

var horas = 0;
var minutos = 0;
var segundos = 0;

var cronometro;

var spanHoras = document.getElementById('horas');
var spanMinutos = document.getElementById('minutos');
var spanSegundos = document.getElementById('segundos');

function iniciarCronometro() {
	cronometro = setInterval(() => {timer();}, 1000);
}

function pausarCronometro() {
	clearInterval(cronometro);
}

function pararCronometro() {
	clearInterval(cronometro);
	
	horas = 0;
	minutos = 0;
	segundos = 0;

	spanHoras.innnerHTML = "00";
	spanMinutos.innerHTML = "00";
	spanSegundos.innerHTML = "00";
}

function timer() {
    segundos++;
	
	if(segundos == 60) {
		segundos = 0;
		
		minutos++;
	}
	
	if(minutos == 60) {
		minutos = 0;
		
		horas++;
	}
	
	document.getElementById('horas').innerText = formataTempo(horas);
	document.getElementById('minutos').innerText = formataTempo(minutos);
  	document.getElementById('segundos').innerText = formataTempo(segundos);
}

function formataTempo(tempo) {
	if(tempo >= 10) {
		return tempo;
	} 
	
	return '0' + tempo;
}
