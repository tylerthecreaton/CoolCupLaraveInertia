import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Button, Pagination, Table, Card } from "flowbite-react";
import { FaList, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { HiHome } from "react-icons/hi";

export default function Index({ categories }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการหมวดหมู่ค่าใช้จ่าย
                </h2>
            }
        >
            <Head title="จัดการหมวดหมู่ค่าใช้จ่าย" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example" className="mb-4">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        <span className="hover:text-blue-600 transition-colors">Home</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item
                        href={route("admin.expense-categories.index")}
                    >
                        <span className="hover:text-blue-600 transition-colors">หมวดหมู่ค่าใช้จ่าย</span>
                    </Breadcrumb.Item>
                </Breadcrumb>

                <Card className="shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="flex items-center text-xl font-semibold text-gray-800">
                            <FaList className="mr-2 w-5 h-5 text-blue-600" />
                            หมวดหมู่ค่าใช้จ่าย
                        </h2>
                        <Link href={route("admin.expense-categories.create")}>
                            <Button gradientDuoTone="greenToBlue" size="sm" className="transition-transform hover:scale-105">
                                <FaPlus className="mr-2 w-4 h-4" />
                                เพิ่มหมวดหมู่
                            </Button>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable className="shadow-sm">
                            <Table.Head className="bg-gray-50">
                                <Table.HeadCell className="font-semibold text-gray-700">ชื่อหมวดหมู่</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-700 text-right">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {categories.data.map((category) => (
                                    <Table.Row
                                        key={category.id}
                                        className="bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <Table.Cell className="font-medium text-gray-900">
                                            {category.name}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route(
                                                        "admin.expense-categories.edit",
                                                        category.id
                                                    )}
                                                >
                                                    <Button
                                                        gradientDuoTone="cyanToBlue"
                                                        size="sm"
                                                        className="transition-transform hover:scale-105"
                                                    >
                                                        <FaEdit className="mr-2 w-4 h-4" />
                                                        แก้ไข
                                                    </Button>
                                                </Link>
                                                <Button
                                                    color="failure"
                                                    size="sm"
                                                    className="transition-transform hover:scale-105"
                                                    onClick={() => {
                                                        if (
                                                            confirm("คุณแน่ใจหรือไม่ที่จะลบรายการนี้?")
                                                        ) {
                                                            router.delete(
                                                                route(
                                                                    "admin.expense-categories.destroy",
                                                                    category.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <FaTrash className="mr-2 w-4 h-4" />
                                                    ลบ
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                    
                    <div className="mt-4">
                        <Pagination
                            currentPage={categories.current_page}
                            totalPages={categories.last_page}
                            onPageChange={(page) => {
                                router.get(
                                    route("admin.expense-categories.index", {
                                        page: page,
                                    })
                                );
                            }}
                            showIcons={true}
                            className="flex justify-center"
                        />
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
