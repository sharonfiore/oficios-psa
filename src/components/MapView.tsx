import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Filter, Eye, Plus } from 'lucide-react';

interface MapViewProps {
  currentUser: any;
}

const MapView: React.FC<MapViewProps> = ({ currentUser }) => {
  const [selectedZone, setSelectedZone] = useState('all');
  const [mapCenter, setMapCenter] = useState({ lat: 10.4696, lng: -66.9036 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const zones = [
    { id: 'all', name: 'Todas las Zonas', color: '#3B82F6' },
    { id: 'zona-1', name: 'Zona 1 - Centro', color: '#EF4444' },
    { id: 'zona-2', name: 'Zona 2 - Norte', color: '#10B981' },
    { id: 'zona-3', name: 'Zona 3 - Sur', color: '#F59E0B' },
    { id: 'zona-4', name: 'Zona 4 - Este', color: '#8B5CF6' },
    { id: 'zona-5', name: 'Zona 5 - Oeste', color: '#06B6D4' }
  ];

  // Filtrar zonas según el usuario
  const getAvailableZones = () => {
    if (currentUser?.role === 'Administrador') {
      return zones; // Admin ve todas las zonas
    } else {
      // Usuario normal solo ve sus zonas asignadas
      const userZones = zones.filter(zone => 
        zone.id === 'all' || currentUser?.zones?.includes(zone.id)
      );
      return userZones;
    }
  };

  const availableZones = getAvailableZones();

  // Si el usuario no es admin y solo tiene una zona, seleccionarla automáticamente
  useEffect(() => {
    if (currentUser?.role !== 'Administrador' && currentUser?.zones?.length === 1) {
      setSelectedZone(currentUser.zones[0]);
    }
  }, [currentUser]);

  const locales = [
    {
      id: 1,
      name: 'Panadería San José',
      address: 'Calle Principal #123',
      zone: 'zona-1',
      type: 'Panadería',
      coordinates: { lat: 10.4696, lng: -66.9036 },
      status: 'Activo',
      pendingSeguimientos: 2
    },
    {
      id: 2,
      name: 'Farmacia Central',
      address: 'Avenida Bolívar #456',
      zone: 'zona-2',
      type: 'Farmacia',
      coordinates: { lat: 10.4706, lng: -66.9046 },
      status: 'Activo',
      pendingSeguimientos: 1
    },
    {
      id: 3,
      name: 'Ferretería El Martillo',
      address: 'Calle Comercio #789',
      zone: 'zona-3',
      type: 'Ferretería',
      coordinates: { lat: 10.4686, lng: -66.9026 },
      status: 'Activo',
      pendingSeguimientos: 0
    },
    {
      id: 4,
      name: 'Supermercado La Canasta',
      address: 'Avenida Principal #321',
      zone: 'zona-4',
      type: 'Supermercado',
      coordinates: { lat: 10.4716, lng: -66.9016 },
      status: 'Activo',
      pendingSeguimientos: 3
    },
    {
      id: 5,
      name: 'Librería El Saber',
      address: 'Calle Estudiante #654',
      zone: 'zona-5',
      type: 'Librería',
      coordinates: { lat: 10.4676, lng: -66.9056 },
      status: 'Activo',
      pendingSeguimientos: 1
    }
  ];

  useEffect(() => {
    // Obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error obteniendo ubicación:', error);
        }
      );
    }
  }, []);

  // Filtrar locales según zona seleccionada y permisos del usuario
  const getFilteredLocales = () => {
    let filtered = locales;
    
    // Si no es admin, solo mostrar locales de sus zonas
    if (currentUser?.role !== 'Administrador') {
      filtered = locales.filter(local => currentUser?.zones?.includes(local.zone));
    }
    
    // Aplicar filtro de zona seleccionada
    if (selectedZone !== 'all') {
      filtered = filtered.filter(local => local.zone === selectedZone);
    }
    
    return filtered;
  };

  const filteredLocales = getFilteredLocales();

  const handleNavigate = (local: any) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${local.coordinates.lat},${local.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      alert('No se pudo obtener tu ubicación actual');
    }
  };

  const getZoneColor = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.color : '#3B82F6';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mapa de Locales</h2>
          <p className="text-gray-600">
            {currentUser?.role === 'Administrador' 
              ? 'Visualiza todos los locales por zonas y navega hasta ellos'
              : `Visualiza los locales de tus zonas asignadas (${currentUser?.zones?.length || 0} zona${currentUser?.zones?.length > 1 ? 's' : ''})`
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {currentUser?.role !== 'Administrador' && (
            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Mis zonas: {currentUser?.zones?.map((zoneId: string) => 
                zones.find(z => z.id === zoneId)?.name.split(' - ')[1] || zoneId
              ).join(', ')}
            </div>
          )}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableZones.map(zone => (
              <option key={zone.id} value={zone.id}>{zone.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa Simulado */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-lg p-4 h-96 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                {/* Simulación de mapa */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full bg-gradient-to-r from-blue-200 via-green-200 to-yellow-200"></div>
                </div>
                
                {/* Marcadores de locales */}
                {filteredLocales.map((local, index) => (
                  <div
                    key={local.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: `${20 + (index * 15)}%`,
                      top: `${30 + (index * 10)}%`
                    }}
                    onClick={() => handleNavigate(local)}
                  >
                    <div className="relative">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: getZoneColor(local.zone) }}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      
                      {/* Badge de seguimientos pendientes */}
                      {local.pendingSeguimientos > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {local.pendingSeguimientos}
                        </div>
                      )}
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                          <div className="font-semibold">{local.name}</div>
                          <div className="text-gray-300">{local.address}</div>
                          <div className="text-blue-300">Click para navegar</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Ubicación del usuario */}
                {userLocation && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-lg border-2 border-white"></div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 font-semibold">
                      Tu ubicación
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Leyenda */}
            <div className="mt-4 flex flex-wrap gap-4">
              {zones.filter(z => z.id !== 'all').map(zone => (
                <div key={zone.id} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: zone.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{zone.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de locales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Locales en {availableZones.find(z => z.id === selectedZone)?.name}
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredLocales.map((local) => (
                <div key={local.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{local.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{local.type}</p>
                      <p className="text-xs text-gray-500 mt-1">{local.address}</p>
                      
                      {local.pendingSeguimientos > 0 && (
                        <div className="mt-2 flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-xs text-red-600">
                            {local.pendingSeguimientos} seguimiento{local.pendingSeguimientos > 1 ? 's' : ''} pendiente{local.pendingSeguimientos > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleNavigate(local)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Navegar"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas por zona */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableZones.filter(z => z.id !== 'all').map(zone => {
          const zoneLocales = locales.filter(l => l.zone === zone.id);
          const totalSeguimientos = zoneLocales.reduce((sum, local) => sum + local.pendingSeguimientos, 0);
          
          return (
            <div key={zone.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
                  <p className="text-sm text-gray-600">{zoneLocales.length} locales</p>
                  <p className="text-sm text-gray-600">{totalSeguimientos} seguimientos pendientes</p>
                  {currentUser?.role !== 'Administrador' && currentUser?.zones?.includes(zone.id) && (
                    <p className="text-xs text-blue-600 font-medium">Tu zona asignada</p>
                  )}
                </div>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: zone.color }}
                >
                  <MapPin className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MapView;