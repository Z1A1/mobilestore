import React, { createContext, useState, useCallback } from 'react';

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = useCallback((newItem) => {
    console.log("Adding item:", newItem);
    

    const itemToAdd = {
      ...newItem,
      id: String(newItem.id) 
    };
    
    setItems((prevItems) => {
      console.log("Current items:", prevItems);
      
      const existingItemIndex = prevItems.findIndex(item => 
        String(item.id) === String(itemToAdd.id)
      );
      
      console.log("Existing item index:", existingItemIndex);
      
      if (existingItemIndex !== -1) {
     
        console.log("Item exists, updating quantity");
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
    
        console.log("New item, adding to cart");
        const newItemWithQuantity = { ...itemToAdd, quantity: 1 };
        const newItems = [...prevItems, newItemWithQuantity];
        console.log("New items array:", newItems);
        return newItems;
      }
    });
  }, []);

  const removeItem = useCallback((id) => {
    console.log("Removing item with id:", id);
    setItems((prevItems) => prevItems.filter(item => String(item.id) !== String(id)));
  }, []);

  const incrementQuantity = useCallback((id) => {
    console.log("Incrementing quantity for id:", id);
    setItems(prevItems =>
      prevItems.map(item =>
        String(item.id) === String(id) 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  }, []);

  const decrementQuantity = useCallback((id) => {
    console.log("Decrementing quantity for id:", id);
    setItems(prevItems =>
      prevItems
        .map(item =>
          String(item.id) === String(id)
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }, []);

  const clearItems = useCallback(() => {
    console.log("Clearing all items");
    setItems([]);
  }, []);

  return (
    <ItemContext.Provider
      value={{ items, addItem, removeItem, incrementQuantity, decrementQuantity, clearItems }}
    >
      {children}
    </ItemContext.Provider>
  );
};