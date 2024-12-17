import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { Pagination } from "flowbite-react";
import { Table } from "flowbite-react";
export default function Index() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการสินค้า
                </h2>
            }
        >
            <Head title="จัดการสินค้า" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>สินค้าทั้งหมด</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <main className="container p-8 mx-auto mt-5 bg-white">
                <div className="flex justify-end pb-5">
                    <Link
                        href={route("admin.products.create")}
                        className="px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-800"
                    >
                        เพิ่มสินค้า
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>ลําดับ</Table.HeadCell>
                            <Table.HeadCell>ชื่อสินค้า</Table.HeadCell>
                            <Table.HeadCell>รูปภาพ</Table.HeadCell>
                            <Table.HeadCell>คำอธิบาย</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {products.map((product) => (
                                <Table.Row
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    key={product.id}
                                >
                                    <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {product.id}
                                    </Table.Cell>
                                    <Table.Cell>{product.name}</Table.Cell>
                                    <Table.Cell>{product.image}</Table.Cell>
                                    <Table.Cell>
                                        {product.description}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <a
                                            href={route(
                                                "admin.products.edit",
                                                product.id
                                            )}
                                            className="mr-2 font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                        >
                                            Edit
                                        </a>
                                        <button
                                            onClick={async () => {
                                                await handleDelete(product.id);
                                            }}
                                            className="font-medium text-red-600 hover:underline dark:text-red-500"
                                        >
                                            Delete
                                        </button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <div className="flex overflow-x-auto sm:justify-between">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                Showing
                            </p>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {productsPaginate.from}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                to
                            </p>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {productsPaginate.to}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                of
                            </p>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {productsPaginate.total}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                Entries
                            </p>
                        </div>
                        <Pagination
                            currentPage={current_page}
                            totalPages={productsPaginate.last_page}
                            onPageChange={onPageChange}
                            showIcons
                        />
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
