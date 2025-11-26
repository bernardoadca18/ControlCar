"use client";
import { useEffect, useState } from "react";
import { api } from "../src/services/api";
import { ServiceOrder } from "../src/types";

export default function OSPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [formData, setFormData] = useState({ clientId: "", vehicleId: "", description: "", total: "" });

  const loadOS = async () => {
    try {
      const res = await api.get('/api/os');
      setOrders(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadOS(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/os', {
        ...formData,
        total: Number(formData.total)
      });
      setFormData({ clientId: "", vehicleId: "", description: "", total: "" });
      loadOS();
    } catch (err) {
      alert("Erro ao abrir OS. Verifique se os IDs de Cliente e Veículo existem.");
    }
  };

  const handleFinish = async (id: string) => {
    if(!confirm("Confirmar conclusão do serviço? O valor entrará no faturamento.")) return;
    try {
        await api.patch(`/api/os/${id}/finish`);
        loadOS();
    } catch (err) { alert("Erro ao finalizar."); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ordens de Serviço (O.S.)</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 border-l-4 border-green-500">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Nova Ordem de Serviço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="ID do Cliente" 
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
            <textarea 
              placeholder="Descrição do defeito / serviço a realizar" 
              className="border p-2 rounded text-black md:col-span-2 h-20"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
            <div className="md:col-span-2 flex items-center gap-4">
                <span className="font-bold text-gray-700">Valor R$:</span>
                <input 
                  type="number"
                  step={"0.01"}
                  placeholder="0.00" 
                  className="border p-2 rounded text-black flex-1"
                  value={formData.total}
                  onChange={e => setFormData({...formData, total: e.target.value})}
                  required
                />
            </div>
            <button type="submit" className="md:col-span-2 bg-green-600 text-white p-3 rounded hover:bg-green-700 font-bold shadow-lg transition-transform transform active:scale-95">
              + Abrir O.S.
            </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((os) => {
            const isFinished = os.status === 'finished';
            return (
              <div key={os.id} className={`bg-white p-5 rounded-lg shadow-md border-l-8 flex flex-col md:flex-row justify-between items-start md:items-center ${isFinished ? 'border-gray-400 opacity-75' : 'border-blue-500'}`}>
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${isFinished ? 'bg-gray-200 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>
                          {isFinished ? 'Concluído' : 'Em Aberto'}
                      </span>
                      <span className="text-xs text-gray-400">#{os.id.split('-')[0]}...</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">{os.problemDescription}</h4>
                  <p className="text-sm text-gray-500">
                      Cliente: <span className="font-medium">{os.client?.name || "N/A"}</span> | 
                      Veículo: <span className="font-medium">{os.vehicle?.model || "N/A"}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <span className="text-2xl font-bold text-gray-800">
                    R$ {Number(os.totalAmount).toFixed(2)}
                  </span>
                  {!isFinished && (
                      <button 
                        onClick={() => handleFinish(os.id)}
                        className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
                      >
                        ✅ Concluir Serviço
                      </button>
                  )}
                  {isFinished && (
                      <span className="text-sm text-green-600 font-medium">Faturado em {new Date(os.updatedAt || "").toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}