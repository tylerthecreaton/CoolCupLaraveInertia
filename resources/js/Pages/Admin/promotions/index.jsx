import { isAbsoluteUrl } from "@/helpers";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Button, Table, Card, Badge, Tooltip } from "flowbite-react";
import { FaList, FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaSearch, FaGift, FaInfoCircle } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { useState } from "react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function Index({ promotions }) {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(
            route("admin.promotions.index"),
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณไม่สามารถย้อนกลับการกระทำนี้ได้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.promotions.destroy", id), {
                    preserveState: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "โปรโมชั่นถูกลบเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: "success", text: "ยังใช้อยู่" },
            inactive: { color: "failure", text: "ไม่ได้ใช้งาน" },
            expired: { color: "warning", text: "หมดอายุ" }
        };
        return statusConfig[status] 
            ? <Badge color={statusConfig[status].color}>{statusConfig[status].text}</Badge>
            : <Badge color="info">ไม่ระบุ</Badge>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            calendar: 'buddhist'
        }).replace(/\s/g, '');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการโปรโมชั่น
                </h2>
            }
        >
            <Head title="จัดการโปรโมชั่น" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <div className="mb-6">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href={route("admin.promotions.index")}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">โปรโมชั่น</p>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Card className="shadow-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                                <FaGift className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">รายการโปรโมชั่น</h2>
                                <p className="text-sm text-gray-500">จัดการข้อมูลโปรโมชั่นทั้งหมด</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-sm"
                                    placeholder="ค้นหาโปรโมชั่น..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                            <Link href={route("admin.promotions.create")}>
                                <Button gradientDuoTone="purpleToBlue" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200">
                                    <FaPlus className="mr-2 w-4 h-4" />
                                    เพิ่มโปรโมชั่น
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable className="shadow-sm">
                            <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <Table.HeadCell className="font-semibold text-gray-700 w-16">ลำดับ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">รูปโปรโมชั่น</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">ชื่อโปรโมชั่น</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">ประเภท</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">วันที่เริ่ม</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">วันที่สิ้นสุด</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">สถานะ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 text-right">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {promotions?.map((promotion, index) => (
                                    <Table.Row
                                        key={promotion.id}
                                        className="bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <Table.Cell className="font-medium text-gray-900 whitespace-nowrap">
                                            #{index + 1}
                                        </Table.Cell>
                                        <Table.Cell className="w-24">
                                            <img
                                                src={promotion.image ?? "/images/defaults/default-promotion.jpg"}
                                                alt={promotion.name}
                                                className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Tooltip
                                                content={
                                                    <div className="p-2 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <FaGift className="w-4 h-4 text-purple-400" />
                                                                <span className="font-medium">{promotion.name}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <div>
                                                                    <p className="text-gray-500">ประเภท:</p>
                                                                    <p className="font-medium">{promotion.type}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500">สถานะ:</p>
                                                                    <div className="mt-1">
                                                                        {getStatusBadge(promotion.status)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm">
                                                                <p className="text-gray-500">รายละเอียด:</p>
                                                                <p className="font-medium">{promotion.description || 'ไม่มีรายละเอียด'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="flex items-center gap-2 cursor-pointer">
                                                    <span className="font-medium text-gray-900">{promotion.name}</span>
                                                    <FaInfoCircle className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell>{promotion.type}</Table.Cell>
                                        <Table.Cell>{formatDate(promotion.start_date)}</Table.Cell>
                                        <Table.Cell>{formatDate(promotion.end_date)}</Table.Cell>
                                        <Table.Cell>{getStatusBadge(promotion.status)}</Table.Cell>
                                        <Table.Cell>
                                            <div className="flex justify-end gap-2">
                                                <Link href={route("admin.promotions.edit", promotion.id)}>
                                                    <Button size="xs" color="info" className="flex items-center gap-1">
                                                        <FaEdit className="w-4 h-4" />
                                                        แก้ไข
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="xs"
                                                    color="failure"
                                                    onClick={() => handleDelete(promotion.id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                    ลบ
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
