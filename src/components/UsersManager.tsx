import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, UserCheck, Shield, User, Eye } from 'lucide-react';

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

interface UsersManagerProps {
  users: User[];
  setUsers: (users: User[]) => void;
}

const UsersManager: React.FC<UsersManagerProps> = ({ users, setUsers }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const roles = [
    { id: 'all', name: 'Todos los Roles' },
    { id: 'Coordinador', name: 'Coordinador' },
    { id: 'Voluntario', name: 'Voluntario' },
    { id: 'Supervisor', name: 'Supervisor' }
  ];

  const zones = [
    { id: 'zona-1', name: 'Zona 1 - Centro' },
    { id: 'zona-2', name: 'Zona 2 - Norte' },
    { id: 'zona-3', name: 'Zona 3 - Sur' },
    { id: 'zona-4', name: 'Zona 4 - Este' },
    { id: 'zona-5', name: 'Zona 5 - Oeste' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Voluntario',
    zones: [] as string[],
    status: 'Activo'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Editar usuario existente
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              ...formData, 
              avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
            }
          : user
      );
      setUsers(updatedUsers);
    } else {
      // Crear nuevo usuario
      const newUser: User = {
        id: Date.now(),
        ...formData,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
      };
      setUsers([...users, newUser]);
    }

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Voluntario',
      zones: [],
      status: 'Activo'
    });
    setShowForm(false);
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      zones: user.zones,
      status: user.status
    });
    setShowForm(true);
  };

  const handleDelete = (userId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleZoneChange = (zoneId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        zones: [...formData.zones, zoneId]
      });
    } else {
      setFormData({
        ...formData,
        zones: formData.zones.filter(z => z !== zoneId)
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Coordinador':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'Supervisor':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Coordinador':
        return 'bg-blue-100 text-blue-800';
      case 'Supervisor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administra los usuarios que realizan seguimientos</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              role: 'Voluntario',
              zones: [],
              status: 'Activo'
            });
            setShowForm(true);
          }}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            <UserCheck className="w-4 h-4 mr-1" />
            {filteredUsers.length} usuarios encontrados
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <div className="flex items-center space-x-1">
                    {getRoleIcon(user.role)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                user.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {user.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {user.phone}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="font-medium">Zonas asignadas:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {user.zones.map(zoneId => {
                  const zone = zones.find(z => z.id === zoneId);
                  return (
                    <span key={zoneId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {zone?.name.split(' - ')[1] || zone?.name}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
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
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol *
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roles.filter(r => r.id !== 'all').map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zonas Asignadas *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {zones.map(zone => (
                    <label key={zone.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.zones.includes(zone.id)}
                        onChange={(e) => handleZoneChange(zone.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{zone.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {editingUser ? 'Actualizar Usuario' : 'Registrar Usuario'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
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

export default UsersManager;