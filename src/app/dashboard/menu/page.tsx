'use client';

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import ProductCard from "@/components/cards/ProductCard";
import EditProductModal from "@/components/modals/EditProductModal";
import { AlertConfirm } from "@/components/alerts/questionAlert";
import InputAlert from "@/components/alerts/successAlert";
import ProductForm from "@/components/forms/NewProductForm";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Button from "@/components/ui/dashboard/buttonmenu";
import { BiSolidFoodMenu } from "react-icons/bi";
import { Product } from "@/types/Imenu";

// Styled components
const NavBar = styled.nav`
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-weight: bold;
    font-size: 1.5em;
  }
  @media screen and (max-width: 600px) {
    flex-direction: column;
    h1 {
      margin-left: 0;
    }
    div {
      flex-direction: row;
      margin-bottom: 10px;
      gap: 10px;
      margin-right: 0;
    }
  }
`;

const Container = styled.div`
  margin: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const SearchBar = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    width: 350px;
  }
`;

const CategoryButtons = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    flex-wrap: wrap;
    overflow-x: visible;
  }
`;

const CategoryButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
  background-color: ${props => props.$active ? '#67b7f7' : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : 'black'};

  &:hover {
    opacity: 0.8;
  }
`;

// Skeleton styles
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonPulse = styled.div`
  display: inline-block;
  height: 100%;
  width: 100%;
  background-color: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 200px;
  animation: ${shimmer} 1.5s infinite linear;
`;

const ProductCardSkeleton = styled(SkeletonPulse)`
  height: 300px;
  border-radius: 8px;
`;

const ProductGridSkeleton = () => (
  <Container>
    {[...Array(8)].map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </Container>
);

// Styled components for the layout
const PageWrapper = styled.div``;

const ContentWrapper = styled.div`
  margin: 1.25rem;
  @media (min-width: 1024px) {
    margin: 2.5rem;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: relative;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 100%;
`;

const NoProductsMessage = styled.p`
  grid-column: 1 / -1;
  text-align: center;
`;
;

// Main component
export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisableMode, setIsDisableMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [categories, setCategories] = useState<string[]>(['Todas']);

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const fetchProductsAndCategories = async () => {
    setIsLoading(true);
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        fetch("/api/productos"),
        fetch("/api/categorias")
      ]);

      if (!productResponse.ok || !categoryResponse.ok) {
        throw new Error("Error fetching data");
      }

      const productData: Product[] = await productResponse.json();
      const categoryData = await categoryResponse.json();

      setProducts(productData);
      setCategories(['Todas', ...categoryData.map((cat: { nombre: string }) => cat.nombre)]);
    } catch (error) {
      InputAlert("Error fetching information", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductAdded = async (newProduct: Product) => {
    try {
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const createdProduct = await response.json();
        setProducts([...products, createdProduct]);
        InputAlert("Product added successfully", "success");
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      InputAlert("Error adding product", "error");
    }
  };

  const handleDisableProduct = async (id: number) => {
    try {
      const result = await AlertConfirm("Are you sure you want to disable this product?");
      if (result.isConfirmed) {
        const response = await fetch(`/api/productos/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: "DESACTIVADO" }),
        });

        if (response.ok) {
          setProducts(products.map(p => (p.id === id ? { ...p, estado: "DESACTIVADO" } : p)));
          InputAlert("Product disabled successfully", "success");
        } else {
          throw new Error("Failed to disable product");
        }
      }
    } catch (error) {
      InputAlert("Error disabling product", "error");
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch(`/api/productos/${updatedProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        setProducts(products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
        setEditingProduct(null);
        InputAlert("Product updated successfully", "success");
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      InputAlert("Error updating product", "error");
    }
  };

  const enabledProducts = products.filter(p => p.estado === "ACTIVO");

  const filteredProducts = enabledProducts.filter(product => {
    const matchesCategory = selectedCategory === "Todas" || product.categoria.nombre === selectedCategory;
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper>
      <NavBar>
        <div className="flex items-center gap-2">
          <BiSolidFoodMenu className="text-[2em] text-gray-800" />
          <h1 className="text-[1.5em] text-gray-800">Product Management</h1>
        </div>
        <div className="flex gap-8 mt-3 lg:mt-0">
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 w-6 h-6 text-green-500" />
            Add Product
          </Button>
          <Button onClick={() => setIsEditMode(!isEditMode)}>
            <Edit className="mr-2 w-6 h-6 text-blue-500" />
            {isEditMode ? "Cancel Edit" : "Edit Products"}
          </Button>
          <Button onClick={() => setIsDisableMode(!isDisableMode)}>
            <Trash2 className="mr-2 w-6 h-6 text-red-500" />
            {isDisableMode ? "Cancel Delete" : "Delete Products"}
          </Button>
        </div>
      </NavBar>

      <ContentWrapper>
        <SearchBar
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <CategoryButtons>
          {categories.map(category => (
            <CategoryButton
              key={category}
              onClick={() => setSelectedCategory(category)}
              $active={selectedCategory === category}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryButtons>
        {isLoading ? (
          <ProductGridSkeleton />
        ) : (
          <ProductGrid>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => {
                    if (isDisableMode) handleDisableProduct(product.id);
                    if (isEditMode) setEditingProduct(product);
                  }}
                />
              ))
            ) : (
              <NoProductsMessage>No products available</NoProductsMessage>
            )}
          </ProductGrid>
        )}
      </ContentWrapper>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ProductForm
              onProductAdded={handleProductAdded}
              setIsModalOpen={setIsModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </ModalContent>
        </ModalOverlay>
      )}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleEditProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </PageWrapper>
  );
}
