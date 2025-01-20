import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Table, Button, Pagination } from "flowbite-react";
import { HiHome, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import { useState } from "react";

export default function Index({ withdraws }) {
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <AdminLayout>
            <Head title="Withdraw List" />
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <Breadcrumb className="mb-4">
                            <Breadcrumb.Item href="/admin/dashboard" icon={HiHome}>Dashboard</Breadcrumb.Item>
                            <Breadcrumb.Item>Withdraws</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Withdraw List</h2>
                            <Link href={route('admin.withdraw.create')}>
                                <Button size="sm"><HiPlus className="mr-2 h-5 w-5" />Create Withdraw</Button>
                            </Link>
                        </div>
                        <Table striped>
                            <Table.Head>
                                <Table.HeadCell>ID</Table.HeadCell>
                                <Table.HeadCell>Amount</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                                <Table.HeadCell>Date</Table.HeadCell>
                                <Table.HeadCell>Actions</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {withdraws.data.map((withdraw) => (
                                    <Table.Row key={withdraw.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>{withdraw.id}</Table.Cell>
                                        <Table.Cell>${withdraw.amount}</Table.Cell>
                                        <Table.Cell>{withdraw.status}</Table.Cell>
                                        <Table.Cell>{new Date(withdraw.created_at).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>
                                            <div className="flex space-x-2">
                                                <Link href={route('admin.withdraws.edit', withdraw.id)}>
                                                    <Button size="sm" color="warning"><HiPencil className="mr-2 h-4 w-4" />Edit</Button>
                                                </Link>
                                                <Button size="sm" color="failure" onClick={() => handleDelete(withdraw.id)}>
                                                    <HiTrash className="mr-2 h-4 w-4" />Delete
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <div className="flex items-center justify-center text-center mt-4">
                            <Pagination
                                currentPage={currentPage}
                                onPageChange={page => {setCurrentPage(page)}}
                                showIcons={true}
                                totalPages={withdraws.last_page}
                            />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </AdminLayout>
    );
}

