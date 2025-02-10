// import AppLayout from '@/Layouts/AppLayout';
import { Tab } from '@headlessui/react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { useState } from 'react';

export default function Index({ pendingSlips }) {
    const [selectedTab, setSelectedTab] = useState(0);
    const [uploadingOrder, setUploadingOrder] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleFileUpload = async (orderId, file) => {
        try {
            const formData = new FormData();
            formData.append('slip', file);

            await axios.post(`/sendslip/${orderId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            // Refresh the page data
            window.location.reload();
        } catch (error) {
            console.error('Error uploading slip:', error);
            alert('Failed to upload slip. Please try again.');
        }
    };

    const handlePullToRefresh = () => {
        window.location.reload();
    };

    return (
        <div>
            <Head title="Payment Slip Upload" />

            <div className="min-h-screen bg-gray-100">
                {/* App Bar */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-gray-900">CoolCup</h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                            <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow">
                                <Tab className={({ selected }) =>
                                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                    ${selected
                                        ? 'bg-blue-500 text-white shadow'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }>
                                    Pending Slips
                                </Tab>
                                <Tab className={({ selected }) =>
                                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                    ${selected
                                        ? 'bg-blue-500 text-white shadow'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }>
                                    Uploaded Slips
                                </Tab>
                            </Tab.List>

                            <Tab.Panels className="mt-4">
                                <Tab.Panel>
                                    <div className="space-y-4">
                                        {pendingSlips.map((order) => (
                                            <div key={order.id} className="bg-white rounded-lg shadow p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-medium">{order.order_number}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {order.customer_name}
                                                        </p>
                                                        <p className="text-sm font-medium mt-1">
                                                            Total: ฿{order.total.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            id={`slip-upload-${order.id}`}
                                                            onChange={(e) => {
                                                                if (e.target.files?.[0]) {
                                                                    handleFileUpload(order.id, e.target.files[0]);
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`slip-upload-${order.id}`}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            Upload Slip
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                                                    <ul className="mt-1 space-y-1">
                                                        {order.items.map((item, index) => (
                                                            <li key={index} className="text-sm text-gray-600">
                                                                {item.quantity}x {item.name} - ฿{item.price.toFixed(2)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div className="bg-white rounded-lg shadow p-4">
                                        <p className="text-center text-gray-500">
                                            Coming soon...
                                        </p>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>
            </div>
        </div>
    );
}
