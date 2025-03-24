import React, { useState } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import SimulatorSelector from './components/SimulatorSelector';
import UserTable from './components/UserTable';
import Pagination from './components/Pagination';
import api from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [selectedEntityType, setSelectedEntityType] = useState(null);
  const [selectedEntityName, setSelectedEntityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchUsers = async (entityId, entityType, page = 1) => {
    if (!entityId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (entityType === 'simulator') {
        response = await api.getSimulatorUsers(entityId, page);
      } else {
        response = await api.getCourseUsers(entityId, page);
      }
      
      if (response.success) {
        if (entityType === 'simulator') {
          setUsers(response.data.users);
          setPagination(response.data.pagination);
          setSelectedEntityName(response.data.simulatorName);
        } else {
          setUsers(response.data.users);
          setPagination(response.data.pagination);
          setSelectedEntityName(response.data.courseName);
        }
      } else {
        setError(response.message || 'Error al obtener usuarios');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectSimulator = (simulatorId) => {
    setSelectedEntityId(simulatorId);
    setSelectedEntityType('simulator');
    fetchUsers(simulatorId, 'simulator');
  };
  
  const handleSelectCourse = (courseId) => {
    setSelectedEntityId(courseId);
    setSelectedEntityType('course');
    fetchUsers(courseId, 'course');
  };
  
  const handlePageChange = (page) => {
    fetchUsers(selectedEntityId, selectedEntityType, page);
  };
  
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Dashboard de Absorb LMS</h1>
          <p className="text-center text-muted">
            Visualización de usuarios inscritos en cursos y simuladores
          </p>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={12} lg={6} className="mx-auto">
          <SimulatorSelector
            onSelectSimulator={handleSelectSimulator}
            onSelectCourse={handleSelectCourse}
          />
        </Col>
      </Row>
      
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      
      {selectedEntityId && (
        <Row>
          <Col>
            <Card>
              <Card.Header as="h5">
                Usuarios de {selectedEntityType === 'simulator' ? 'Simulador' : 'Curso'}: {selectedEntityName}
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center my-4">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                    <p className="mt-2">Cargando usuarios...</p>
                  </div>
                ) : (
                  <>
                    <UserTable users={users} />
                    
                    {pagination && (
                      <Pagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                      />
                    )}
                    
                    {users.length === 0 && !loading && (
                      <Alert variant="info">
                        No hay usuarios inscritos en este {selectedEntityType === 'simulator' ? 'simulador' : 'curso'}.
                      </Alert>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App;