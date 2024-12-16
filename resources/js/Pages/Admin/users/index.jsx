import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Breadcrumb, Pagination, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import Swal from "sweetalert2";
export default function index({ usersPaginate }) {
    const { current_page, next_page_url, prev_page_url } = usersPaginate;
    const [users, setUsers] = useState([]);
    const onPageChange = (page) => {
        page > current_page
            ? router.get(next_page_url)
            : router.get(prev_page_url);
    };

    useEffect(() => {
        setUsers(usersPaginate.data);
    }, [usersPaginate]);
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
                router.delete(route("admin.users.destroy", id), {
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
                    จัดการผู้ใช้
                </h2>
            }
        >
            <Head title="จัดการผู้ใช้" />
            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>ผู้ใช้งานทั้งหมด</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <main className="container p-8 mx-auto mt-5 bg-white">
                <div className="flex justify-end">
                    <Link
                        href={route("admin.users.create")}
                        className="px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-800"
                    >
                        เพิ่มผู้ใช้
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>ID</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Roles</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {users.map((user) => (
                                <Table.Row
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    key={user.id}
                                >
                                    <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.id}
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{user.role}</Table.Cell>
                                    <Table.Cell>
                                        <a
                                            href={route(
                                                "admin.users.edit",
                                                user.id
                                            )}
                                            className="mr-2 font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                        >
                                            Edit
                                        </a>
                                        <button
                                            onClick={async () => {
                                                await handleDelete(user.id);
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
                                {usersPaginate.from}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                to
                            </p>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {usersPaginate.to}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                of
                            </p>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {usersPaginate.total}
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-400">
                                Entries
                            </p>
                        </div>
                        <Pagination
                            currentPage={current_page}
                            totalPages={usersPaginate.last_page}
                            onPageChange={onPageChange}
                            showIcons
                        />
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
