import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, MapPin, Phone, Mail, Navigation, Eye } from 'lucide-react';

const LocalesManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');

  const zones = [
    { id: 'all', name: 'Todas las Zonas' },
    { id: 'zona-1', name: 'Zona 1 - Centro' },
    { id: 'zona-2', name: 'Zona 2 - Norte' },
    { id: 'zona-3', name: 'Zona 3 - Sur' },
    { id: 'zona-4', name: 'Zona 4 - Este' },
    { id: 'zona-5', name: 'Zona 5 - Oeste' }
  ];

  const [locales, setLocales] = useState([
    {
      id: 1,
      name: 'Panadería San José',
      owner: 'Carlos Mendoza',
      phone: '0414-123-4567',
      email: 'panaderia@email.com',
      address: 'Calle Principal #123',
      zone: 'zona-1',
      type: 'Panadería',
      coordinates: { lat: 10.4696, lng: -66.9036 },
      status: 'Activo',
      notes: 'Horario: 6:00 AM - 6:00 PM'
    },
    {
      id: 2,
      name: 'Farmacia Central',
      owner: 'María González',
      phone: '0424-987-6543',
      email: 'farmacia@email.com',
      address: 'Avenida Bolívar #456',
      zone: 'zona-2',
      type: 'Farmacia',
      coordinates: { lat: 10.4706, lng: -66.9046 },
      status: 'Activo',
      notes: 'Abierto 24 horas'
    },
    {
      id: 3,
      name: 'Ferretería El Martillo',
      owner: 'Juan Pérez',
      phone: '0412-555-7890',
      email: 'ferreteria@email.com',
      address: 'Calle Comercio #789',
      zone: 'zona-3',
      type: 'Ferretería',
      coordinates: { lat: 10.4686, lng: -66.9026 },
      status: 'Activo',
      notes: 'Especializada en herramientas'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    phone: '',
    email: '',
    address: '',
    zone: 'zona-1',
    type: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLocal = {
      id: Date.now(),
      ...formData,
      coordinates: { lat: 10.4696 + Math.random() * 0.01, lng: -66.9036 + Math.random() * 0.01 },
      status: 'Activo'
    };
    setLocales([...locales, newLocal]);
    setFormData({
      name: '',
      owner: '',
      phone: '',
      email: '',
      address: '',
      zone: 'zona-1',
      type: '',
      notes: ''
    });
    setShowForm(false);
  };

  const filteredLocales = locales.filter(local => {
    const matchesSearch = local.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         local.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         local.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'all' || local.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  const handleNavigate = (local: any) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${local.coordinates.lat},${local.coordinates.lng}`;
          window.open(url, '_blank');
        },
        (error) => {
          alert('No se pudo obtener la ubicación actual');
        }
      );
    } else {
      alert('Geolocalización no soportada');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Locales</h2>
          <p className="text-gray-600">Administra los locales registrados en tu zona</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Local</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar locales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {zones.map(zone => (
              <option key={zone.id} value={zone.id}>{zone.name}</option>
            ))}
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {filteredLocales.length} locales encontrados
          </div>
        </div>
      </div>

      {/* Locales Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocales.map((local) => (
          <div key={local.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{local.name}</h3>
                <p className="text-sm text-gray-600">{local.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                local.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {local.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {local.address}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {local.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {local.email}
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <strong>Propietario:</strong> {local.owner}
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <strong>Zona:</strong> {zones.find(z => z.id === local.zone)?.name}
            </div>

            {local.notes && (
              <div className="text-sm text-gray-600 mb-4">
                <strong>Notas:</strong> {local.notes}
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => handleNavigate(local)}
                className="flex-1 bg-blue-800 hover:bg-blue-900 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Navegar</span>
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
              <h3 className="text-lg font-semibold text-gray-900">Registrar Nuevo Local</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Local *
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
                    Propietario *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.owner}
                    onChange={(e) => setFormData({...formData, owner: e.target.value})}
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona *
                  </label>
                  <select
                    required
                    value={formData.zone}
                    onChange={(e) => setFormData({...formData, zone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {zones.filter(z => z.id !== 'all').map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Local *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    placeholder="Ej: Panadería, Farmacia, Ferretería"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Horarios, información adicional..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Registrar Local
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

export default LocalesManager;