import React, { createContext, useContext, useState } from 'react';

import { toast } from 'react-hot-toast';

const Context = createContext();

export const AppContext = ({ children }) => {
    const [ showCart, setShowCart ] = useState(false);
    const [ cartItems, setCartItems ] = useState([]);
    const [ cartItemsQuantity, setCartItemsQuantity ] = useState(0);
    const [ cartTotal, setCartTotal ] = useState(0);
    const [ itemQuantity , setItemQuantity ] = useState(0);

    let itemToUpdate;

    function handleIncreaseClick() {
        setItemQuantity(prevQty => prevQty + 1);
    }

    function handleDecreaseClick() {
        setItemQuantity(prevQty => {
            if (prevQty > 0) return prevQty - 1
            return 1; 
        });
    }

    function handleAddToCartClick(product, quantity) {
        
        const item = cartItems.find(item => item.id === product.id);
        
        if (item) {
            
            const updatedCartItems = cartItems.map(item => {
                if (item._id === product._id) {
                    return {
                        ...item,
                        quantity: item.quantity + quantity,
                    }
                }
            })
            setCartItems(updatedCartItems);
            
        } else {
            product.quantity = quantity;
            setCartItems(prevItems => [...prevItems, { ...product }]);
        }
        
        setCartTotal(prevTotal => prevTotal + product.price * quantity);
        setCartItemsQuantity(prevQty => prevQty + quantity);
        toast.success(`${itemQuantity} ${product.name} added to cart`);
        
    }

    function handleRemoveFromCartClick(id) {
        itemToUpdate = cartItems.find(item => item._id === id)
        const updatedCartItems = cartItems.filter(item => item._id !== id)
        
        setCartItems(updatedCartItems);   
        setCartItemsQuantity(prevQty => prevQty - itemToUpdate.quantity);
        setCartTotal(prevTotal => prevTotal - itemToUpdate.price * itemToUpdate.quantity);
    }

    function handleCartItemQuantityClick(id, value) {
        itemToUpdate = cartItems.find(item => item._id === id)
        const updatedCartItems = cartItems.filter(item => item._id !== id)

        if (value === 'increase') {
            setCartItems([...updatedCartItems, { ...itemToUpdate, quantity: itemToUpdate.quantity + 1 } ]);
            setCartTotal((prevTotalPrice) => prevTotalPrice + itemToUpdate.price)
            setCartItemsQuantity(prevTotalQuantities => prevTotalQuantities + 1)

        } else if (value === 'decrease') {
            if (itemToUpdate.quantity > 1) {
                setCartItems([...updatedCartItems, { ...itemToUpdate, quantity: itemToUpdate.quantity - 1 } ]);
                setCartTotal((prevTotalPrice) => prevTotalPrice - itemToUpdate.price)
                setCartItemsQuantity(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }

    }   

    const values = {
        cartItems,
        cartItemsQuantity,
        cartTotal,
        handleDecreaseClick,
        handleIncreaseClick,
        handleAddToCartClick,
        handleCartItemQuantityClick,
        handleRemoveFromCartClick,
        itemQuantity,
        setShowCart,
        showCart,
    }; 


        return (
            <Context.Provider value={values}>
                {children}
            </Context.Provider>
        );
    };


export const useAppContext = () => {
    return useContext(Context);
}