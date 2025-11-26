"use client";
import { useEffect, useState } from "react";
import { api } from "./src/services/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    clients: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    const tenantId = localStorage.getItem('controlcar_tenant_id');
    
    if (!tenantId) {
      router.push('/login');
      return; 
    }
    // ----------------------------------

    async function loadData() {
      try {
        const response = await api.get('/api/dashboard');
        setStats({
            clients: response.data.totalClients || 0,
            orders: response.data.totalOS || 0,
            revenue: response.data.revenue || 0
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
        } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-xl animate-pulse">Carregando sistema...</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">Clientes Cadastrados</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.clients}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">OS em Aberto</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.orders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-medium">Faturamento (Mês)</h3>
          <p className="text-3xl font-bold text-gray-900">R$ {stats.revenue}</p>
        </div>
      </div>
    </div>
  );
}