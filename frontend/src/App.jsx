import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import NavBar from './components/NavBar';
import UserTable from './components/UserTable';
import Pagination from './components/Pagination';
import api from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [allUsers, setAllUsers] = useState([]); // Todos los usuarios
  const [displayedUsers, setDisplayedUsers] = useState([]); // Usuarios mostrados en la página actual
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const [selectedEntityType, setSelectedEntityType] = useState(null);
  const [selectedEntityName, setSelectedEntityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Definimos el número de usuarios por página
  const itemsPerPage = 6;
  
  // Función para obtener todos los usuarios
  const fetchAllUsers = async (entityId, entityType) => {
    if (!entityId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (entityType === 'simulator') {
        // Solicitamos un límite grande para obtener todos los usuarios
        response = await api.getSimulatorUsers(entityId, 1, 100);
      } else {
        response = await api.getCourseUsers(entityId, 1, 100);
      }
      
      if (response.success) {
        // Guardamos todos los usuarios
        setAllUsers(response.data.users);
        
        // Establecemos el nombre de la entidad
        if (entityType === 'simulator') {
          setSelectedEntityName(response.data.simulatorName);
        } else {
          setSelectedEntityName(response.data.courseName);
        }
        
        // Reseteamos a la primera página
        setCurrentPage(1);
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
  
  // Efecto para paginar localmente los usuarios
  useEffect(() => {
    // Cálculos para la paginación local
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Obtener los usuarios para la página actual
    const usersForCurrentPage = allUsers.slice(startIndex, endIndex);
    setDisplayedUsers(usersForCurrentPage);
    
  }, [allUsers, currentPage, itemsPerPage]);
  
  const handleSelectSimulator = (simulatorId) => {
    setSelectedEntityId(simulatorId);
    setSelectedEntityType('simulator');
    fetchAllUsers(simulatorId, 'simulator');
  };
  
  const handleSelectCourse = (courseId) => {
    setSelectedEntityId(courseId);
    setSelectedEntityType('course');
    fetchAllUsers(courseId, 'course');
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Crear objeto de paginación para pasarlo al componente Pagination
  const createPaginationObject = () => {
    const totalPages = Math.ceil(allUsers.length / itemsPerPage);
    
    return {
      page: currentPage,
      totalPages: totalPages,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < totalPages ? currentPage + 1 : null
    };
  };
  
  return (
    <>
      <NavBar 
        onSelectSimulator={handleSelectSimulator}
        onSelectCourse={handleSelectCourse}
      />
      
      <Container fluid className="py-4">
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
              <div className="content-section">
                <h2 className="section-title">
                  Usuarios de {selectedEntityType === 'simulator' ? 'Simulador' : 'Curso'}: {selectedEntityName}
                </h2>
                
                {loading ? (
                  <div className="text-center my-4">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                    <p className="mt-2">Cargando usuarios...</p>
                  </div>
                ) : (
                  <>
                    <UserTable users={displayedUsers} />
                    
                    {allUsers.length > itemsPerPage && (
                      <Pagination
                        pagination={createPaginationObject()}
                        onPageChange={handlePageChange}
                      />
                    )}
                    
                    {allUsers.length === 0 && !loading && (
                      <Alert variant="info">
                        No hay usuarios inscritos en este {selectedEntityType === 'simulator' ? 'simulador' : 'curso'}.
                      </Alert>
                    )}
                  </>
                )}
              </div>
            </Col>
          </Row>
        )}
        
        <div className="footer">
          <p>© 2025 Absorb Dashboard</p>
        </div>
      </Container>
    </>
  );
}

export default App;