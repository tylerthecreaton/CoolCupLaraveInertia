import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Breadcrumb, Pagination, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import Swal from "sweetalert2";
export default function index({ customersPaginate }) {
    const { current_page, next_page_url, prev_page_url } = customersPaginate;
    const [customers, setCustomers] = useState([]);
    const onPageChange = (page) => {
        page > current_page
            ? router.get(next_page_url)
            : router.get(prev_page_url);
    };

    useEffect(() => {
        setCustomers(customersPaginate.data);
    }, [customersPaginate]);
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.customers.destroy", id), {
                    onSuccess: () => {
                        Swal.fire(
                            "Deleted!",
                            "Your file has been deleted.",
                            "success"
                        );
                    },
                });
            }
        });
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการสมาชิก
                </h2>
            }
        >
            <Head title="จัดการสมาชิก" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>สมาชิกทั้งหมด</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <main className="container p-8 mx-auto mt-5 bg-white">
                <div className="flex justify-end pb-5">
                    <Link
                        href={route("admin.customers.create")}
                        className="px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-800"
                    >
                        เพิ่มสมาชิก
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>ลําดับ</Table.HeadCell>
                            <Table.HeadCell>ชื่อ</Table.HeadCell>
                            <Table.HeadCell>เบอร์โทร</Table.HeadCell>
                            <Table.HeadCell>วันเกิด</Table.HeadCell>
                            <Table.HeadCell>วันที่เป็นสมาชิก</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {customers.map((customer) => (
                                <Table.Row
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    key={customer.id}
                                >
                                    <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {(current_page - 1) *
                                            customersPaginate.per_page +
                                            customers.indexOf(customer) +
                                            1}
                                    </Table.Cell>
                                    <Table.Cell>{customer.name}</Table.Cell>
                                    <Table.Cell>
                                        {customer.phone_number}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {customer.birthdate}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {new Date(customer.created_at).toLocaleDateString('th-TH', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </Table.Cell>

                                    <Table.Cell>
                                        <a
                                            href={route(
                                                "admin.customers.edit",
                                                customer.id
                                            )}
                                            className="mr-2 font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                        >
                                            Edit
                                        </a>
                                        <button
                                            onClick={async () => {
                                                await handleDelete(customer.id);
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
                                {customersPaginate.from}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                to
                            </p>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {customersPaginate.to}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                of
                            </p>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {customersPaginate.total}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                Entries
                            </p>
                        </div>
                        <Pagination
                            currentPage={current_page}
                            totalPages={customersPaginate.last_page}
                            onPageChange={onPageChange}
                            showIcons
                        />
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
