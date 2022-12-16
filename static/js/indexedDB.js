const NOME_BANCO = 'Gravacao';
const NOME_TABELA = 'audios';

var idxDB = {
    db: undefined,

    createDB: function() {
        window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

        if(window.indexedDB) {
            const request = window.indexedDB.open(NOME_BANCO, 1);
                    
            request.onsuccess = () => {
                this.db = request.result; // Como o IndexedDB é assíncrono, temos que colocar listeners               
                this.recoveryAudio();
            }
            
            request.onerror = (event) => {
                alert(`IndexedDB error: ${event.target.errorCode}`);
            }
            
            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                
                const audio = this.db.createObjectStore(NOME_TABELA, {
                    keyPath: "id",
                    autoIncrement: true
                });
                
                audio.createIndex("blob", "blob");
                audio.createIndex("data", "data");
            }
        } else {
            alert("Seu navegador não suporta o IndexedDB!!!\n\nVocê poderá utilizar o gravador, mas, não terá o recurso de recuperção do áudio, caso, tenha algum problema!");
        }
    },

    update: function(blobGravacao) {
        let transacao = this.db.transaction([NOME_TABELA], "readwrite");
        let objectStore = transacao.objectStore(NOME_TABELA);

        objectStore.get(1).onsuccess = function(event) {
            let registroTabela = event.target.result;

            if(registroTabela == undefined) {
                const audio = {
                    blob: blobGravacao,
                    data: new Date().toLocaleDateString()
                }
                
                objectStore.add(audio); // Salvo o áudio a primeira vez
            } else {
                registroTabela.blob = blobGravacao;

                objectStore.put(registroTabela); // Atualizando o áudio 
            }
        }
    },

    recoveryAudio: function() {
        let transacao = this.db.transaction(NOME_TABELA);
        let objectStore = transacao.objectStore(NOME_TABELA);
        
        objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
                    
            if(cursor) {
                if(confirm("Se este modal apareceu é porque você não baixou ou teve um problema no computador. Desejar recuperar o áudio anterior?")) {      
                    blobToBase64(cursor.value.blob);
                } else {
                    this.deleteDB();
                    this.createDB();
                }

                cursor.continue();
            }
        }
    },

    deleteDB: function() {
        window.indexedDB.deleteDatabase(NOME_BANCO);
    }
}