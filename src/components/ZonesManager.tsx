import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit, Trash2, MapPin, Save, X, Palette } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, useMapEvents, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Zone {
  id: string;
  name: string;
  description: string;
  color: string;
  coordinates: [number, number][];
  createdAt: string;
  updatedAt: string;
}

interface DrawingControlProps {
  isDrawing: boolean;
  onPolygonComplete: (coordinates: [number, number][]) => void;
  color: string;
  currentPoints: [number, number][];
  onPointsUpdate: (points: [number, number][]) => void;
}

const DrawingControl: React.FC<DrawingControlProps> = ({ 
  isDrawing, 
  onPolygonComplete, 
  color, 
  currentPoints, 
  onPointsUpdate 
}) => {
  const map = useMap();
  const [tempPolygon, setTempPolygon] = useState<L.Polygon | null>(null);

  useMapEvents({
    click: (e) => {
      if (!isDrawing) return;
      
      const { lat, lng } = e.latlng;
      const newPoints = [...currentPoints, [lat, lng] as [number, number]];
      onPointsUpdate(newPoints);

      if (tempPolygon) {
        map.removeLayer(tempPolygon);
      }

      if (newPoints.length >= 3) {
        const polygon = L.polygon(newPoints, {
          color: color,
          fillColor: color,
          fillOpacity: 0.3,
          weight: 2,
          dashArray: '5, 5'
        }).addTo(map);
        setTempPolygon(polygon);
      }
    },
    dblclick: (e) => {
      if (!isDrawing || currentPoints.length < 3) return;
      
      e.originalEvent.preventDefault();
      onPolygonComplete(currentPoints);
      
      if (tempPolygon) {
        map.removeLayer(tempPolygon);
        setTempPolygon(null);
      }
    }
  });

  useEffect(() => {
    // Toggle map interactions based on drawing state
    if (isDrawing) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
    }

    return () => {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
    };
  }, [isDrawing, map]);

  useEffect(() => {
    if (!isDrawing && tempPolygon) {
      map.removeLayer(tempPolygon);
      setTempPolygon(null);
    }
  }, [isDrawing, tempPolygon, map]);

  return null;
};

const ZonesManager: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([
    {
      id: 'zona-1',
      name: 'Zona 1 - Centro',
      description: 'Área central de la ciudad',
      color: '#EF4444',
      coordinates: [
        [10.4696, -66.9036],
        [10.4706, -66.9026],
        [10.4686, -66.9016],
        [10.4676, -66.9026]
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 'zona-2',
      name: 'Zona 2 - Norte',
      description: 'Sector norte de la parroquia',
      color: '#10B981',
      coordinates: [
        [10.4716, -66.9046],
        [10.4726, -66.9036],
        [10.4706, -66.9026],
        [10.4696, -66.9036]
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
  const [drawnCoordinates, setDrawnCoordinates] = useState<[number, number][]>([]);
  const mapRef = useRef<L.Map | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  const predefinedColors = [
    '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4',
    '#EC4899', '#84CC16', '#F97316', '#6366F1', '#14B8A6'
  ];

  const startDrawing = () => {
    setIsDrawing(true);
    setDrawingPoints([]);
    if (!editingZone) {
      setDrawnCoordinates([]);
    }
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setDrawingPoints([]);
  };

  const handlePolygonComplete = (coordinates: [number, number][]) => {
    setDrawnCoordinates(coordinates);
    setDrawingPoints([]);
    setIsDrawing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingZone && drawnCoordinates.length < 3) {
      alert('Por favor, dibuja el área de la zona en el mapa (mínimo 3 puntos, doble clic para finalizar)');
      return;
    }

    const coordinatesToUse = editingZone && drawnCoordinates.length === 0 
      ? editingZone.coordinates 
      : drawnCoordinates;

    if (editingZone) {
      const updatedZones = zones.map(zone => 
        zone.id === editingZone.id 
          ? { 
              ...zone, 
              ...formData, 
              coordinates: coordinatesToUse,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : zone
      );
      setZones(updatedZones);
    } else {
      const newZone: Zone = {
        id: `zona-${Date.now()}`,
        ...formData,
        coordinates: drawnCoordinates,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setZones([...zones, newZone]);
    }

    resetForm();
  };

  const handleEdit = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      description: zone.description,
      color: zone.color
    });
    setDrawnCoordinates(zone.coordinates);
    setDrawingPoints([]);
    setIsDrawing(false);
    setShowForm(true);
  };

  const handleDelete = (zoneId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta zona?')) {
      setZones(zones.filter(zone => zone.id !== zoneId));
    }
  };

  const filteredZones = zones.filter(zone =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setShowForm(false);
    setEditingZone(null);
    setFormData({ name: '', description: '', color: '#3B82F6' });
    setDrawnCoordinates([]);
    setDrawingPoints([]);
    setIsDrawing(false);
  };

  // Component to update map center
  const MapUpdater = ({ coordinates }: { coordinates: [number, number][] }) => {
    const map = useMap();
    useEffect(() => {
      if (coordinates.length > 0) {
        map.fitBounds(coordinates);
      }
    }, [coordinates, map]);
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Zonas</h2>
          <p className="text-gray-600">Crea, edita y delimita las zonas de trabajo en el mapa</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Zona</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar zonas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Map */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900">Mapa de Zonas</h3>
              {isDrawing && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={cancelDrawing}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center justify-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded text-center">
                    Clic para puntos, doble clic para finalizar
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full h-64 sm:h-80 lg:h-96 rounded-lg border border-gray-300 overflow-hidden">
              <MapContainer
                center={[10.4696, -66.9036]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                whenCreated={(mapInstance) => {
                  mapRef.current = mapInstance;
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {zones.map((zone) => (
                  <Polygon
                    key={zone.id}
                    positions={zone.coordinates}
                    pathOptions={{
                      color: zone.color,
                      fillColor: zone.color,
                      fillOpacity: 0.3,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                        <p className="text-sm text-gray-600">{zone.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {zone.coordinates.length} puntos
                        </p>
                      </div>
                    </Popup>
                  </Polygon>
                ))}

                {drawnCoordinates.length >= 3 && (
                  <Polygon
                    positions={drawnCoordinates}
                    pathOptions={{
                      color: formData.color,
                      fillColor: formData.color,
                      fillOpacity: 0.3,
                      weight: 2,
                      dashArray: editingZone ? '0' : '5, 5'
                    }}
                  />
                )}

                <DrawingControl
                  isDrawing={isDrawing}
                  onPolygonComplete={handlePolygonComplete}
                  color={formData.color}
                  currentPoints={drawingPoints}
                  onPointsUpdate={setDrawingPoints}
                />
              </MapContainer>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {zones.map(zone => (
                <div key={zone.id} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: zone.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{zone.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zones List */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Zonas ({filteredZones.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredZones.map((zone) => (
                <div key={zone.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: zone.color }}
                      ></div>
                      <h4 className="font-medium text-gray-900 text-sm leading-tight">{zone.name}</h4>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{zone.description}</p>
                  
                  <div className="text-xs text-gray-500 mb-3 space-y-1">
                    <p>Creada: {zone.createdAt}</p>
                    <p>Puntos: {zone.coordinates.length}</p>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(zone)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(zone.id)}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal with Map */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Form Section */}
              <div className="p-6 space-y-4 overflow-y-auto max-h-[90vh]">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingZone ? 'Editar Zona' : 'Nueva Zona'}
                  </h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Zona *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Zona 1 - Centro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe el área que abarca esta zona..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color de la Zona
                    </label>
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">{formData.color}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({...formData, color})}
                          className={`w-8 h-8 rounded border-2 ${
                            formData.color === color ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Área de la Zona
                    </label>
                    
                    {!editingZone && !isDrawing && drawnCoordinates.length === 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-blue-800 mb-2">
                          <strong>Para dibujar el área:</strong>
                        </p>
                        <ol className="text-xs text-blue-700 space-y-1">
                          <li>1. Haz clic en "Dibujar Área"</li>
                          <li>2. Haz clic en el mapa para crear puntos</li>
                          <li>3. Doble clic para finalizar el polígono</li>
                        </ol>
                      </div>
                    )}

                    {drawnCoordinates.length > 0 && (
                      <div className="bg-green-50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-green-800">
                          ✓ Área definida con {drawnCoordinates.length} puntos
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setDrawnCoordinates([]);
                            setDrawingPoints([]);
                          }}
                          className="text-xs text-green-700 hover:text-green-900 mt-1"
                        >
                          Limpiar área
                        </button>
                      </div>
                    )}

                    {!isDrawing && (editingZone || drawnCoordinates.length === 0) && (
                      <button
                        type="button"
                        onClick={startDrawing}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{editingZone ? 'Redibujar Área' : 'Dibujar Área'}</span>
                      </button>
                    )}

                    {isDrawing && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          🖱️ Haz clic en el mapa para agregar puntos del perímetro
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Doble clic para finalizar (mínimo 3 puntos)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={!editingZone && drawnCoordinates.length < 3}
                      className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingZone ? 'Actualizar' : 'Guardar'} Zona</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>

              {/* Map Section in Modal */}
              <div className="p-4 bg-gray-50">
                <div className="w-full h-[500px] rounded-lg border border-gray-300">
                  <MapContainer
                    center={[10.4696, -66.9036]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                    whenCreated={(mapInstance) => {
                      mapRef.current = mapInstance;
                    }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {zones.map((zone) => (
                      <Polygon
                        key={zone.id}
                        positions={zone.coordinates}
                        pathOptions={{
                          color: zone.color,
                          fillColor: zone.color,
                          fillOpacity: 0.3,
                          weight: 2
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                            <p className="text-sm text-gray-600">{zone.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {zone.coordinates.length} puntos
                            </p>
                          </div>
                        </Popup>
                      </Polygon>
                    ))}

                    {drawnCoordinates.length >= 3 && (
                      <Polygon
                        positions={drawnCoordinates}
                        pathOptions={{
                          color: formData.color,
                          fillColor: formData.color,
                          fillOpacity: 0.3,
                          weight: 2,
                          dashArray: editingZone ? '0' : '5, 5'
                        }}
                      />
                    )}

                    <DrawingControl
                      isDrawing={isDrawing}
                      onPolygonComplete={handlePolygonComplete}
                      color={formData.color}
                      currentPoints={drawingPoints}
                      onPointsUpdate={setDrawingPoints}
                    />

                    <MapUpdater coordinates={drawnCoordinates} />
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZonesManager;