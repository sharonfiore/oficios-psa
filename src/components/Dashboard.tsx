import React from 'react';
import { MapPin, ClipboardList, Clock, CheckCircle, AlertTriangle, Users, TrendingUp, Calendar, Bell, Map as MapIcon } from 'lucide-react';

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

interface DashboardProps {
  users: User[];
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ users, currentUser }) => {
  const stats = [
    {
      id: 1,
      title: 'Locales Registrados',
      value: '127',
      icon: MapPin,
      color: 'bg-blue-500',
      change: '+12 este mes'
    },
    {
      id: 2,
      title: 'Seguimientos Activos',
      value: '34',
      icon: ClipboardList,
      color: 'bg-red-500',
      change: '8 pendientes'
    },
    {
      id: 3,
      title: 'Oficios Entregados',
      value: '89',
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+15 esta semana'
    },
    {
      id: 4,
      title: 'Requieren Atención',
      value: '12',
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      change: 'Vencen pronto'
    }
  ];

  const activeUsers = users.filter(user => user.status === 'Activo');

  const recentActivity = [
    {
      id: 1,
      type: 'delivery',
      message: 'Oficio entregado en Panadería San José por Juan Pérez',
      time: '2 horas atrás',
      status: 'success',
      user: 'Juan Pérez'
    },
    {
      id: 2,
      type: 'follow-up',
      message: 'Seguimiento programado para Farmacia Central por María González',
      time: '4 horas atrás',
      status: 'pending',
      user: 'María González'
    },
    {
      id: 3,
      type: 'registration',
      message: 'Nuevo local registrado: Ferretería El Martillo',
      time: '1 día atrás',
      status: 'info'
    },
    {
      id: 4,
      type: 'completion',
      message: 'Oficio completado en Supermercado La Canasta por Carlos Rodríguez',
      time: '2 días atrás',
      status: 'success',
      user: 'Carlos Rodríguez'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      local: 'Panadería San José',
      task: 'Recoger documentos',
      time: '10:00 AM',
      date: 'Hoy',
      priority: 'high',
      assignedTo: 'Juan Pérez'
    },
    {
      id: 2,
      local: 'Farmacia Central',
      task: 'Seguimiento de oficio',
      time: '2:00 PM',
      date: 'Hoy',
      priority: 'medium',
      assignedTo: 'María González'
    },
    {
      id: 3,
      local: 'Tienda El Buen Precio',
      task: 'Entrega de oficio',
      time: '9:00 AM',
      date: 'Mañana',
      priority: 'low',
      assignedTo: 'Carlos Rodríguez'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido, {currentUser.name}!</h2>
            <p className="text-blue-100">
              {currentUser.role === 'Administrador' 
                ? 'Panel de administración - Gestiona todo el sistema'
                : `Panel de ${currentUser.role} - Gestiona tus seguimientos asignados`
              }
            </p>
            {currentUser.role !== 'Administrador' && (
              <p className="text-blue-200 text-sm mt-1">
                Zonas asignadas: {currentUser.zones?.length || 0}
              </p>
            )}
          </div>
          <div className="hidden md:block">
            <Users className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users Summary */}
      {currentUser.role === 'Administrador' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Equipo Activo ({activeUsers.length} usuarios)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeUsers.slice(0, 6).map((user) => (
              <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.role}</p>
                  <p className="text-xs text-blue-600">{user.zones.length} zona{user.zones.length > 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel específico para usuarios no admin */}
      {currentUser.role !== 'Administrador' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Mi Información
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Rol</p>
                <p className="text-lg text-gray-900">{currentUser.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Teléfono</p>
                <p className="text-sm text-gray-600">{currentUser.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Zonas Asignadas</p>
              <div className="space-y-1">
                {currentUser.zones?.map((zoneId: string) => (
                  <div key={zoneId} className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Zona {zoneId.split('-')[1]} - {zoneId === 'zona-1' ? 'Centro' : 
                                                     zoneId === 'zona-2' ? 'Norte' :
                                                     zoneId === 'zona-3' ? 'Sur' :
                                                     zoneId === 'zona-4' ? 'Este' : 'Oeste'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Actividad Reciente
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-red-600" />
              Tareas Programadas
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{task.local}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{task.task}</p>
                  <p className="text-xs text-gray-500 mt-1">{task.date} - {task.time}</p>
                  <p className="text-xs text-blue-600 mt-1">Asignado a: {task.assignedTo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentUser.role === 'Administrador' && (
            <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Registrar Local</span>
            </button>
          )}
          <button className="flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <ClipboardList className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Nuevo Seguimiento</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <MapIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Ver Mapa</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Marcar Completado</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;