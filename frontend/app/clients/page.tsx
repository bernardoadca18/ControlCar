"use client";
import { useEffect, useState } from "react";
import { api } from "../src/services/api";
import { Client } from "../src/types";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", plate: "", model: "" });
  
  const loadClients = async () => {
    try {
      const res = await api.get('/api/clients');
      setClients(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadClients(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/clients/${editingId}`, formData);
        alert("Cliente atualizado!");
        setEditingId(null);
      } else {
        await api.post('/api/clients', formData);
        alert("Cliente salvo!");
      }
      setFormData({ name: "", phone: "", plate: "", model: "" });
      loadClients();
    } catch (err) {
      alert("Erro ao salvar operation.");
    }
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    const car = client.vehicles[0] || {};
    setFormData({
        name: client.name,
        phone: client.phone || "",
        plate: car.plate || "",
        model: car.model || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Tem certeza? Isso apagará o histórico deste cliente.")) return;
    try {
        await api.delete(`/api/clients/${id}`);
        loadClients();
    } catch(err) { alert("Erro ao deletar."); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Clientes</h2>
        {editingId && (
            <button onClick={() => { setEditingId(null); setFormData({name:"", phone:"", plate:"", model:""}); }} className="text-sm text-red-500 underline">
                Cancelar Edição
            </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className={`p-6 rounded shadow mb-8 grid grid-cols-2 gap-4 ${editingId ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white'}`}>
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
          placeholder="Placa" 
          className="border p-2 rounded text-black"
          value={formData.plate}
          onChange={e => setFormData({...formData, plate: e.target.value})}
        />
        <input 
          placeholder="Modelo" 
          className="border p-2 rounded text-black"
          value={formData.model}
          onChange={e => setFormData({...formData, model: e.target.value})}
        />
        <button type="submit" className={`col-span-2 text-white p-2 rounded font-bold ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {editingId ? "Atualizar Dados do Cliente" : "Cadastrar Novo Cliente"}
        </button>
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Veículo</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                    <div className="text-xs text-gray-400 mt-1 select-all">ID: {client.id}</div>
                </td>
                <td className="px-4 py-4">
                    {client.vehicles.map(v => (
                        <div key={v.id}>
                            <div className="font-medium text-gray-800">{v.model} <span className="text-gray-400">({v.plate})</span></div>
                            <div className="text-xs text-gray-400 mt-1 select-all">ID Veículo: {v.id}</div>
                        </div>
                    ))}
                </td>
                <td className="px-4 py-4 space-x-2">
                    <button onClick={() => handleEdit(client)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Editar</button>
                    <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}