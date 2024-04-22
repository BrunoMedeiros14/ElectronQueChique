let db;

const request = indexedDB.open("queChiqueDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('contas_a_pagar')) {
        db.createObjectStore('contas_a_pagar', { keyPath: 'id', autoIncrement: true });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
};

request.onerror = function (event) {
    console.log("Erro ao abrir o banco de dados", event);
};

export function createConta(nome, descricao, data_vencimento, valor) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["conta_pagar"], "readwrite");
        const objectStore = transaction.objectStore("conta_pagar");
        const request = objectStore.add({ nome, descricao, data_vencimento, valor });

        request.onsuccess = function (event) {
            console.log("Conta a pagar adicionada com sucesso.");
            resolve(request.result);
        };

        request.onerror = function (event) {
            console.log("Erro ao adicionar conta a pagar.");
            reject(event);
        };
    });
}

function readConta(id) {
    const transaction = db.transaction(["contas_a_pagar"]);
    const objectStore = transaction.objectStore("contas_a_pagar");
    const request = objectStore.get(id);
    request.onsuccess = function (event) {
        console.log("Conta a pagar:", request.result);
    };
}

function updateConta(id, updates) {
    const transaction = db.transaction(["contas_a_pagar"], "readwrite");
    const objectStore = transaction.objectStore("contas_a_pagar");

    const getRequest = objectStore.get(id);
    getRequest.onsuccess = function (event) {
        const conta = getRequest.result;
        const updatedConta = { ...conta, ...updates };

        const putRequest = objectStore.put(updatedConta);
        putRequest.onsuccess = function (event) {
            console.log("Conta a pagar atualizada com sucesso.");
        };
    };
}

function readAll() {
    const transaction = db.transaction(["contas_a_pagar"]);
    const objectStore = transaction.objectStore("contas_a_pagar");
    const request = objectStore.getAll();
    request.onsuccess = function (event) {
        console.log("Todas as contas a pagar:", request.result);
    };
}

function deleteConta(id) {
    const transaction = db.transaction(["contas_a_pagar"], "readwrite");
    const objectStore = transaction.objectStore("contas_a_pagar");
    const request = objectStore.delete(id);
    request.onsuccess = function (event) {
        console.log("Conta a pagar deletada com sucesso.");
    };
}

function populateTable() {
    const tableBody = document.getElementById('contasPagarTable').getElementsByTagName('tbody')[0];
    readAll().then(contas => {
        contas.forEach(conta => {
            const row = tableBody.insertRow();
            row.insertCell(1).innerHTML = conta.nome;
            row.insertCell(2).innerHTML = conta.descricao;
            row.insertCell(4).innerHTML = conta.data_vencimento;
            row.insertCell(3).innerHTML = conta.data_pagamento;
            row.insertCell(5).innerHTML = conta.valor;
            row.insertCell(6).innerHTML = conta.pago;
        });
    });
}

populateTable();