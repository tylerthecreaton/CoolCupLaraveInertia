import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Table } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function Index({ auth, transformers }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Transformers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Transformers</h2>
                                <Link href={route('admin.transformers.create')}>
                                    <Button>
                                        <HiPlus className="mr-2 h-5 w-5" />
                                        Add Transformer
                                    </Button>
                                </Link>
                            </div>

                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>ID</Table.HeadCell>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>Description</Table.HeadCell>
                                    <Table.HeadCell>Ingredient</Table.HeadCell>
                                    <Table.HeadCell>Consumable</Table.HeadCell>
                                    <Table.HeadCell>Multiplier</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span className="sr-only">Actions</span>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {transformers?.map((transformer) => (
                                        <Table.Row key={transformer.id} className="bg-white">
                                            <Table.Cell>{transformer.id}</Table.Cell>
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                                {transformer.name}
                                            </Table.Cell>
                                            <Table.Cell>{transformer.description}</Table.Cell>
                                            <Table.Cell>{transformer.ingredient?.name}</Table.Cell>
                                            <Table.Cell>{transformer.consumable?.name}</Table.Cell>
                                            <Table.Cell>{transformer.multiplier}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('admin.transformers.edit', transformer.id)}>
                                                        <Button color="info" size="sm">
                                                            <HiPencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button color="failure" size="sm">
                                                        <HiTrash className="h-4 w-4" />
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
        </AuthenticatedLayout>
    );
}
