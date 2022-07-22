let db;

const NOME_BANCO = 'Gravacao';
const NOME_TABELA = 'audios';

const createDB = () => {
	window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

	if(window.indexedDB) {
		const request = window.indexedDB.open(NOME_BANCO, 1);
				
		request.onsuccess = () => {
			db = request.result; // Como o IndexedDB é assíncrono, temos que colocar listeners
							
			hasAudio();
		}
		
		request.onerror = (event) => {
			alert(`IndexedDB error: ${event.target.errorCode}`);
		}
		
		request.onupgradeneeded = (event) => {
			db = event.target.result;
			
			// Object Storage: "tabela"
			const audio = db.createObjectStore(NOME_TABELA, {
				keyPath: 'id', // Primary key
				autoIncrement: true
			});
			
			audio.createIndex('binario', 'binario');

			audio.createIndex('dataAtual', 'dataAtual');

			audio.createIndex('status', 'status');
		}

	} else {
		alert('Seu navegador não suporta o IndexedDB!!!\n\nVocê poderá utilizar o gravador, mas, não terá o recurso de recuperção do áudio, caso, tenha algum problema!');
	}
}

var isInsert = true;

const inserirOuAtualizarDados = (binarioAudio) => {
	const transacao = db.transaction([NOME_TABELA], 'readwrite');
	const objeto = transacao.objectStore(NOME_TABELA);
	
	if(isInsert) {
		const audio = {
			binario: binarioAudio,
			dataAtual: new Date().toLocaleDateString(),
			status: false
		};
		
		objeto.add(audio);
		
		isInsert = false;

	} else {
		const requisicao = objeto.get(1);
		
		requisicao.onsuccess = (event) => {
			var audio = event.target.result;

			audio.binario = binarioAudio;
			
			objeto.put(audio);
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

function hasAudio() {
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
	window.indexedDB.deleteDatabase(NOME_BANCO);

	console.log('eeee');

	window.indexedDB.open(NOME_BANCO, 1);
}