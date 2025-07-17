import React, { useState } from 'react';
import { MapPin, Users, ClipboardList, Bell, Home, Plus, Map as MapIcon, Search, Filter, Calendar, Clock, MessageCircle, CheckCircle, XCircle, AlertCircle, Eye, UserCheck, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LocalesManager from './components/LocalesManager';
import MapView from './components/MapView';
import SeguimientoManager from './components/SeguimientoManager';
import NotificationsPanel from './components/NotificationsPanel';
import UsersManager from './components/UsersManager';
import LoginForm from './components/LoginForm';
import ZonesManager from './components/ZonesManager';

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'Seguimiento pendiente en Panadería San José',
      time: '2 horas',
      local: 'Panadería San José'
    },
    {
      id: 2,
      type: 'info',
      message: 'Nuevo oficio registrado para Farmacia Central',
      time: '1 día',
      local: 'Farmacia Central'
    }
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@parroquia.com',
      phone: '0414-123-4567',
      role: 'Coordinador',
      zones: ['zona-1', 'zona-2'],
      status: 'Activo',
      avatar: 'JP',
      password: '123456'
    },
    {
      id: 2,
      name: 'María González',
      email: 'maria.gonzalez@parroquia.com',
      phone: '0424-987-6543',
      role: 'Voluntario',
      zones: ['zona-3'],
      status: 'Activo',
      avatar: 'MG',
      password: '123456'
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@parroquia.com',
      phone: '0412-555-7890',
      role: 'Voluntario',
      zones: ['zona-4', 'zona-5'],
      status: 'Activo',
      avatar: 'CR',
      password: '123456'
    },
    {
      id: 999,
      name: 'Administrador',
      email: 'admin@parroquia.com',
      phone: '0414-000-0000',
      role: 'Administrador',
      zones: ['zona-1', 'zona-2', 'zona-3', 'zona-4', 'zona-5'],
      status: 'Activo',
      avatar: 'AD',
      password: 'admin123'
    }
  ]);

  // Tabs según el rol del usuario
  const getTabsForRole = (role: string) => {
    const baseTabs = [
      { id: 'dashboard', label: 'Inicio', icon: Home },
      { id: 'mapa', label: 'Mapa', icon: MapIcon },
      { id: 'seguimiento', label: 'Seguimiento', icon: ClipboardList },
      { id: 'notificaciones', label: 'Avisos', icon: Bell, badge: notifications.length }
    ];

    if (role === 'Administrador') {
      return [
        ...baseTabs.slice(0, 2), // Dashboard y Mapa
        { id: 'zonas', label: 'Zonas', icon: MapPin },
        { id: 'locales', label: 'Locales', icon: MapPin },
        ...baseTabs.slice(2), // Seguimiento y Notificaciones
        { id: 'usuarios', label: 'Usuarios', icon: UserCheck }
      ];
    }

    return baseTabs;
  };

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard users={users} currentUser={currentUser} />;
      case 'zonas':
        return currentUser?.role === 'Administrador' ? <ZonesManager /> : null;
      case 'locales':
        return currentUser?.role === 'Administrador' ? <LocalesManager /> : null;
      case 'mapa':
        return <MapView currentUser={currentUser} />;
      case 'seguimiento':
        return <SeguimientoManager users={users} currentUser={currentUser} />;
      case 'usuarios':
        return currentUser?.role === 'Administrador' ? <UsersManager users={users} setUsers={setUsers} /> : null;
      case 'notificaciones':
        return <NotificationsPanel notifications={notifications} setNotifications={setNotifications} />;
      default:
        return <Dashboard users={users} currentUser={currentUser} />;
    }
  };

  // Si no hay usuario logueado, mostrar login
  if (!currentUser) {
    return <LoginForm users={users} onLogin={handleLogin} />;
  }

  const tabs = getTabsForRole(currentUser.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Parroquia San Pedro</h1>
                <p className="text-blue-100 text-sm">Sistema de Seguimiento</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser.avatar}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-blue-200">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-800 border-b-2 border-blue-800 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Install PWA Banner */}
      <div className="fixed bottom-4 right-4 bg-blue-800 text-white p-4 rounded-lg shadow-lg max-w-sm hidden" id="pwa-banner">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <div>
            <p className="text-sm font-medium">¡Instala la App!</p>
            <p className="text-xs text-blue-100">Accede más rápido desde tu dispositivo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;