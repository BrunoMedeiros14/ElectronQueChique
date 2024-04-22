import ContasPagarRepository from '../repository/contasPagarRepository.js';

const contasPagarRepository = new ContasPagarRepository();

window.cadastrarConta = function () {
    const campos = ['nome', 'descricao', 'data_vencimento', 'valor'];
    campos.forEach(campo => {
        const input = document.getElementById(campo);
        if (!input.value) {
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });

    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const data = document.getElementById('data_vencimento').value;
    const valor = document.getElementById('valor').value;

    if (nome && descricao && data && valor) {
        contasPagarRepository.createConta(nome, descricao, data, valor);
    }
};

window.addEventListener('DOMContentLoaded', (event) => {
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar').innerHTML = data;
        });

    document.getElementById('cadastroConta').addEventListener('click', function () {
        document.getElementById('myModal').style.display = 'block';
    });

    document.getElementById('cancelar').addEventListener('click', function () {
        document.getElementById('myModal').style.display = 'none';
    });

    document.getElementById('cadastrar').addEventListener('click', cadastrarConta);
});
