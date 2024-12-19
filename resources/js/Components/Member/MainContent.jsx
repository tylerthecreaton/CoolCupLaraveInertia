import React from "react";
import { Button, Datepicker, Label, TextInput } from "flowbite-react";
import { Table } from "flowbite-react";
export default function MainContent() {
    return (
        <main className="flex-1 relative py-10">
            <form className="flex flex-col gap-4 mx-auto w-full max-w-screen-2xl bg-white bg-opacity-100 p-8 rounded-md">
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="name"
                            value="ชื่อ-นามสกุล"
                            className="text-base"
                        />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        name="name"
                        placeholder="กรุณากรอกชื่อ-นามสกุล"
                        required
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="phone_number"
                            value="เบอร์โทรศัพท์"
                            className="text-base"
                        />
                    </div>
                    <TextInput
                        id="phone_number"
                        type="number"
                        name="phone_number"
                        placeholder="กรุณากรอกเบอร์โทรศัพท์"
                        required
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label
                            className="text-base"
                            htmlFor="birthdate"
                            value="วัน/เดือน/ปีเกิด"
                        />
                    </div>
                    <Datepicker
                        language="th-Th"
                        labelTodayButton="วันนี้"
                        labelClearButton="ล้าง"
                        id="birthdate"
                        name="birthdate"
                        placeholder="กรุณากรอกวัน/เดือน/ปีเกิด"
                        required
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
            <div className="flex flex-col gap-4 mx-auto w-full max-w-screen-2xl bg-white bg-opacity-100 p-8 rounded-md mt-10">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold">คะแนนสะสม</h2>
                    <p className="text-lg">คุณมีคะแนนสะสมทั้งหมด <span className="font-semibold">100</span> คะแนน</p>
                </div>
            </div>
            <div className="flex flex-col gap-4 mx-auto w-full max-w-screen-2xl bg-white bg-opacity-100 p-8 rounded-md mt-10">
                <div className="overflow-x-auto">
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell colSpan={5} className="text-xl font-semibold text-center bg-gray-300 border-gray-200">
                                ประวัติการซื้อ
                            </Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {'Apple MacBook Pro 17'}
                                </Table.Cell>
                                <Table.Cell>Sliver</Table.Cell>
                                <Table.Cell>Laptop</Table.Cell>
                                <Table.Cell>$2999</Table.Cell>
                                <Table.Cell>
                                    <a
                                        href="#"
                                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                    >
                                        Edit
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    Microsoft Surface Pro
                                </Table.Cell>
                                <Table.Cell>White</Table.Cell>
                                <Table.Cell>Laptop PC</Table.Cell>
                                <Table.Cell>$1999</Table.Cell>
                                <Table.Cell>
                                    <a
                                        href="#"
                                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                    >
                                        Edit
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    Magic Mouse 2
                                </Table.Cell>
                                <Table.Cell>Black</Table.Cell>
                                <Table.Cell>Accessories</Table.Cell>
                                <Table.Cell>$99</Table.Cell>
                                <Table.Cell>
                                    <a
                                        href="#"
                                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                                    >
                                        Edit
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </main>
    );
}
