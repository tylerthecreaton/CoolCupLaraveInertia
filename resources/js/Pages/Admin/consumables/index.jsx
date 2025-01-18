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
} from "flowbite-react";
import { HiHome, HiSearch, HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { isAbsoluteUrl } from "@/helpers";

export default function Index({ auth, consumables }) {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(
            route("admin.consumables.index"),
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

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
                router.delete(route("admin.consumables.destroy", id), {
                    preserveState: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Consumable has been deleted.",
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
        <AuthenticatedLayout user={auth.user}>
            <AdminLayout>
                <Head title="Consumables" />
                <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5">
                    <div className="mb-1 w-full">
                        <div className="mb-4">
                            <Breadcrumb aria-label="Default breadcrumb example">
                                <Breadcrumb.Item href="#" icon={HiHome}>
                                    Dashboard
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>Consumables</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className="block sm:flex items-center md:divide-x md:divide-gray-100">
                            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                                Consumables
                            </h1>
                            <div className="flex items-center sm:justify-end w-full">
                                <TextInput
                                    id="search"
                                    type="text"
                                    placeholder="Search for consumables"
                                    required={true}
                                    icon={HiSearch}
                                    value={search}
                                    onChange={handleSearch}
                                    className="mr-2"
                                />
                                <Link href={route("admin.consumables.create")}>
                                    <Button size="sm">
                                        <HiPlus className="mr-2 h-5 w-5" />
                                        Add Consumable
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden shadow">
                                <Table hoverable={true}>
                                    <Table.Head>
                                        <Table.HeadCell>Name</Table.HeadCell>
                                        <Table.HeadCell>Unit</Table.HeadCell>
                                        <Table.HeadCell>
                                            Quantity
                                        </Table.HeadCell>
                                        <Table.HeadCell>
                                            Depends on Sales
                                        </Table.HeadCell>
                                        <Table.HeadCell>
                                            Last Updated
                                        </Table.HeadCell>
                                        <Table.HeadCell>
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {consumables.data.map((consumable) => (
                                            <Table.Row
                                                key={consumable.id}
                                                className="bg-white"
                                            >
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                                    {consumable.name}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {consumable.unit}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {consumable.quantity}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {consumable.is_depend_on_sale ? (
                                                        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                                            Yes
                                                        </span>
                                                    ) : (
                                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                                                            No
                                                        </span>
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {new Date(
                                                        consumable.updated_at
                                                    ).toLocaleDateString()}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.consumables.edit",
                                                                consumable.id
                                                            )}
                                                            className="font-medium text-primary-600 hover:underline"
                                                        >
                                                            <Button
                                                                size="sm"
                                                                color="info"
                                                            >
                                                                <HiPencil className="mr-2 h-5 w-5" />
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            color="failure"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    consumable.id
                                                                )
                                                            }
                                                        >
                                                            <HiTrash className="mr-2 h-5 w-5" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>
                    </div>
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
                    className="flex justify-center mt-4"
                />
            </AdminLayout>
        </AuthenticatedLayout>
    );
}
