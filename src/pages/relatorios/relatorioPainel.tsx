import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import * as XLSX from 'xlsx';
import {buscarCaixasPorData} from "../../../src-electron/repository/RepositorioCaixa";
import {buscarVendasPorData} from "../../../src-electron/repository/RepositorioVenda";
import {buscarContasPorData} from "../../../src-electron/repository/RepositorioConta";
import {buscarEstoquesPorData} from "../../../src-electron/repository/RepositorioEstoque";
import {buscarClientesPorData} from "../../../src-electron/repository/RepositorioCliente";

export function Component() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [caixas, setCaixas] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [estoques, setEstoques] = useState([]);
  const [contas, setContas] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchDados = async () => {
      const caixasData = await buscarCaixasPorData(startDate, endDate);
      const vendasData = await buscarVendasPorData(startDate, endDate);
      const estoquesData = await buscarEstoquesPorData(startDate, endDate);
      const contasData = await buscarContasPorData(startDate, endDate);
      const clientesData = await buscarClientesPorData(startDate, endDate);

      setCaixas(caixasData);
      setVendas(vendasData);
      setEstoques(estoquesData);
      setContas(contasData);
      setClientes(clientesData);
    };

    fetchDados();
  }, [startDate, endDate]);

  const emitirRelatorio = async () => {
    const data = [
      {key: 'caixas', value: caixas},
      {key: 'vendas', value: vendas},
      {key: 'estoques', value: estoques},
      {key: 'contas', value: contas},
      {key: 'clientes', value: clientes},
    ];

    const workbook = XLSX.utils.book_new();

    data.forEach((item, index) => {
      const worksheet = XLSX.utils.json_to_sheet(item.value);
      XLSX.utils.book_append_sheet(workbook, worksheet, item.key);
    });

    const wbout = XLSX.write(workbook, {bookType: 'xlsx', type: 'binary'});

    const s2ab = (s: string) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    const blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className='flex flex-1 flex-col p-4 md:p-6 max-w-[96rem] mx-auto'>
      <div className='flex items-center justify-center'>
        <h1 className='font-semibold text-lg md:text-2xl h-10'>Relatórios por Data</h1>
      </div>
      <div className='flex flex-col items-center justify-between py-3 gap-2'>
        <div className='w-full max-w-md p-2 border-2 border-blue-500 rounded-md'>
          <label className='text-blue-500'>Data de Início</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className='w-full mt-1'/>
        </div>
        <div className='w-full max-w-md p-2 border-2 border-blue-500 rounded-md mt-4'>
          <label className='text-blue-500'>Data de Fim</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className='w-full mt-1'/>
        </div>
        <Button
          onClick={emitirRelatorio} className='mt-10 h-10'>
          Emitir Relatório
        </Button>
      </div>
    </main>
  )
}
