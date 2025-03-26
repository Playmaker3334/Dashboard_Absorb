// CourseModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './CourseModal.css'; // Importa el nuevo archivo CSS

const CourseModal = ({ 
  show, 
  onHide, 
  title, 
  items, 
  onSelect, 
  itemType 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Mostrar 8 elementos por página (2 filas de 4)
  
  // Volver a la primera página cuando se abre el modal o cambian los elementos
  useEffect(() => {
    setCurrentPage(1);
  }, [show, items]);
  
  // Calcular total de páginas
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  // Obtener elementos de la página actual
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };
  
  // Manejar navegación de páginas
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Manejar selección de elemento
  const handleItemClick = (item) => {
    onSelect(item.id);
    onHide();
  };
  
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      className="course-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="items-grid">
          {getCurrentItems().map(item => (
            <div 
              key={item.id} 
              className="item-card"
              onClick={() => handleItemClick(item)}
            >
              <h4 className="item-title">{item.name}</h4>
              {item.description && (
                <p className="item-description">{item.description}</p>
              )}
            </div>
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="pagination-container">
            <Button 
              variant="link" 
              className="pagination-btn" 
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <span className="arrow-icon">←</span>
            </Button>
            <span className="pagination-text">
              Página {currentPage} de {totalPages}
            </span>
            <Button 
              variant="link" 
              className="pagination-btn" 
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <span className="arrow-icon">→</span>
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CourseModal;