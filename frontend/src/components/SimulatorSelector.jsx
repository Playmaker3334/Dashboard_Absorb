import React, { useState, useEffect } from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

const SimulatorSelector = ({ onSelectSimulator, onSelectCourse }) => {
  const [simulators, setSimulators] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedType, setSelectedType] = useState('simulator');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get simulators
        const simulatorsResponse = await api.getSimulators();
        if (simulatorsResponse.success) {
          setSimulators(simulatorsResponse.data.courses);
        } else {
          setError(simulatorsResponse.message || 'Error al cargar simuladores');
        }
        
        // Get all courses
        const coursesResponse = await api.getCourses();
        if (coursesResponse.success) {
          setCourses(coursesResponse.data.courses);
        } else {
          setError(coursesResponse.message || 'Error al cargar cursos');
        }
      } catch (error) {
        setError('Error de conexión al servidor');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };
  
  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      if (selectedType === 'simulator') {
        onSelectSimulator(selectedId);
      } else {
        onSelectCourse(selectedId);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando cursos y simuladores...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }
  
  return (
    <>
      <h2 className="section-title">Seleccionar curso o simulador</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Tipo</Form.Label>
          <Form.Select value={selectedType} onChange={handleTypeChange}>
            <option value="simulator">Simuladores</option>
            <option value="course">Todos los cursos</option>
          </Form.Select>
        </Form.Group>
        
        <Form.Group>
          <Form.Label>
            {selectedType === 'simulator' ? 'Seleccionar simulador' : 'Seleccionar curso'}
          </Form.Label>
          <Form.Select onChange={handleSelectChange}>
            <option value="">-- Seleccionar --</option>
            {selectedType === 'simulator' 
              ? simulators.map(simulator => (
                  <option key={simulator.id} value={simulator.id}>
                    {simulator.name}
                  </option>
                ))
              : courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))
            }
          </Form.Select>
        </Form.Group>
      </Form>
    </>
  );
};

export default SimulatorSelector;