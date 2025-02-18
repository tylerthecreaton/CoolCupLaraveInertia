import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Button,
    Table,
    Breadcrumb,
    Pagination,
    Card,
    Tooltip,
} from "flowbite-react";
import { FaList, FaPlus, FaEdit, FaTrash, FaSearch, FaFlask, FaInfoCircle } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import Swal from "sweetalert2";

export default function Index({ auth, transformers }) {
    const currentPage = transformers.current_page;
    const totalPages = Math.ceil(transformers.total / transformers.per_page);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTransformers, setFilteredTransformers] = useState(
        transformers.data
    );

    useEffect(() => {
        const results = transformers.data.filter((transformer) =>
            Object.values({
                name: transformer.name,
                description: transformer.description,
                ingredient: transformer.ingredient?.name,
                consumable: transformer.consumable?.name,
            }).some((value) =>
                value
                    ?.toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );
        setFilteredTransformers(results);
    }, [searchTerm, transformers.data]);

    const onPageChange = (page) => {
        router.get(route("admin.transformers.index", { page }));
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
                router.delete(route("admin.transformers.destroy", id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "สูตรแปรรูปถูกลบเรียบร้อยแล้ว",
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
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการสูตรแปรรูป
                </h2>
            }
        >
            <Head title="จัดการสูตรแปรรูป" />

            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <div className="mb-6">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            <p className="text-gray-700 transition-colors hover:text-blue-600">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <p className="text-gray-700 transition-colors hover:text-blue-600">สูตรแปรรูป</p>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Card className="shadow-lg">
                    <div className="flex flex-col gap-4 justify-between items-start mb-6 lg:flex-row lg:items-center">
                        <div className="flex gap-3 items-center">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-md">
                                <FaFlask className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">รายการสูตรแปรรูป</h2>
                                <p className="text-sm text-gray-500">จัดการข้อมูลสูตรแปรรูปทั้งหมด</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full sm:flex-row lg:w-auto">
                            <div className="relative flex-1 lg:w-64">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <FaSearch className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block py-2 pr-3 pl-10 w-full text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500"
                                    placeholder="ค้นหาสูตรแปรรูป..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Link href={route("admin.transformers.create")}>
                                <Button gradientDuoTone="cyanToBlue" size="sm" className="w-full shadow-sm transition-all duration-200 sm:w-auto hover:shadow-md">
                                    <FaPlus className="mr-2 w-4 h-4" />
                                    เพิ่มสูตรแปรรูป
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable className="shadow-sm">
                            <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <Table.HeadCell className="font-semibold text-gray-700">ชื่อสูตรแปรรูป</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">ประเภท</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">คำอธิบาย</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">วัตถุดิบที่ใช้</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">วัตถุดิบสิ้นเปลือง</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700">ปริมาณสุทธิของวัตถุดิบ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-right text-gray-700">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {filteredTransformers.map((transformer) => (
                                    <Table.Row
                                        key={transformer.id}
                                        className="bg-white transition-colors hover:bg-gray-50"
                                    >
                                        <Table.Cell>
                                            <Tooltip
                                                content={
                                                    <div className="p-2 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="flex gap-2 items-center">
                                                                <FaFlask className="w-4 h-4 text-cyan-400" />
                                                                <span className="font-medium">{transformer.name}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <div>
                                                                    <p className="text-gray-500">ประเภท:</p>
                                                                    <p className="font-medium">
                                                                        {transformer.type === "ingredient" ? "วัตถุดิบ" : "วัตถุดิบสิ้นเปลือง"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500">ตัวคูณ:</p>
                                                                    <p className="font-medium">{transformer.multiplier}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm">
                                                                <p className="text-gray-500">รายละเอียด:</p>
                                                                <p className="font-medium">{transformer.description || 'ไม่มีรายละเอียด'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="flex gap-2 items-center cursor-pointer">
                                                    <span className="font-medium text-gray-900">{transformer.name}</span>
                                                    <FaInfoCircle className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {transformer.type === "ingredient" ? "วัตถุดิบ" : "วัตถุดิบสิ้นเปลือง"}
                                        </Table.Cell>
                                        <Table.Cell>{transformer.description}</Table.Cell>
                                        <Table.Cell>{transformer.ingredient?.name || "-"}</Table.Cell>
                                        <Table.Cell>{transformer.consumable?.name || "-"}</Table.Cell>
                                        <Table.Cell>{transformer.multiplier}</Table.Cell>
                                        <Table.Cell>
                                            <div className="flex gap-2 justify-end">
                                                <Link href={route("admin.transformers.edit", transformer.id)}>
                                                    <Button size="xs" color="info" className="flex gap-1 items-center">
                                                        <FaEdit className="w-4 h-4" />
                                                        แก้ไข
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="xs"
                                                    color="failure"
                                                    onClick={() => handleDelete(transformer.id)}
                                                    className="flex gap-1 items-center"
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

                    <div className="flex justify-center items-center mt-4 text-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                            showIcons
                        />
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
