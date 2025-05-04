// app/context/UserContext.js
'use client';
import { createContext, useContext, useState } from 'react';

const DealerContext = createContext();

export function DealerProvider({ children }) {

    const [dealer, setDealer] = useState({
        date: "",
        orderId: "",
        ordDate: "",
        name: "",
        mobile: "",
        gstNo: "",
        paymentMode: "",
        billAddress: "",
        delAddress: "",
        refBy: "",
        delDate: "",
    });

    return (
        <DealerContext.Provider value={{ dealer, setDealer }}>
            {children}
        </DealerContext.Provider>
    );
}

export function useDealer() {
    const context = useContext(DealerContext);
    if (!context) {
        throw new Error('useDealer must be used within a UserProvider');
    }
    return context;
}