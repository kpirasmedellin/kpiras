import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import useFormStore from '../../app/dashboard/store';
import ImageUpload from '../buttons/ButtonImageUpdload';
import CategorySelection, { Category } from '../buttons/selectCategoriesButton';
import SubmitAlert from '../alerts/submitAlert';
import { Product } from '@/types/Imenu';
import { Minimize2 } from 'lucide-react';
import InputAlert from '../alerts/successAlert';

// Styled components
const FormContainer = styled.div`
  padding: 1rem;
  max-width: 28rem;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  padding: 0.5rem;
  color: #111827;
  border-radius: 0.25rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: #4655c4;
  color: white;
  border-radius: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4b9fea;
  }
`;

// Interfaz Actualizada para Producto
interface ProductFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
  onProductAdded: (product: Product) => void;
  onClose: () => void;
}

// Componente Principal
const ProductForm: React.FC<ProductFormProps> = ({ setIsModalOpen, onProductAdded, onClose }) => {
  // Estado y hooks personalizados
  const { nombre, precio, costo, setNombre, setPrecio, setCosto, urlImagen, setUrlImagen } = useFormStore();
  const [category, setCategory] = useState<Category | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Resetear formulario
  const resetForm = useCallback(() => {
    setNombre('');
    setCosto(0);
    setPrecio(0);
    setUrlImagen('');
    setCategory(null);
    setErrors({});
  }, [setNombre, setCosto, setPrecio, setUrlImagen, setCategory]);

  // Efecto para resetear cuando se cierra el modal
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  // Validar formulario
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!nombre.trim()) newErrors.name = 'El nombre es requerido';
    if (precio <= 0) newErrors.price = 'El precio debe ser mayor que 0';
    if (costo <= 0) newErrors.cost = 'El costo debe ser mayor que 0';
    if (!category) newErrors.category = 'La categoría es requerida';
    if (!urlImagen.trim()) newErrors.imageURL = 'La imagen es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      // Preparar datos del producto
      const productData = {
        nombre: nombre,
        precio: precio,
        costo: costo,
        urlImagen: urlImagen,
        categoriaId: category!.id,
        estado: "ACTIVO",
      };
  
      // Enviar solicitud POST
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Resetear formulario
      resetForm();
    } catch (error) {
      await InputAlert("Error enviando el producto", "error");
    }
  };
  

  return (
    <FormContainer>
      <Title>Agregar Nuevo Producto</Title>
      <CloseButton onClick={() => setIsModalOpen(false)}>
        <Minimize2 size="1.5em" />
      </CloseButton>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="name">Nombre:</Label>
          <Input
            type="text"
            id="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            hasError={!!errors.name}
            placeholder="Ingresa el nombre del producto"
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </InputGroup>
        <InputGrid>
          <InputGroup>
            <Label htmlFor="cost">Costo:</Label>
            <Input
              type="number"
              id="cost"
              value={costo}
              onChange={(e) => setCosto(e.target.valueAsNumber)}
              hasError={!!errors.cost}
              placeholder="Ingresa el costo"
            />
            {errors.cost && <ErrorMessage>{errors.cost}</ErrorMessage>}
          </InputGroup>
          <InputGroup>
            <Label htmlFor="price">Precio:</Label>
            <Input
              type="number"
              id="price"
              value={precio}
              onChange={(e) => setPrecio(e.target.valueAsNumber)}
              hasError={!!errors.price}
              placeholder="Ingresa el precio"
            />
            {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
          </InputGroup>
        </InputGrid>
        <CategorySelection category={category} setCategory={setCategory} />
        {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
        <ImageUpload imageUrl={urlImagen} setImageUrl={setUrlImagen} />
        {errors.imageURL && <ErrorMessage>{errors.imageURL}</ErrorMessage>}
        <SubmitButton type="submit">Guardar Producto</SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default ProductForm;
