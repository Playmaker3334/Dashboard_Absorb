// NavBar.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import api from '../services/api';

const NavBar = ({ onSelectSimulator, onSelectCourse }) => {
  const [activeTab, setActiveTab] = useState('simulators');
  const [simulators, setSimulators] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar datos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Cargar simuladores
        const simulatorsResponse = await api.getSimulators();
        if (simulatorsResponse.success) {
          setSimulators(simulatorsResponse.data.courses || []);
        }
        
        // Cargar cursos
        const coursesResponse = await api.getCourses();
        if (coursesResponse.success) {
          setCourses(coursesResponse.data.courses || []);
        }
      } catch (error) {
        setError('Error al cargar datos');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Cambiar de tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Función para truncar texto largo
  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  return (
    <div className="nav-component">
      <style>{`
        /* Estilos encapsulados para NavBar */
        .nav-component {
          width: 100%;
          background-color: var(--content-bg);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-color);
        }
        
        .nav-brand {
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--primary-color);
          margin: 0;
        }
        
        .nav-tabs {
          display: flex;
          gap: 2rem;
        }
        
        .nav-tab {
          font-size: 1rem;
          font-weight: 500;
          padding: 0.5rem 0;
          color: var(--text-color);
          position: relative;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .nav-tab.active {
          color: var(--accent-color);
        }
        
        .nav-tab::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--accent-color);
          transition: width 0.3s;
        }
        
        .nav-tab.active::after {
          width: 100%;
        }
        
        .nav-content {
          padding: 2rem 0;
        }
        
        .nav-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .nav-subtitle {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .item-card {
          background-color: var(--card-bg);
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.2s;
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 100px;
          max-height: 160px;
          overflow: hidden;
        }
        
        .item-card:hover {
          background-color: var(--border-color);
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        
        .item-title {
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--primary-color);
          line-height: 1.3;
          /* Truncar título largo */
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .item-description {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 0;
          /* Truncar descripción larga */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }
        
        .loading-text {
          margin-left: 1rem;
          color: #666;
        }
        
        /* Añadimos una categoría en la esquina superior derecha de las tarjetas */
        .item-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background-color: var(--accent-color);
          color: white;
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          opacity: 0.8;
        }
        
        /* Media queries */
        @media (max-width: 992px) {
          .items-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          }
        }
        
        @media (max-width: 768px) {
          .nav-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .nav-tabs {
            margin-top: 1rem;
            width: 100%;
            justify-content: space-between;
          }
          
          .items-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
          
          .item-title {
            font-size: 0.9rem;
          }
        }
      `}</style>
      
      <Container>
        <div className="nav-header">
          <h1 className="nav-brand">Absorb Dashboard</h1>
          <div className="nav-tabs">
            <div 
              className={`nav-tab ${activeTab === 'simulators' ? 'active' : ''}`}
              onClick={() => handleTabChange('simulators')}
            >
              Simuladores
            </div>
            <div 
              className={`nav-tab ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => handleTabChange('courses')}
            >
              Cursos
            </div>
          </div>
        </div>
        
        <div className="nav-content">
          <h2 className="nav-title">{activeTab === 'simulators' ? 'Simuladores' : 'Cursos'}</h2>
          <p className="nav-subtitle">
            Selecciona un {activeTab === 'simulators' ? 'simulador' : 'curso'} para ver sus usuarios
          </p>
          
          {loading ? (
            <div className="loading-container">
              <Spinner animation="border" variant="primary" />
              <span className="loading-text">
                Cargando {activeTab === 'simulators' ? 'simuladores' : 'cursos'}...
              </span>
            </div>
          ) : (
            <div className="items-grid">
              {(activeTab === 'simulators' ? simulators : courses).map(item => (
                <div 
                  key={item.id} 
                  className="item-card"
                  onClick={() => activeTab === 'simulators' 
                    ? onSelectSimulator(item.id) 
                    : onSelectCourse(item.id)
                  }
                >
                  <h4 className="item-title">{item.name}</h4>
                  {item.description && (
                    <p className="item-description">{item.description}</p>
                  )}
                </div>
              ))}
              
              {(activeTab === 'simulators' ? simulators.length === 0 : courses.length === 0) && !loading && (
                <div className="text-center p-4">
                  No hay {activeTab === 'simulators' ? 'simuladores' : 'cursos'} disponibles
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default NavBar;