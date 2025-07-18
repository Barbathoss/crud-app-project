import { useState } from 'react';
import { Edit, Trash2, Check, Clock, AlertCircle, Calendar } from 'lucide-react';
import { taskService } from '../services/api';

const TaskCard = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    status: task.status,
    due_date: task.due_date || ''
  });

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      in_progress: <AlertCircle className="w-4 h-4" />,
      completed: <Check className="w-4 h-4" />
    };
    return icons[status] || icons.pending;
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await taskService.updateTaskStatus(task.id, newStatus);
      onTaskUpdated && onTaskUpdated();
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      setLoading(true);
      try {
        await taskService.updateTask(task.id, editData);
        onTaskUpdated && onTaskUpdated();
        setIsEditing(false);
      } catch (err) {
        console.error('Error updating task:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      setLoading(true);
      try {
        await taskService.deleteTask(task.id);
        onTaskDeleted && onTaskDeleted();
      } catch (err) {
        console.error('Error deleting task:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Título */}
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleChange}
              className="w-full text-lg font-semibold border border-gray-300 rounded px-2 py-1 mb-2"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {task.title}
            </h3>
          )}

          {/* Descripción */}
          {isEditing ? (
            <textarea
              name="description"
              value={editData.description}
              onChange={handleChange}
              rows="2"
              className="w-full text-gray-600 border border-gray-300 rounded px-2 py-1 mb-3"
              placeholder="Descripción..."
            />
          ) : (
            task.description && (
              <p className="text-gray-600 mb-3">{task.description}</p>
            )
          )}

          {/* Badges y metadatos */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Prioridad */}
            {isEditing ? (
              <select
                name="priority"
                value={editData.priority}
                onChange={handleChange}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            ) : (
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                {task.priority_display}
              </span>
            )}

            {/* Estado */}
            {isEditing ? (
              <select
                name="status"
                value={editData.status}
                onChange={handleChange}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completada</option>
              </select>
            ) : (
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(task.status)}`}>
                {getStatusIcon(task.status)}
                <span>{task.status_display}</span>
              </span>
            )}

            {/* Fecha límite */}
            {(task.due_date || isEditing) && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {isEditing ? (
                  <input
                    type="date"
                    name="due_date"
                    value={editData.due_date}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-1 py-0.5 text-xs"
                  />
                ) : (
                  <span>{formatDate(task.due_date)}</span>
                )}
              </div>
            )}
          </div>

          {/* Fechas de creación y actualización */}
          <div className="text-xs text-gray-400">
            Creada: {formatDate(task.created_at)}
            {task.completed_at && (
              <span className="ml-4">
                Completada: {formatDate(task.completed_at)}
              </span>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center space-x-2 ml-4">
          {!isEditing && (
            <div className="flex space-x-1">
              {task.status !== 'completed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={loading}
                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                  title="Marcar como completada"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleEdit}
            disabled={loading}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
            title={isEditing ? "Guardar cambios" : "Editar tarea"}
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title="Eliminar tarea"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-3 flex space-x-2">
          <button
            onClick={handleEdit}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;