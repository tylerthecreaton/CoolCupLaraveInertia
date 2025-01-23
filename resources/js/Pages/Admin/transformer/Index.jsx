import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Button,
    Table,
    Breadcrumb,
    Pagination,
    TextInput,
} from "flowbite-react";
import { HiHome, HiPencilAlt, HiTrash, HiSearch, HiPlus } from "react-icons/hi";
import AdminLayout from "@/Layouts/AdminLayout";
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
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        หน้าแรก
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>สูตรแปรรูปทั้งหมด</Breadcrumb.Item>
                </Breadcrumb>

                <AdminLayout>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="max-w-md">
                                <TextInput
                                    type="text"
                                    icon={HiSearch}
                                    placeholder="ค้นหาสูตรแปรรูป..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <Link href={route("admin.transformers.create")}>
                                <Button>
                                    <div className="flex items-center gap-x-2">
                                        <HiPlus className="w-4 h-4" />
                                        เพิ่มสูตรแปรรูป
                                    </div>
                                </Button>
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell>
                                        ชื่อสูตรแปรรูป
                                    </Table.HeadCell>
                                    <Table.HeadCell>ประเภท</Table.HeadCell>
                                    <Table.HeadCell>คำอธิบาย</Table.HeadCell>
                                    <Table.HeadCell>
                                        วัตถุดิบที่ใช้
                                    </Table.HeadCell>
                                    <Table.HeadCell>
                                        วัตถุดิบสิ้นเปลือง
                                    </Table.HeadCell>
                                    <Table.HeadCell>ตัวคูณ</Table.HeadCell>
                                    <Table.HeadCell>จัดการ</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {filteredTransformers.map((transformer) => (
                                        <Table.Row
                                            key={transformer.id}
                                            className="bg-white"
                                        >
                                            <Table.Cell className="font-medium text-gray-900">
                                                {transformer.name}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {transformer.type ==
                                                "ingredient"
                                                    ? "วัตถุดิบ"
                                                    : "วัตถุดิบสิ้นเปลือง"}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {transformer.description}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {transformer.ingredient?.name ||
                                                    "-"}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {transformer.consumable?.name ||
                                                    "-"}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {transformer.multiplier}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-x-3">
                                                    <Link
                                                        href={route(
                                                            "admin.transformers.edit",
                                                            transformer.id
                                                        )}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        <HiPencilAlt className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                transformer.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        <HiTrash className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>

                        <div className="flex items-center justify-center text-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                                showIcons
                                layout="pagination"
                            />
                        </div>
                    </div>
                </AdminLayout>
            </div>
        </AuthenticatedLayout>
    );
}
