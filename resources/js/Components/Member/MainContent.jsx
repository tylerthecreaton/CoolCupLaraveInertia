import React from "react";
import { Button, Datepicker, Label, TextInput } from "flowbite-react";
import { Table } from "flowbite-react";

export default function MainContent() {
    return (
        <main className="flex-1 relative py-6 px-4 bg-gray-50">
            <div className="space-y-6 max-w-screen-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200 bg-gray-300 rounded-t-lg">
                        <h2 className="text-xl font-semibold text-gray-800">ข้อมูลสมาชิก</h2>
                        <p className="mt-1 text-sm text-gray-500">ค้นหาสมาชิก</p>
                    </div>
                    <form className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label
                                    htmlFor="name"
                                    value="ชื่อ-นามสกุล"
                                    className="text-sm font-medium text-gray-700"
                                />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="กรุณากรอกชื่อ-นามสกุล"
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="phone_number"
                                    value="เบอร์โทรศัพท์"
                                    className="text-sm font-medium text-gray-700"
                                />
                                <TextInput
                                    id="phone_number"
                                    type="number"
                                    name="phone_number"
                                    placeholder="กรุณากรอกเบอร์โทรศัพท์"
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="birthdate"
                                    value="วัน/เดือน/ปีเกิด"
                                    className="text-sm font-medium text-gray-700"
                                />
                                <Datepicker
                                    language="th-Th"
                                    labelTodayButton="วันนี้"
                                    labelClearButton="ล้าง"
                                    id="birthdate"
                                    name="birthdate"
                                    placeholder="กรุณากรอกวัน/เดือน/ปีเกิด"
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="created_at"
                                    value="วันที่เริ่มเป็นสมาชิก"
                                    className="text-sm font-medium text-gray-700"
                                />
                                <TextInput
                                    id="created_at"
                                    type="text"
                                    name="created_at"
                                    placeholder="วันที่เริ่มเป็นสมาชิก"
                                    required
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                ค้นหาสมาชิก
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="bg-gray-300 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between ">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">คะแนนสะสม</h2>
                            <p className="mt-1 text-sm text-gray-500">คะแนนทั้งหมดของคุณ</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-blue-600">100</p>
                            <p className="text-sm text-gray-500">คะแนน</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-300 rounded-t-lg">
                        <h2 className="text-xl font-semibold text-gray-800">ประวัติการใช้คะแนน</h2>
                        <p className="mt-1 text-sm text-gray-500">รายการใช้คะแนนสะสมทั้งหมดของคุณ</p>
                    </div>
                    <div className="overflow-x-auto">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="bg-gray-50">วันที่</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">รายการ</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">ประเภท</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">คะแนนที่ใช้</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">คะแนนคงเหลือ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                <Table.Row className="bg-white hover:bg-gray-50">
                                    <Table.Cell className="whitespace-nowrap">
                                        19/12/2023
                                    </Table.Cell>
                                    <Table.Cell>แลกซื้อเครื่องดื่ม</Table.Cell>
                                    <Table.Cell>
                                        <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                                            ใช้คะแนน
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell className="text-red-600">-50</Table.Cell>
                                    <Table.Cell>150</Table.Cell>
                                </Table.Row>
                                <Table.Row className="bg-white hover:bg-gray-50">
                                    <Table.Cell className="whitespace-nowrap">
                                        18/12/2023
                                    </Table.Cell>
                                    <Table.Cell>ซื้อเครื่องดื่ม</Table.Cell>
                                    <Table.Cell>
                                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                            รับคะแนน
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell className="text-green-600">+10</Table.Cell>
                                    <Table.Cell>200</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-300 rounded-t-lg">
                        <h2 className="text-xl font-semibold text-gray-800">ประวัติการซื้อ</h2>
                        <p className="mt-1 text-sm text-gray-500">รายการสั่งซื้อทั้งหมดของคุณ</p>
                    </div>
                    <div className="overflow-x-auto">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="bg-gray-50">สินค้า</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">รายละเอียด</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">ประเภท</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">ราคา</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">การจัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                <Table.Row className="bg-white hover:bg-gray-50">
                                    <Table.Cell className="font-medium text-gray-900">
                                        Apple MacBook Pro 17
                                    </Table.Cell>
                                    <Table.Cell>Sliver</Table.Cell>
                                    <Table.Cell>Laptop</Table.Cell>
                                    <Table.Cell>฿99,900</Table.Cell>
                                    <Table.Cell>
                                        <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                                            ดูรายละเอียด
                                        </a>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row className="bg-white hover:bg-gray-50">
                                    <Table.Cell className="font-medium text-gray-900">
                                        Microsoft Surface Pro
                                    </Table.Cell>
                                    <Table.Cell>White</Table.Cell>
                                    <Table.Cell>Laptop PC</Table.Cell>
                                    <Table.Cell>฿59,900</Table.Cell>
                                    <Table.Cell>
                                        <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                                            ดูรายละเอียด
                                        </a>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </main>
    );
}
