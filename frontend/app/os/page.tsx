"use client";
import { useEffect, useState } from "react";
import { api } from "../src/services/api";
import { ServiceOrder } from "../src/types";

export default function OSPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  // POST /api/os
  const [formData, setFormData] = useState({ 
    clientId: "", 
    vehicleId: "", 
    description: "", 
    total: 0 
  });

  const loadOS = async () => {
    try {
      const res = await api.get('/api/os');
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadOS(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/os', formData);
      setFormData({ clientId: "", vehicleId: "", description: "", total: 0 });
      loadOS();
      alert("OS Aberta!");
    } catch (err) {
      alert("Erro ao abrir OS. Verifique os IDs.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ordens de Serviço</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          placeholder="ID do Cliente (Copie da tabela ou banco)" 
          className="border p-2 rounded text-black"
          value={formData.clientId}
          onChange={e => setFormData({...formData, clientId: e.target.value})}
          required
        />
        <input 
          placeholder="ID do Veículo" 
          className="border p-2 rounded text-black"
          value={formData.vehicleId}
          onChange={e => setFormData({...formData, vehicleId: e.target.value})}
          required
        />
        <input 
          placeholder="Descrição do Problema" 
          className="border p-2 rounded text-black md:col-span-2"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          required
        />
        <input 
          type="number"
          placeholder="Valor Total" 
          className="border p-2 rounded text-black"
          value={formData.total}
          onChange={e => setFormData({...formData, total: Number(e.target.value)})}
          required
        />
        <button type="submit" className="md:col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700 font-bold">
          Abrir Nova OS
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((os) => (
          <div key={os.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">{os.problemDescription || "Sem descrição"}</p>
              <p className="text-sm text-gray-500">ID: {os.id}</p>
            </div>
            <div className="text-right">
              <span className="block font-bold text-green-600">R$ {Number(os.totalAmount).toFixed(2)}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{os.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}