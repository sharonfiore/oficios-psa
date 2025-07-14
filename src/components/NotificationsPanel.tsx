import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Clock, X } from 'lucide-react';

interface Notification {
  id: number;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  time: string;
  local?: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, setNotifications }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notificaciones</h2>
          <p className="text-gray-600">Mantente al día con los seguimientos y recordatorios</p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Marcar todas como leídas</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay notificaciones</h3>
            <p className="text-gray-600">Todas las notificaciones aparecerán aquí</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className={`rounded-lg border p-4 ${getBackgroundColor(notification.type)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                    {notification.local && (
                      <p className="text-xs text-gray-600 mt-1">Local: {notification.local}</p>
                    )}
                    <div className="flex items-center space-x-1 mt-2">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">Hace {notification.time}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Notificaciones</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Recordatorios de seguimiento</label>
              <p className="text-xs text-gray-600">Notificaciones cuando se acerque una fecha de seguimiento</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Nuevos registros</label>
              <p className="text-xs text-gray-600">Notificaciones cuando se registren nuevos locales</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Oficios completados</label>
              <p className="text-xs text-gray-600">Notificaciones cuando se complete un oficio</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;