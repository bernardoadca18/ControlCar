"use client";
import { useEffect, useState } from "react";
import { api } from "../src/services/api";
import { Client } from "../src/types";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({ name: "", phone: "", plate: "", model: "" });
  
  // Carregar clientes
  const loadClients = async () => {
    try {
      const res = await api.get('/api/clients');
      setClients(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadClients(); }, []);

  // Criar cliente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/clients', formData);
      setFormData({ name: "", phone: "", plate: "", model: "" }); // Limpa form
      loadClients(); // Recarrega lista
      alert("Cliente salvo!");
    } catch (err) {
      alert("Erro ao salvar");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gerenciar Clientes</h2>

      {/* Formulário Rápido */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 grid grid-cols-2 gap-4">
        <input 
          placeholder="Nome do Cliente" 
          className="border p-2 rounded text-black"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          required
        />
        <input 
          placeholder="Telefone" 
          className="border p-2 rounded text-black"
          value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
        />
        <input 
          placeholder="Placa do Veículo (Inicial)" 
          className="border p-2 rounded text-black"
          value={formData.plate}
          onChange={e => setFormData({...formData, plate: e.target.value})}
        />
        <input 
          placeholder="Modelo do Veículo" 
          className="border p-2 rounded text-black"
          value={formData.model}
          onChange={e => setFormData({...formData, model: e.target.value})}
        />
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold">
          Cadastrar Cliente
        </button>
      </form>

      {/* Lista */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID do Carro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo do Carro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{client.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.vehicles[0].id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.vehicles[0].model}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{client.vehicles[0].plate}</td>
              </tr>
            ))
            }
            
          </tbody>
        </table>
      </div>
    </div>
  );
}