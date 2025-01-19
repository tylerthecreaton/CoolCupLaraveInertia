import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Button, Pagination, Table } from "flowbite-react";
import { FaList, FaPlus } from "react-icons/fa";
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
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item
                        href={route("admin.expense-categories.index")}
                    >
                        หมวดหมู่ค่าใช้จ่าย
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="flex items-center text-xl font-semibold text-gray-800">
                            <FaList className="mr-2 w-4 h-4" />
                            หมวดหมู่ค่าใช้จ่าย
                        </h2>
                        <Link href={route("admin.expense-categories.create")}>
                            <Button gradientDuoTone="greenToBlue">
                                <FaPlus className="mr-2 w-4 h-4" />
                                เพิ่มหมวดหมู่
                            </Button>
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>ชื่อหมวดหมู่</Table.HeadCell>
                                <Table.HeadCell>จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {categories.data.map((category) => (
                                    <Table.Row
                                        key={category.id}
                                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <Table.Cell>{category.name}</Table.Cell>
                                        <Table.Cell>
                                            <Link
                                                href={route(
                                                    "admin.expense-categories.edit",
                                                    category.id
                                                )}
                                            >
                                                <Button gradientDuoTone="greenToBlue">
                                                    แก้ไข
                                                </Button>
                                            </Link>
                                            <Button
                                                color="red"
                                                onClick={() => {
                                                    if (
                                                        confirm("Are you sure?")
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
                                                ลบ
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <Pagination
                            currentPage={categories.current_page}
                            totalPages={categories.last_page}
                            onPageChange={(page) => {
                                router.get(
                                    route("admin.expenseCategories.index", {
                                        page: page,
                                        search: search,
                                    }),
                                    {},
                                    { preserveState: true }
                                );
                            }}
                            showIcons={true}
                            className="flex justify-center mt-4"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
