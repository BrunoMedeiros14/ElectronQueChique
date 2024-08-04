<h1 align="center">
  Inventory Management - Que Chique
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/v20.13.1-green?logo=node.js&logoColor=white&label=node" alt="Node js" />
  <img src="https://img.shields.io/badge/v7.4.0-blue?logo=electron&logoColor=white&label=Electron%20Forge" alt="Electron" />
  <img src="https://img.shields.io/badge/v5.0.12-yellow?logo=vite&logoColor=white&label=Vite" alt="Gradle" />
  <img src="https://img.shields.io/badge/v18.2.0-blue?logo=react&logoColor=white&label=React" alt="React" />
  <img src="https://img.shields.io/badge/v9.6.0-white?logo=sqlite&logoColor=white&label=Better%20Sqlite" alt="Better Sqlite 3" />
  <img src="https://img.shields.io/badge/v3.4.3-blue?logo=tailwindcss&logoColor=white&label=Tailwind" alt="Tailwind" />
  <img src="https://img.shields.io/static/v1?label=Que%20Chique&message=v1.0.0&color=blue" alt="Juju Market" />
</p>

This is an inventory management and account registration system designed to facilitate the management of a business, with this prototype tailored for a bazaar. It allows users to efficiently and securely create, update, and delete accounts, customers, inventory, and cash management

[click here](./README.pt-br.md) to see the documentation in Portuguese :brazil:

## Demonstration

![Project video](assets/videos/demo.gif)

## Tecnologies

- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Electron](https://www.electronjs.org/)
- [Electron Forge](https://www.electronforge.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn](https://ui.shadcn.com/)
- [TanStack React Query](https://tanstack.com/query)
- [TanStack React Router](https://tanstack.com/router)
- [TanStack React Table](https://tanstack.com/table)
- [Better SQLite3](https://github.com/JoshuaWise/better-sqlite3)
- [Zod](https://zod.dev/)

## Application Proposal

Create a desktop application for managing accounts payable, clients, and inventory. It should include a tab for daily cash management, allowing users to record sales of inventory items, either linking or not linking the sale to the client who purchased the item. The application should display a daily cash statement and have the capability to generate an Excel report detailing the sales made, along with information on the products and registered clients.

For data persistence, SQLite3 was used with the Better SQLite3 library, and migrations included in the code are executed each time the application is opened.

The class diagram for the completed project looks like this:

```mermaid
classDiagram
    class CLIENTES {
        +INTEGER id
        +TEXT nome
        +DATE data_nascimento
        +TEXT endereco
        +TEXT telefone
        +TEXT email
    }

    class CAIXAS {
        +INTEGER id
        +DATETIME data_hora_abertura
        +DATETIME data_hora_fechamento
        +REAL valor_inicial
    }

    class CONTAS {
        +INTEGER id
        +TEXT nome
        +NUMBER valor
        +TEXT descricao
        +DATE data_vencimento
        +DATE data_pagamento
        +BOOLEAN pago
        +INTEGER caixa_id
    }

    class VENDAS {
        +INTEGER id
        +DATE data_venda
        +REAL valor_total
        +TEXT forma_pagamento
        +REAL valor_pago
        +REAL troco
        +REAL desconto
        +INTEGER cliente_id
        +INTEGER caixa_id
    }

    class ESTOQUES {
        +INTEGER id
        +TEXT nome
        +TEXT descricao
        +TEXT cor
        +TEXT tamanho
        +TEXT tecido
        +TEXT fornecedor
        +REAL valor_compra
        +REAL valor_venda
        +INTEGER venda_id
    }

    CLIENTES "1" -- "0..*" VENDAS : ""
    CAIXAS "1" -- "0..*" CONTAS : ""
    CAIXAS "1" -- "0..*" VENDAS : ""
    VENDAS "1" -- "0..*" ESTOQUES : ""
```

Since the aim of the project was not an in-depth study of authentication, a simple method was used, storing data directly in the auth.tsx file with the username admin and password admin. The tanstack react router functions and session storage were used for login validation.

## How to Run

To install and run this project locally, simply clone the Git repository:

```bash
git clone https://github.com/BrunoMedeiros14/ElectronQueChique.git
cd ElectronQueChique
```

- With the **node** in version `20.x.x` and **npm** instaled in machine, install the global `yarn` with the command `npm i -g yarn` and install the dependencies with `yarn install` and then will be possible to execute all of the commands listed bellow:

- To execute the code in dev mode:

  ```bash
  yarn start
  ```

- To package the project:

  ```bash
  yarn package
  ```

- To generate the application installer:

  ```bash
  yarn make
  ```
