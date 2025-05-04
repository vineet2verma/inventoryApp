'use client';
import { createContext, useContext, useState } from 'react';

const DealerItemContext = createContext();

export function DealerItemProvider({ children }) {
    const [dealerItems, setDealerItems] = useState([]);

    const addDealerItem = (item) => {
        setDealerItems((prev) => [...prev, item]);
    };

    const removeDealerItem = (index) => {
        setDealerItems((prev) => prev.filter((_, i) => i !== index));
    };

    const clearDealerItems = () => {
        setDealerItems([]);
    };

    return (
        <DealerItemContext.Provider value={{
            dealerItems,
            addDealerItem,
            removeDealerItem,
            clearDealerItems,
            setDealerItems
        }}>
            {children}
        </DealerItemContext.Provider>
    );
}

export function useDealerItems() {
    const context = useContext(DealerItemContext);
    if (!context) {
        throw new Error('useDealerItems must be used within a DealerItemProvider');
    }
    return context;
}
