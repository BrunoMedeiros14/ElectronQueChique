import { app, BrowserWindow } from 'electron';
import path from 'path';
import { serviceCaixa } from "./service/ServiceCaixa";
import { serviceCliente } from './service/ServiceCliente';
import { serviceConta } from './service/ServiceConta';
import { serviceEstoque } from './service/ServiceEstoque';
import { serviceVenda } from "./service/ServiceVenda";


if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'assets', 'images', 'icon.ico'),
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    title: 'Que chique Gerenciador de estoque',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
});

app.on('ready', serviceCaixa);
app.on('ready', serviceVenda);
app.on('ready', serviceConta);
app.on('ready', serviceCliente);
app.on('ready', serviceEstoque);



// (async function name() {
//   console.log("\n\n\n\n\n\n\n\n\n")
//   const novoCliente = {
//     nome: 'João Silva',
//     dataNascimento: new Date('1980-01-01'),
//     endereco: 'Rua das Flores, 123',
//     telefone: '(11) 9999-9999',
//     email: 'joaosilva@email.com'
//   };

//   const novoClienteAtualizado = {
//     id: 1,
//     nome: 'Homem Aranha',
//     dataNascimento: new Date('1980-01-01'),
//     endereco: 'Rua das Flores, 123',
//     telefone: '(11) 9999-9999',
//     email: 'joaosilva@email.com'
//   };
//   // createCliente(novoCliente)
//   // console.log(getClienteById(1))
//   // console.log(getAllClientes())
//   // console.log(updateCliente(novoClienteAtualizado))
//   // console.log(getAllClientes())
//   // console.log(deleteCliente(1))
//   // console.log(getAllClientes())
//   // console.log(
//     // conn.prepare("SELECT * FROM clientes").all().map(e => {
//     //   const oi = e as Cliente
//     //   return oi.dataNascimento as Date

//     // })
//     // conn.prepare("INSERT INTO clientes (nome, data_nascimento, endereco, telefone, email) VALUES (?,?,?,?,?)")
//     //   .run('Bruno', new Date().toLocaleDateString(), 'Rua inhapu', '99 9 9999-9999', null)
//     )
//   console.log("\n\n\n\n\n\n\n\n\n")
// })()
// (async function name() {
//   const clientes = await buscarTodosClientes()
//   const cliente = clientes[0]

//   const estoques = await buscarTodosEstoques()
//   const estoque = estoques[0]

//   // User.create

//   console.log(cliente, estoque)

//   // criarVenda({
//   //   cliente,
//   //   estoque: [estoque],
//   //   dataVenda: new Date(),
//   //   desconto: 1,
//   //   formaPagamento: FormaPagamento.Boleto,
//   //   troco: 0,
//   //   valorPago: 1000,
//   //   valorTotal: 1000
//   // })
//   // const Categories = VendaModel.hasMany(EstoqueModel, { as: 'categories' });
//   // VendaModel.create({
//   //   troco: 0,
//   //   valorPago: 1000,
//   //   valorTotal: 1000,
//   //   dataVenda: new Date(),
//   //   desconto: 1,
//   //   formaPagamento: FormaPagamento.Boleto,
//   //   // cliente: {id: 1},
//   //   estoques: [estoque]
//   // }, {
//   //   include: [
//   //     {
//   //       association: Categories,
//   //       as: 'estoques'
//   //     }
//   //   ]
//   // })

//   const teste: ModelStatic<VendaModel> = VendaModel

//   const vendas = await teste.findAll({
//     raw: true,
//     include: {
//       association: 'cliente',
//       attributes: ['nome'],
//       // through: {
//       //   attributes: []
//       // }
//     }
//   })

//   console.log(vendas[0])


// })()

(function () {

  // const estoque = buscarEstoquePorId(1);
  // const novaVenda: Venda = {
  //   dataVenda: new Date(),
  //   valorTotal: 120.00,
  //   // cliente: { id: 1, nome: "asdf", telefone: "(99) 9 9999-9999", email: "asdf@asdf.asdf" }, // Cliente já existente na tabela
  //   formaPagamento: FormaPagamento.Cartao,
  //   valorPago: 120.00,
  //   troco: 0.00,
  //   desconto: 0.00,
  //   estoque: [estoque]
  // };

  // const {lastInsertRowid: vendaId} = criarVenda(novaVenda)
  
  // // Inserir itens da venda na tabela 'estoque_itens'
  // novaVenda.estoque.forEach(item => {
  //   inserirIdVenda(item.id, vendaId as number)
  // });
})()

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

