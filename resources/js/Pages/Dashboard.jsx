import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, Badge, Button } from 'flowbite-react';
import { HiUsers, HiShoppingBag, HiCurrencyDollar, HiClipboardList, HiTrendingUp, HiChartPie, HiArrowSmUp, HiClock, HiEye } from 'react-icons/hi';
import { usePage } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const { user } = usePage().props.auth;
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            สวัสดี, {user.name}! 👋
                        </h2>
                        <p className="mt-1 text-gray-600">
                            ยินดีต้อนรับสู่ระบบจัดการร้าน CoolCupPOS
                        </p>
                    </div>
                    <Button gradientDuoTone="purpleToBlue" className="hidden gap-2 items-center sm:flex">
                        <HiChartPie className="w-4 h-4" />
                        รายงานประจำวัน
                    </Button>
                </div>
            }
        >
            <Head title="แดชบอร์ด" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                        {/* Total Customers */}
                        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <div className="relative">
                                <div className="flex items-center">
                                    <div className="p-3 mr-4 text-orange-500 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-sm">
                                        <HiUsers className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="mb-2 text-sm font-medium text-gray-600">
                                            ลูกค้าทั้งหมด
                                        </p>
                                        <div className="flex gap-2 items-center">
                                            <p className="text-2xl font-bold text-gray-700">
                                                {stats?.customers?.toLocaleString() || 0}
                                            </p>
                                            <Badge color="success" className="flex gap-1 items-center">
                                                <HiArrowSmUp className="w-3 h-3" />
                                                12%
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-full opacity-10">
                                    <HiUsers className="w-full h-full text-orange-500" />
                                </div>
                            </div>
                        </Card>

                        {/* Total Products */}
                        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <div className="relative">
                                <div className="flex items-center">
                                    <div className="p-3 mr-4 text-blue-500 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm">
                                        <HiShoppingBag className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="mb-2 text-sm font-medium text-gray-600">
                                            สินค้าทั้งหมด
                                        </p>
                                        <div className="flex gap-2 items-center">
                                            <p className="text-2xl font-bold text-gray-700">
                                                {stats?.products?.toLocaleString() || 0}
                                            </p>
                                            <Badge color="success" className="flex gap-1 items-center">
                                                <HiArrowSmUp className="w-3 h-3" />
                                                8%
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-full opacity-10">
                                    <HiShoppingBag className="w-full h-full text-blue-500" />
                                </div>
                            </div>
                        </Card>

                        {/* Total Orders */}
                        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <div className="relative">
                                <div className="flex items-center">
                                    <div className="p-3 mr-4 text-green-500 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                                        <HiClipboardList className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="mb-2 text-sm font-medium text-gray-600">
                                            ออเดอร์ทั้งหมด
                                        </p>
                                        <div className="flex gap-2 items-center">
                                            <p className="text-2xl font-bold text-gray-700">
                                                {stats?.orders?.toLocaleString() || 0}
                                            </p>
                                            <Badge color="success" className="flex gap-1 items-center">
                                                <HiArrowSmUp className="w-3 h-3" />
                                                15%
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-full opacity-10">
                                    <HiClipboardList className="w-full h-full text-green-500" />
                                </div>
                            </div>
                        </Card>

                        {/* Total Revenue */}
                        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <div className="relative">
                                <div className="flex items-center">
                                    <div className="p-3 mr-4 text-purple-500 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-sm">
                                        <HiCurrencyDollar className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="mb-2 text-sm font-medium text-gray-600">
                                            รายได้ทั้งหมด
                                        </p>
                                        <div className="flex gap-2 items-center">
                                            <p className="text-2xl font-bold text-gray-700">
                                                ฿{stats?.revenue?.toLocaleString() || '0'}
                                            </p>
                                            <Badge color="success" className="flex gap-1 items-center">
                                                <HiArrowSmUp className="w-3 h-3" />
                                                20%
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-full opacity-10">
                                    <HiCurrencyDollar className="w-full h-full text-purple-500" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Activity and Charts Section */}
                    <div className="grid gap-6 mb-8 md:grid-cols-2">
                        {/* Recent Orders */}
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h5 className="text-xl font-bold text-gray-900">
                                        ออเดอร์ล่าสุด
                                    </h5>
                                    <p className="mt-1 text-sm text-gray-600">
                                        รายการสั่งซื้อล่าสุด 5 รายการ
                                    </p>
                                </div>
                                <Button color="gray" size="sm" className="flex gap-2 items-center">
                                    <HiEye className="w-4 h-4" />
                                    ดูทั้งหมด
                                </Button>
                            </div>
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-200">
                                    {stats?.recentOrders?.map((order) => (
                                        <li key={order.id} className="py-4 transition-colors hover:bg-gray-50">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                                                        <HiClipboardList className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {order.customer_name}
                                                    </p>
                                                    <div className="flex gap-2 items-center mt-1">
                                                        <HiClock className="w-4 h-4 text-gray-400" />
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(order.created_at).toLocaleDateString('th-TH', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="inline-flex items-center text-base font-bold text-gray-900">
                                                    <span className="text-sm font-semibold text-green-600">
                                                        {order.status === 'pending' ? 'รอการจัดส่ง' : order.status === 'shipping' ? 'กำลังส่ง' : 'เสร็จสิ้น'}
                                                    </span>
                                                    <span className="hidden sm:inline-block sm:mx-2 sm:px-2 sm:py-1 sm:rounded-full sm:bg-gray-200">
                                                        {order.payment_method}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                                        <li className="py-8 text-center">
                                            <HiClipboardList className="mx-auto w-12 h-12 text-gray-400" />
                                            <p className="mt-2 text-gray-500">ไม่มีข้อมูลออเดอร์</p>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </Card>

                        {/* Popular Products */}
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h5 className="text-xl font-bold text-gray-900">
                                        สินค้าขายดี
                                    </h5>
                                    <p className="mt-1 text-sm text-gray-600">
                                        สินค้าที่มียอดขายสูงสุด 5 อันดับ
                                    </p>
                                </div>
                                <Button color="gray" size="sm" className="flex gap-2 items-center">
                                    <HiTrendingUp className="w-4 h-4" />
                                    ดูเพิ่มเติม
                                </Button>
                            </div>
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-200">
                                    {stats?.popularProducts?.map((product, index) => (
                                        <li key={product.id} className="py-4 transition-colors hover:bg-gray-50">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    {product.image_url ? (
                                                        <img
                                                            className="object-cover w-16 h-16 rounded-xl ring-2 ring-gray-200"
                                                            src={product.image_url}
                                                            alt={product.name}
                                                        />
                                                    ) : (
                                                        <div className="flex justify-center items-center w-16 h-16 bg-gray-100 rounded-xl ring-2 ring-gray-200">
                                                            <HiShoppingBag className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex gap-2 items-center">
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {product.name}
                                                        </p>
                                                        <Badge color="gray" size="sm">
                                                            #{index + 1}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex gap-2 items-center mt-1">
                                                        <Badge color="info" className="font-medium">
                                                            {product.category}
                                                        </Badge>
                                                        <p className="text-sm text-gray-600">
                                                            {product.total_sales} ขาย
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="inline-flex items-center text-lg font-bold text-gray-900">
                                                    <HiTrendingUp className={`w-5 h-5 ${index < 3 ? 'text-green-500' : 'text-gray-400'}`} />
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    {(!stats?.popularProducts || stats.popularProducts.length === 0) && (
                                        <li className="py-8 text-center">
                                            <HiShoppingBag className="mx-auto w-12 h-12 text-gray-400" />
                                            <p className="mt-2 text-gray-500">ไม่มีข้อมูลสินค้า</p>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
