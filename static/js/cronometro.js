"use strict";

let controladorTempo;

let spanHoras = $("#horas");
let spanMinutos = $("#minutos");
let spanSegundos = $("#segundos");

var cronometro = {
    horas: 0,
    minutos: 0,
    segundos: 0,

    iniciar: function() {
        controladorTempo = setInterval(() => this.timer(), 1000);
    },

    pausar: function() {
        clearInterval(controladorTempo);
    },

    parar: function() {
        clearInterval(controladorTempo);
	
        this.horas = 0;
        this.minutos = 0;
        this.segundos = 0;

        spanHoras.html("00");
        spanMinutos.html("00");
        spanSegundos.html("00");
    },

    timer: function() {
        this.segundos++;
        
        if(this.segundos == 60) {
            this.segundos = 0;
            this.minutos++;
        }
        
        if(this.minutos == 60) {
            this.minutos = 0;
            this.horas++;
        }
        
        spanHoras.html(this.formataTempo(this.horas));
        spanMinutos.html(this.formataTempo(this.minutos));
        spanSegundos.html(this.formataTempo(this.segundos));
    },
    
    formataTempo: function(tempo) {
        if(tempo >= 10) {
            return tempo;
        } 
        
        return `0${tempo}`;
    }
}