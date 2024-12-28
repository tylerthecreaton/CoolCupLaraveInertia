import { isAbsoluteUrl } from "@/helpers";
import AdminLayout from "@/Layouts/AdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Button, Table } from "flowbite-react";
import { HiHome, HiPencil, HiPlus, HiTrash } from "react-icons/hi";

export default function Index({ promotions }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: "คุณแน่ใจหรือไม่?",
            text: "คุณต้องการลบโปรโมชั่นนี้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ลบ!",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.delete(route("admin.promotions.destroy", id));
            }
        });
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    โปรโมชั่น
                </h2>
            }
        >
            <Head title="จัดการโปรโมชั่น" />
            <AdminLayout className="container p-8 mx-auto mt-5 bg-white rounded-lg shadow-sm">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/promotions">
                        โปรโมชั่น
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="w-full sm:w-72">{/* todo search */}</div>
                    <Link
                        href={route("admin.promotions.create")}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg transition-all duration-200 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:scale-105"
                    >
                        <HiPlus className="mr-2 w-5 h-5" />
                        เพิ่มโปรโมชั่น
                    </Link>
                </div>
                <div className="overflow-hidden mt-5 rounded-lg border border-gray-200 shadow-sm">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>ลําดับ</Table.HeadCell>
                            <Table.HeadCell>รูปโปรโมชั่น</Table.HeadCell>
                            <Table.HeadCell>ชื่อโปรโมชั่น</Table.HeadCell>
                            <Table.HeadCell>รายละเอียด</Table.HeadCell>
                            <Table.HeadCell>ประเภท</Table.HeadCell>
                            <Table.HeadCell>วันที่เริ่ม</Table.HeadCell>
                            <Table.HeadCell>วันที่สิ้นสุด</Table.HeadCell>
                            <Table.HeadCell>สถานะ</Table.HeadCell>
                            <Table.HeadCell>จัดการ</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {promotions?.map((promotion, index) => (
                                <Table.Row
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    key={index}
                                >
                                    <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {index + 1}
                                    </Table.Cell>
                                    <Table.Cell className="w-25">
                                        <img
                                            src={
                                                promotion.image ??
                                                "/images/defaults/default-promotion.jpg"
                                            }
                                            alt={promotion.name}
                                            className="w-full h-full rounded"
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{promotion.name}</Table.Cell>
                                    <Table.Cell>
                                        {promotion.description}
                                    </Table.Cell>
                                    <Table.Cell>{promotion.type}</Table.Cell>
                                    <Table.Cell>
                                        {new Date(
                                            promotion.start_date
                                        ).toLocaleString("th-TH", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {new Date(
                                            promotion.end_date
                                        ).toLocaleString("th-TH", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </Table.Cell>
                                    <Table.Cell>{promotion.status}</Table.Cell>
                                    <Table.Cell className="flex gap-2">
                                        <Link
                                            href={route(
                                                "admin.promotions.edit",
                                                promotion.id
                                            )}
                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors duration-150"
                                        >
                                            <HiPencil className="w-4 h-4 mr-1.5" />
                                            แก้ไข
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(promotion.id)
                                            }
                                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150"
                                        >
                                            <HiTrash className="w-4 h-4 mr-1.5" />
                                            ลบ
                                        </button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
