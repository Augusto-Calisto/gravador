let db;
let btnRecuperar;

const NOME_BANCO = 'Gravacao';
const NOME_TABELA = 'audios';

const createDB = () => {
	if(window.indexedDB) {
		const request = window.indexedDB.open(NOME_BANCO, 1);
				
		request.onsuccess = (event) => {
			db = request.result; // Como o IndexedDB é assíncrono, temos que colocar listeners
			
			console.log('On sucess ' + event, db);

			baixouAudio();
		}
		
		request.onerror = (event) => {
			console.log('On error ' + event);
		}
		
		request.onupgradeneeded = (event) => {
			db = event.target.result;
			
			// Object Storage: "tabela"
			const audio = db.createObjectStore(NOME_TABELA, {
				keyPath: 'id', // Primary key
				autoIncrement: true
			})
			
			// Index para obter com facilidade o valor do campo
			audio.createIndex('binario', 'binario');
			audio.createIndex('dataAtual', 'dataAtual');
			audio.createIndex('status', 'status');
			
			console.log('On upgrade ' + event); // Só é disparado quando tem uma nova versão ou quando cria-se o banco pela primeira vez
		}
	} else {
		alert('Seu navegador não suporta o IndexedDB!!!\n\nVocê poderá utilizar o gravador, mas, não terá o recurso de recuperção do áudio, caso, tenha algum problema!');
	}
}

var inseriu = true;

const inserirOuAtualizarDados = (binarioAudio) => {
	const transacao = db.transaction([NOME_TABELA], 'readwrite');
	const objeto = transacao.objectStore(NOME_TABELA);
	
	if(inseriu) {
		/* Inserindo os dados */
		const audio = {
			binario: binarioAudio,
			dataAtual: new Date().toLocaleDateString(),
			status: false
		};
		
		objeto.add(audio);
		
		transacao.oncomplete = (event) => {
			console.log('Inseriu ', event);
		}
		
		transacao.onerror = (event) => {
			console.log('Transação teve um erro ', event);
		}
		
		inseriu = false;

	} else {
		/* Atualizando os dados */
		const requisicao = objeto.get(1);
		
		requisicao.onsuccess = (event) => {
			var audio = event.target.result;
			audio.binario = binarioAudio;
			
			var atualizou = objeto.put(audio);
			
			atualizou.onsuccess = (event) => {
				console.log('Áudio atualizado com sucesso - ' + event);
			}
		}
	}
}

const recuperarDadosAudio = () => {
	let transacao = db.transaction(NOME_TABELA);
	let objeto = transacao.objectStore(NOME_TABELA);
	
	objeto.openCursor().onsuccess = (event) => {
		const cursor = event.target.result;
				
		if(cursor) {
			let binarioAudio = cursor.value.binario;
			
			abrirOverlay();
			
			converterBase64(binarioAudio);
 			
			cursor.continue();
		}
	}
}

function baixouAudio() {
	let transacao = db.transaction(NOME_TABELA);
	let objeto = transacao.objectStore(NOME_TABELA);
	
	objeto.openCursor().onsuccess = (event) => {
		const cursor = event.target.result;
				
		if(cursor) {
			let baixou = cursor.value.status;

			if(!baixou) {
				if(confirm('Se este modal apareceu é porque você não baixou ou teve um problema no computador. Desejar recuperar o áudio anterior?')) {
					recuperarDadosAudio();
				}

				deleteDB();
				createDB();
			}
		}
	}
}

const deleteDB = () => {
	var bancoDeletado = window.indexedDB.deleteDatabase(NOME_BANCO);
    					
    bancoDeletado.onsuccess = function() {
  		console.log("Banco deletado com sucesso");
	};
}

document.addEventListener('DOMContentLoaded', function() {
	createDB();
});