import React from "react";
import { Table } from "flowbite-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ transactions }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    ประวัติการเคลื่อนไหวของวัตถุดิบ
                </h2>
            }
        >
            <Head title="ประวัติการเคลื่อนไหวของวัตถุดิบ" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <Table hoverable>
                                    <Table.Head>
                                        <Table.HeadCell>ลำดับ</Table.HeadCell>
                                        <Table.HeadCell>วัตถุดิบ</Table.HeadCell>
                                        <Table.HeadCell>ประเภทการเคลื่อนไหว</Table.HeadCell>
                                        <Table.HeadCell>จำนวน</Table.HeadCell>
                                        <Table.HeadCell>หมายเหตุ</Table.HeadCell>
                                        <Table.HeadCell>วันที่</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {transactions?.map((transaction, index) => (
                                            <Table.Row key={transaction.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {index + 1}
                                                </Table.Cell>
                                                <Table.Cell>{transaction.ingredient.name}</Table.Cell>
                                                <Table.Cell>
                                                    {transaction.type === 'added' ? 'เพิ่ม' : 'ลด'}
                                                </Table.Cell>
                                                <Table.Cell>{transaction.quantity}</Table.Cell>
                                                <Table.Cell>{transaction.note}</Table.Cell>
                                                <Table.Cell>{transaction.created_at}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
