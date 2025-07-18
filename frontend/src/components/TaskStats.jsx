import { useState, useEffect } from 'react';
import { BarChart3, CheckCircle, Clock, AlertCircle, Target } from 'lucide-react';
import { taskService } from '../services/api';

const TaskStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await taskService.getStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Tareas',
      value: stats.total_tasks,
      icon: <Target className="w-8 h-8" />,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pendientes',
      value: stats.by_status.pending,
      icon: <Clock className="w-8 h-8" />,
      bgColor: 'bg-gray-500',
      textColor: 'text-gray-600'
    },
    {
      title: 'En Progreso',
      value: stats.by_status.in_progress,
      icon: <AlertCircle className="w-8 h-8" />,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Completadas',
      value: stats.by_status.completed,
      icon: <CheckCircle className="w-8 h-8" />,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600'
    }
  ];

  const completionRate = stats.total_tasks > 0 
    ? Math.round((stats.by_status.completed / stats.total_tasks) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Estadísticas</h2>
      </div>

      {/* Cards de estadísticas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} text-white mb-2`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
            <div className={`text-sm ${stat.textColor}`}>
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progreso de completado</span>
          <span>{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Estadísticas por prioridad */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-red-50 rounded-lg p-3">
          <div className="text-lg font-semibold text-red-600">
            {stats.by_priority.high}
          </div>
          <div className="text-xs text-red-500">Alta Prioridad</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="text-lg font-semibold text-yellow-600">
            {stats.by_priority.medium}
          </div>
          <div className="text-xs text-yellow-500">Media Prioridad</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-lg font-semibold text-green-600">
            {stats.by_priority.low}
          </div>
          <div className="text-xs text-green-500">Baja Prioridad</div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;