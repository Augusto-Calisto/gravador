$(document).ready(function() {
    idxDB.createDB();
})

$(document).keydown(function(event) { 
    let codigo = event.keyCode || event.which || event.charCode;
    
    switch(true) {
        case(codigo == 111 || codigo == 116):
            $("#btn-iniciar").click(); // F5 ou NumPad '/'
        break;

        case(codigo == 106 || codigo == 117):
            $("#btn-pausar").click(); // F6 ou NumPad '*'
        break;

        case(codigo == 109 || codigo == 118):
            $("#btn-salvar").click(); // F7 ou NumPad '-'
        break;

        default:
            event.preventDefault();
        break;
    }
	
	event.preventDefault();
});