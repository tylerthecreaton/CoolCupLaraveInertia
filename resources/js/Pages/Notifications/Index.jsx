import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const NotificationItem = ({ notification, onMarkAsRead }) => {
    const getStatusColor = (type) => {
        switch (type) {
            case 'expiring':
                return 'bg-red-500';
            case 'low_stock':
            case 'product_low_stock':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
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
        <div className="bg-white border rounded-lg shadow-sm p-4 flex items-start">
            <div className={`text-${notification.color}-500 mr-4`}>
                <i className={`fas ${getIcon(notification.type)} text-xl`} />
            </div>

            <div className="flex-grow">
                <h3 className="font-semibold text-lg">{notification.title}</h3>
                <p className="text-gray-600">{notification.message}</p>

                <div className="mt-3 flex space-x-3">
                    <Link
                        href={notification.url}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ดูรายละเอียด
                    </Link>
                    <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        อ่านแล้ว
                    </button>
                </div>
            </div>

            <div className={`w-2 h-2 rounded-full ml-4 ${getStatusColor(notification.type)}`} />
        </div>
    );
};

export default function Index({ auth, notifications = [], total = 0 }) {
    const markAsRead = (id) => {
        router.post(route('notifications.mark-as-read', id));
    };

    const markAllAsRead = () => {
        router.post(route('notifications.mark-all-as-read'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="ศูนย์การแจ้งเตือน" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    ศูนย์การแจ้งเตือน
                                </h2>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        อ่านทั้งหมดแล้ว
                                    </button>
                                )}
                            </div>

                            {notifications.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">ไม่มีการแจ้งเตือนในขณะนี้</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onMarkAsRead={markAsRead}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
