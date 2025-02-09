import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const NotificationItem = ({ notification, onMarkAsRead }) => {
    const getStatusColor = (type) => {
        switch (type) {
            case 'expiring':
                return 'text-red-500 bg-red-100';
            case 'low_stock':
            case 'product_low_stock':
                return 'text-yellow-500 bg-yellow-100';
            default:
                return 'text-blue-500 bg-blue-100';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'expiring':
                return 'fa-exclamation-circle';
            case 'low_stock':
                return 'fa-box';
            case 'product_low_stock':
                return 'fa-shopping-cart';
            default:
                return 'fa-bell';
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 mb-4">
            <div className="flex items-start space-x-4">
                <div className={`${getStatusColor(notification.type)} p-3 rounded-lg`}>
                    <i className={`fas ${getIcon(notification.type)} text-xl`} />
                </div>

                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-gray-900">{notification.title}</h3>
                        <span className="text-sm text-gray-500">{notification.created_at}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>

                    <div className="mt-4 flex space-x-4">
                        <Link
                            href={notification.url}
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150"
                        >
                            <i className="fas fa-eye mr-2"></i>
                            ดูรายละเอียด
                        </Link>
                        <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-150"
                        >
                            <i className="fas fa-check mr-2"></i>
                            ทำเครื่องหมายว่าอ่านแล้ว
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Index({ auth, notifications = [], total = 0 }) {
    const markAsRead = (id) => {
        router.put(route('notifications.mark-as-read', id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        ศูนย์การแจ้งเตือน
                    </h2>
                    <div className="text-sm text-gray-600">
                        ทั้งหมด: <span className="font-medium">{total}</span> รายการ
                    </div>
                </div>
            }
        >
            <Head title="การแจ้งเตือน" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {notifications.length > 0 ? (
                            <div className="space-y-4">
                                {notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={markAsRead}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <i className="fas fa-bell text-6xl"></i>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">ไม่มีการแจ้งเตือน</h3>
                                <p className="mt-1 text-sm text-gray-500">คุณไม่มีการแจ้งเตือนใหม่ในขณะนี้</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
