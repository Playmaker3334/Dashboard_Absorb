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
    let variant;
    
    switch (status) {
      case 0:
        variant = 'secondary'; // Not started
        break;
      case 1:
        variant = 'primary'; // In progress
        break;
      case 2:
        variant = 'warning'; // Failed
        break;
      case 3:
        variant = 'success'; // Completed
        break;
      default:
        variant = 'info';
    }
    
    return <Badge bg={variant}>{statusText || 'Desconocido'}</Badge>;
  };
  
  return (
    <div className="table-responsive">
      <Table striped bordered hover>
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
                    className={`progress-bar ${user.progress === 100 ? 'bg-success' : ''}`}
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
  );
};

export default UserTable;