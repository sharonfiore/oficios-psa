import React, { useState } from 'react';
import { Plus, Search, Calendar, Clock, MessageCircle, CheckCircle, XCircle, AlertCircle, Eye, Edit, Filter } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  zones: string[];
  status: string;
  avatar: string;
}

interface SeguimientoManagerProps {
  users: User[];
  currentUser: User;
}

const SeguimientoManager: React.FC<SeguimientoManagerProps> = ({ users, currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { id: 'all', name: 'Todos los Estados', color: 'gray' },
    { id: 'entregado', name: 'Entregado', color: 'blue' },
    { id: 'seguimiento', name: 'En Seguimiento', color: 'yellow' },
    { id: 'completado', name: 'Completado', color: 'green' },
    { id: 'denegado', name: 'Denegado', color: 'red' },
    { id: 'pendiente', name: 'Pendiente', color: 'orange' }
  ];

  const locales = [
    { id: 1, name: 'Panadería San José' },
    { id: 2, name: 'Farmacia Central' },
    { id: 3, name: 'Ferretería El Martillo' },
    { id: 4, name: 'Supermercado La Canasta' }
  ];

  const [seguimientos, setSeguimientos] = useState([
    {
      id: 1,
      localId: 1,
      localName: 'Panadería San José',
      oficioNumero: 'OF-2024-001',
      descripcion: 'Solicitud de apoyo para evento navideño',
      status: 'seguimiento',
      fechaEntrega: '2024-01-15',
      fechaProximoSeguimiento: '2024-01-20',
      visitas: [
        {
          id: 1,
          fecha: '2024-01-15',
          hora: '10:00',
          observaciones: 'Oficio entregado al propietario. Muy receptivo.',
          responsableId: 1,
          responsable: 'Juan Pérez',
          proximaVisita: '2024-01-20',
          horaProximaVisita: '14:00'
        }
      ]
    },
    {
      id: 2,
      localId: 2,
      localName: 'Farmacia Central',
      oficioNumero: 'OF-2024-002',
      descripcion: 'Donación de medicamentos para jornada de salud',
      status: 'completado',
      fechaEntrega: '2024-01-10',
      fechaProximoSeguimiento: null,
      visitas: [
        {
          id: 1,
          fecha: '2024-01-10',
          hora: '09:30',
          observaciones: 'Entregado al gerente. Solicita más información.',
          responsableId: 2,
          responsable: 'María González',
          proximaVisita: '2024-01-15',
          horaProximaVisita: '16:00'
        },
        {
          id: 2,
          fecha: '2024-01-15',
          hora: '16:00',
          observaciones: 'Donación confirmada. Entregarán medicamentos el 25/01.',
          responsableId: 2,
          responsable: 'María González',
          proximaVisita: null,
          horaProximaVisita: null
        }
      ]
    },
    {
      id: 3,
      localId: 4,
      localName: 'Supermercado La Canasta',
      oficioNumero: 'OF-2024-003',
      descripcion: 'Solicitud de alimentos para comedor comunitario',
      status: 'pendiente',
      fechaEntrega: '2024-01-18',
      fechaProximoSeguimiento: '2024-01-22',
      visitas: [
        {
          id: 1,
          fecha: '2024-01-18',
          hora: '11:00',
          observaciones: 'Propietario no estaba. Dejado con empleado.',
          responsableId: 3,
          responsable: 'Carlos Rodríguez',
          proximaVisita: '2024-01-22',
          horaProximaVisita: '10:00'
        }
      ]
    }
  ]);

  const [formData, setFormData] = useState({
    localId: '',
    oficioNumero: '',
    descripcion: '',
    fechaEntrega: '',
    observaciones: '',
    responsableId: '',
    proximaVisita: '',
    horaProximaVisita: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLocal = locales.find(l => l.id === parseInt(formData.localId));
    const selectedUser = users.find(u => u.id === parseInt(formData.responsableId));
    
    const newSeguimiento = {
      id: Date.now(),
      localId: parseInt(formData.localId),
      localName: selectedLocal?.name || '',
      oficioNumero: formData.oficioNumero,
      descripcion: formData.descripcion,
      status: 'entregado',
      fechaEntrega: formData.fechaEntrega,
      fechaProximoSeguimiento: formData.proximaVisita,
      visitas: [
        {
          id: 1,
          fecha: formData.fechaEntrega,
          hora: new Date().toTimeString().slice(0, 5),
          observaciones: formData.observaciones,
          responsableId: parseInt(formData.responsableId),
          responsable: selectedUser?.name || '',
          proximaVisita: formData.proximaVisita,
          horaProximaVisita: formData.horaProximaVisita
        }
      ]
    };

    setSeguimientos([...seguimientos, newSeguimiento]);
    setFormData({
      localId: '',
      oficioNumero: '',
      descripcion: '',
      fechaEntrega: '',
      observaciones: '',
      responsableId: '',
      proximaVisita: '',
      horaProximaVisita: ''
    });
    setShowForm(false);
  };

  const filteredSeguimientos = seguimientos.filter(seg => {
    const matchesSearch = seg.localName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seg.oficioNumero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seg.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || seg.status === selectedStatus;
    
    // Si no es admin, solo mostrar seguimientos donde el usuario está involucrado
    let matchesUser = true;
    if (currentUser.role !== 'Administrador') {
      matchesUser = seg.visitas.some(visita => visita.responsableId === currentUser.id);
    }
    
    return matchesSearch && matchesStatus && matchesUser;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'entregado':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'seguimiento':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completado':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'denegado':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pendiente':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregado':
        return 'bg-blue-100 text-blue-800';
      case 'seguimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'denegado':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seguimiento de Oficios</h2>
          <p className="text-gray-600">
            {currentUser.role === 'Administrador' 
              ? 'Gestiona todos los oficios entregados y su seguimiento'
              : 'Gestiona los seguimientos asignados a ti'
            }
          </p>
        </div>
        {currentUser.role === 'Administrador' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Seguimiento</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar seguimientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            <Filter className="w-4 h-4 mr-1" />
            {filteredSeguimientos.length} seguimientos encontrados
          </div>
        </div>
      </div>

      {/* Seguimientos List */}
      <div className="space-y-4">
        {filteredSeguimientos.map((seguimiento) => (
          <div key={seguimiento.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{seguimiento.localName}</h3>
                <p className="text-sm text-gray-600">Oficio: {seguimiento.oficioNumero}</p>
                <p className="text-sm text-gray-600">{seguimiento.descripcion}</p>
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                {getStatusIcon(seguimiento.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(seguimiento.status)}`}>
                  {statusOptions.find(s => s.id === seguimiento.status)?.name}
                </span>
              </div>
            </div>

            {/* Información del seguimiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Entregado: {seguimiento.fechaEntrega}</span>
              </div>
              {seguimiento.fechaProximoSeguimiento && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Próximo seguimiento: {seguimiento.fechaProximoSeguimiento}</span>
                </div>
              )}
            </div>

            {/* Historial de visitas */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Historial de Visitas ({seguimiento.visitas.length})
              </h4>
              <div className="space-y-3">
                {seguimiento.visitas.map((visita) => (
                  <div key={visita.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-600">
                        <strong>Fecha:</strong> {visita.fecha} - {visita.hora}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Responsable:</strong> {visita.responsable}
                      </div>
                    </div>
                    <div className="text-sm text-gray-900 mb-2">
                      <strong>Observaciones:</strong> {visita.observaciones}
                    </div>
                    {visita.proximaVisita && (
                      <div className="text-sm text-blue-600">
                        <strong>Próxima visita:</strong> {visita.proximaVisita} - {visita.horaProximaVisita}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
              <button className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                <span>Agregar Visita</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors">
                <CheckCircle className="w-4 h-4" />
                <span>Marcar Completado</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Nuevo Seguimiento</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Local *
                  </label>
                  <select
                    required
                    value={formData.localId}
                    onChange={(e) => setFormData({...formData, localId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar local</option>
                    {locales.map(local => (
                      <option key={local.id} value={local.id}>{local.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Oficio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.oficioNumero}
                    onChange={(e) => setFormData({...formData, oficioNumero: e.target.value})}
                    placeholder="OF-2024-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Oficio *
                </label>
                <textarea
                  required
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe el propósito del oficio..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Entrega *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.fechaEntrega}
                    onChange={(e) => setFormData({...formData, fechaEntrega: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsable *
                  </label>
                  <select
                    required
                    value={formData.responsableId}
                    onChange={(e) => setFormData({...formData, responsableId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar responsable</option>
                    {users.filter(user => user.status === 'Activo' && user.role !== 'Administrador').map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones de la Entrega *
                </label>
                <textarea
                  required
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="¿Cómo fue recibido el oficio? ¿Qué dijeron?"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Próxima Visita
                  </label>
                  <input
                    type="date"
                    value={formData.proximaVisita}
                    onChange={(e) => setFormData({...formData, proximaVisita: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Próxima Visita
                  </label>
                  <input
                    type="time"
                    value={formData.horaProximaVisita}
                    onChange={(e) => setFormData({...formData, horaProximaVisita: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Crear Seguimiento
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeguimientoManager;