import React from 'react';
import { Table, Badge } from 'react-bootstrap';

const UserTable = ({ users }) => {
  if (!users || users.length === 0) {
    return <p className="text-center my-4">No hay usuarios para mostrar.</p>;
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateString;
    }
  };
  
  const getStatusBadge = (status, statusText) => {
    let badgeClass;
    
    switch (status) {
      case 0:
        badgeClass = 'bg-secondary'; // Not started
        break;
      case 1:
        badgeClass = 'bg-primary'; // In progress
        break;
      case 2:
        badgeClass = 'bg-warning'; // Failed
        break;
      case 3:
        badgeClass = 'completed'; // Completed - custom class
        break;
      default:
        badgeClass = 'bg-info';
    }
    
    return <Badge className={badgeClass}>{statusText || 'Desconocido'}</Badge>;
  };
  
  return (
    <div className="table-rounded-container">
      <div className="table-responsive">
        <Table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Progreso</th>
              <th>Calificación</th>
              <th>Fecha de inicio</th>
              <th>Fecha de finalización</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userId}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td className="text-center">{getStatusBadge(user.status, user.statusText)}</td>
                <td>
                  <div className="progress">
                    <div 
                      className="progress-bar"
                      role="progressbar" 
                      style={{ width: `${user.progress}%` }}
                      aria-valuenow={user.progress} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {user.progress}%
                    </div>
                  </div>
                </td>
                <td className="text-center">{user.score !== null ? user.score : '-'}</td>
                <td>{formatDate(user.dateStarted)}</td>
                <td>{formatDate(user.dateCompleted)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default UserTable;