import { createContext, useContext, useEffect, useState } from "react";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

import { useAuth } from "./AuthContext";
import { db } from "../firebase";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("rijals_cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orders, setOrders] = useState([]);

  // ================================
  // LOAD CUSTOMER ORDERS
  // ================================

  useEffect(() => {
    const loadOrders = async () => {
      if (!currentUser) {
        setOrders([]);
        return;
      }

      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("customerId", "==", currentUser.id),
          orderBy("createdAt", "desc")
        );

        const ordersSnapshot = await getDocs(ordersQuery);

        const ordersData = ordersSnapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,
          ...orderDoc.data(),
        }));

        setOrders(ordersData);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    };

    loadOrders();
  }, [currentUser]);

  // ================================
  // SAVE CART
  // ================================

  useEffect(() => {
    localStorage.setItem("rijals_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ================================
  // ADD TO CART
  // ================================

  const addToCart = (product) => {
    setCartItems((previousItems) => {
      const existingItem = previousItems.find((item) => item.id === product.id);

      if (existingItem) {
        return previousItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previousItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // ================================
  // REMOVE FROM CART
  // ================================

  const removeFromCart = (id) => {
    setCartItems((previousItems) =>
      previousItems.filter((item) => item.id !== id)
    );
  };

  // ================================
  // INCREASE QUANTITY
  // ================================

  const increaseQuantity = (id) => {
    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // ================================
  // DECREASE QUANTITY
  // ================================

  const decreaseQuantity = (id) => {
    setCartItems((previousItems) =>
      previousItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ================================
  // CLEAR CART
  // ================================

  const clearCart = () => {
    setCartItems([]);
  };

  // ================================
  // CART TOTAL
  // ================================

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  // ================================
  // PLACE ORDER
  // ================================

  const placeOrder = async (customerDetails) => {
    if (!currentUser) {
      return null;
    }

    if (cartItems.length === 0) {
      return null;
    }

    try {
      const newOrder = {
        customerId: currentUser.id,
        customerEmail: currentUser.email,

        customerName: customerDetails.customerName || currentUser.name,

        phoneNumber: customerDetails.phoneNumber,

        shippingAddress: customerDetails.shippingAddress,

        items: cartItems,

        total: cartTotal,
        totalPrice: cartTotal,

        status: "Pending",

        createdAt: new Date().toISOString(),
      };

      // Save order to Firestore
      const orderRef = await addDoc(collection(db, "orders"), newOrder);

      const savedOrder = {
        id: orderRef.id,
        ...newOrder,
      };

      // Update local state immediately
      setOrders((previousOrders) => [savedOrder, ...previousOrders]);

      // Clear cart
      clearCart();

      return savedOrder;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        orders,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
