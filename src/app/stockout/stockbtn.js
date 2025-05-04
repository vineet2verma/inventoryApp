"use client"
import React, { useState } from 'react';

export default function StockTablePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeForm, setActiveForm] = useState('');

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setActiveForm('');
    };

    const renderForm = () => {
        switch (activeForm) {
            case 'client':
                return (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2">Client Form</h3>
                        <input className="w-full p-2 border rounded mb-2" placeholder="Client Name" />
                        <input className="w-full p-2 border rounded mb-2" placeholder="Client Email" />
                        <button className="w-full bg-blue-600 text-white p-2 rounded">Submit</button>
                    </div>
                );
            case 'dealers':
                return (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2">Dealers Form</h3>
                        <input className="w-full p-2 border rounded mb-2" placeholder="Dealer Name" />
                        <input className="w-full p-2 border rounded mb-2" placeholder="Dealer Code" />
                        <button className="w-full bg-blue-600 text-white p-2 rounded">Submit</button>
                    </div>
                );
            case 'breakages':
                return (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2">Breakages Form</h3>
                        <input className="w-full p-2 border rounded mb-2" placeholder="Item Name" />
                        <input type="number" className="w-full p-2 border rounded mb-2" placeholder="Quantity" />
                        <button className="w-full bg-blue-600 text-white p-2 rounded">Submit</button>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col gap-4 mt-4">
                        <button onClick={() => setActiveForm('client')} className="bg-blue-500 text-white p-2 rounded">
                            Client
                        </button>
                        <button onClick={() => setActiveForm('dealers')} className="bg-green-500 text-white p-2 rounded">
                            Dealers
                        </button>
                        <button onClick={() => setActiveForm('breakages')} className="bg-red-500 text-white p-2 rounded">
                            Breakages
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="p-6">
            <button onClick={openModal} className="bg-blue-600 text-white px-4 py-2 rounded">
                Open Modal
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
                        <h2 className="text-xl font-semibold">Choose Option</h2>
                        {renderForm()}
                        <button
                            onClick={closeModal}
                            className="mt-6 w-full bg-gray-300 hover:bg-gray-400 text-black p-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
