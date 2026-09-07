import { createContext, useContext, useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";
import {
  categories,
  default as initialProducts,
} from "../data/initialProducts.js";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from Firestore
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));

        // If Firestore has no products,
        // upload the existing initial products
        if (productsSnapshot.empty) {
          console.log(
            "No products found in Firestore. Adding initial products..."
          );

          const uploadedProducts = [];

          for (const product of initialProducts) {
            const productData = {
              name: product.name,
              category: product.category,
              subCategory: product.subCategory,
              price: Number(product.price),
              image: product.image || "",
              description: product.description || "",
              featured: product.featured || false,
            };

            const productRef = await addDoc(
              collection(db, "products"),
              productData
            );

            uploadedProducts.push({
              id: productRef.id,
              ...productData,
            });
          }

          setProducts(uploadedProducts);
        } else {
          const productsData = productsSnapshot.docs.map((productDoc) => ({
            id: productDoc.id,
            ...productDoc.data(),
          }));

          setProducts(productsData);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Add product
  const addProduct = async (productData) => {
    try {
      const newProduct = {
        name: productData.name,
        category: productData.category,
        subCategory: productData.subCategory,
        price: Number(productData.price),
        image: productData.image || "",
        description: productData.description || "",
        featured: productData.featured || false,
      };

      const productRef = await addDoc(collection(db, "products"), newProduct);

      setProducts((previousProducts) => [
        ...previousProducts,
        {
          id: productRef.id,
          ...newProduct,
        },
      ]);

      return productRef.id;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  // Update product
  const updateProduct = async (id, updatedData) => {
    try {
      const productRef = doc(db, "products", id);

      const updatedProduct = {
        ...updatedData,
        price: Number(updatedData.price),
      };

      await updateDoc(productRef, updatedProduct);

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product.id === id
            ? {
                ...product,
                ...updatedProduct,
              }
            : product
        )
      );
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "products", id));

      setProducts((previousProducts) =>
        previousProducts.filter((product) => product.id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  // Get featured products
  const getFeaturedProducts = () => {
    return products.filter((product) => product.featured);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getFeaturedProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};
