import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Breadcrumb,
    Dropdown,
    Pagination,
    Table,
    TextInput,
    Button,
    Badge,
} from "flowbite-react";
import { HiHome, HiSearch, HiPlus, HiPencil, HiTrash, HiOutlineExclamationCircle, HiPlusCircle } from "react-icons/hi";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { isAbsoluteUrl } from "@/helpers";

export default function Index({ auth, consumables }) {
    const [search, setSearch] = useState("");
    const [filteredConsumables, setFilteredConsumables] = useState(consumables.data);

    useEffect(() => {
        const results = consumables.data.filter((consumable) =>
            Object.values({
                name: consumable.name,
                unit: consumable.unit,
            }).some((value) =>
                value
                    ?.toString()
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
        );
        setFilteredConsumables(results);
    }, [search, consumables.data]);

    const handleDelete = (id, name) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            html: `คุณต้องการลบ <span class="font-medium text-red-600">${name}</span> ใช่หรือไม่?<br/><small class="text-gray-500">การกระทำนี้ไม่สามารถย้อนกลับได้</small>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.consumables.destroy", id), {
                    preserveState: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "วัตถุดิบสิ้นเปลืองถูกลบเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการวัตถุดิบสิ้นเปลือง
                </h2>
            }
        >
            <Head title="จัดการวัตถุดิบสิ้นเปลือง | Cool Cup" />
            <AdminLayout className="container p-8 mx-auto mt-5 bg-white rounded-lg shadow-sm">
                <div className="space-y-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-between">
                        <Breadcrumb aria-label="Breadcrumb navigation" className="py-2">
                            <Breadcrumb.Item href={route("dashboard")} icon={HiHome}>
                                หน้าแรก
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>วัตถุดิบสิ้นเปลืองทั้งหมด</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:w-72">
                            <TextInput
                                icon={HiSearch}
                                placeholder="ค้นหาวัตถุดิบสิ้นเปลือง..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="transition-all duration-200 focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <Link
                            href={route("admin.consumables.create")}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:scale-105"
                        >
                            <HiPlus className="w-5 h-5 mr-2" />
                            เพิ่มวัตถุดิบสิ้นเปลือง
                        </Link>
                    </div>

                    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ลําดับ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ชื่อวัตถุดิบสิ้นเปลือง
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    จำนวน
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    หน่วย
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    ใช้ในการขาย
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    วันที่เพิ่มรายการ
                                </Table.HeadCell>
                                <Table.HeadCell className="px-6 py-4 font-medium text-gray-700 bg-gray-50">
                                    <span className="sr-only">Actions</span>
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y divide-gray-200">
                                {filteredConsumables.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={7} className="px-6 py-8 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <HiOutlineExclamationCircle className="w-12 h-12 mb-4 text-gray-400" />
                                                <h3 className="mb-2 text-base font-medium text-gray-900">ไม่พบข้อมูล</h3>
                                                <p className="text-sm text-gray-500">เริ่มต้นโดยการเพิ่มวัตถุดิบสิ้นเปลือง</p>
                                                <div className="mt-6">
                                                    <Link href={route("admin.consumables.create")}>
                                                        <Button gradientDuoTone="purpleToBlue" size="sm">
                                                            <HiPlus className="w-5 h-5 mr-2" />
                                                            เพิ่มวัตถุดิบสิ้นเปลือง
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    filteredConsumables.map((consumable, index) => (
                                        <Table.Row
                                            key={consumable.id}
                                            className="bg-white transition-colors duration-150 hover:bg-gray-50/60"
                                        >
                                            <Table.Cell className="px-6 py-4 font-medium text-gray-900">
                                                {(consumables.current_page - 1) * consumables.per_page + index + 1}
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {consumable.name}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {consumable.quantity}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                <Badge color="gray" size="sm">
                                                    {consumable.unit}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                {consumable.is_depend_on_sale ? (
                                                    <Badge color="success">ใช่</Badge>
                                                ) : (
                                                    <Badge color="gray">ไม่</Badge>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {new Date(consumable.updated_at).toLocaleDateString("th-TH", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={route("admin.consumables.edit", consumable.id)}
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors duration-150"
                                                    >
                                                        <HiPencil className="w-4 h-4 mr-1.5" />
                                                        แก้ไข
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(consumable.id, consumable.name)}
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150"
                                                    >
                                                        <HiTrash className="w-4 h-4 mr-1.5" />
                                                        ลบ
                                                    </button>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                    <Pagination
                        currentPage={consumables.current_page}
                        totalPages={consumables.last_page}
                        onPageChange={(page) => {
                            router.get(
                                route("admin.consumables.index", {
                                    page: page,
                                    search: search,
                                }),
                                {},
                                { preserveState: true }
                            );
                        }}
                        showIcons={true}
                        className="flex justify-center my-4"
                    />
                </div>
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
