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
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">สูตรแปรรูป</p>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Card className="shadow-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-md">
                                <FaFlask className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">รายการสูตรแปรรูป</h2>
                                <p className="text-sm text-gray-500">จัดการข้อมูลสูตรแปรรูปทั้งหมด</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 text-sm"
                                    placeholder="ค้นหาสูตรแปรรูป..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Link href={route("admin.transformers.create")}>
                                <Button gradientDuoTone="cyanToBlue" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200">
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
                                <Table.HeadCell className="font-semibold text-gray-700">ตัวคูณ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 text-right">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {filteredTransformers.map((transformer) => (
                                    <Table.Row
                                        key={transformer.id}
                                        className="bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <Table.Cell>
                                            <Tooltip
                                                content={
                                                    <div className="p-2 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
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
                                                <div className="flex items-center gap-2 cursor-pointer">
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
                                            <div className="flex justify-end gap-2">
                                                <Link href={route("admin.transformers.edit", transformer.id)}>
                                                    <Button size="xs" color="info" className="flex items-center gap-1">
                                                        <FaEdit className="w-4 h-4" />
                                                        แก้ไข
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="xs"
                                                    color="failure"
                                                    onClick={() => handleDelete(transformer.id)}
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

                    <div className="flex items-center justify-center text-center mt-4">
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
