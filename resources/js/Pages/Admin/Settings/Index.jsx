import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Button, Card, Table, Tooltip, Modal, Label, TextInput, Select, Textarea } from "flowbite-react";
import { FaList, FaPlus, FaEdit, FaTrash, FaCog, FaInfoCircle, FaSearch } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { useState } from "react";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function Index({ settings, types }) {
    const [search, setSearch] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [data, setData] = useState({
        key: '',
        value: '',
        description: '',
        type: 'general',
        comment: ''
    });
    const [errors, setErrors] = useState({});

    const handleSearch = (e) => {
        setSearch(e.target.value);
        router.get(
            route("admin.settings.index"),
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณไม่สามารถย้อนกลับการกระทำนี้ได้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.settings.destroy", id), {
                    preserveState: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "การตั้งค่าถูกลบเรียบร้อยแล้ว",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            router.put(route('admin.settings.update', editingId), data, {
                preserveState: true,
                onSuccess: () => {
                    setIsModalVisible(false);
                    setEditingId(null);
                    setData({
                        key: '',
                        value: '',
                        description: '',
                        type: 'general',
                        comment: ''
                    });
                },
                onError: (errors) => {
                    setErrors(errors);
                }
            });
        } else {
            router.post(route('admin.settings.store'), data, {
                preserveState: true,
                onSuccess: () => {
                    setIsModalVisible(false);
                    setData({
                        key: '',
                        value: '',
                        description: '',
                        type: 'general',
                        comment: ''
                    });
                },
                onError: (errors) => {
                    setErrors(errors);
                }
            });
        }
    };

    const showModal = (record = null) => {
        if (record) {
            setEditingId(record.id);
            setData(record);
        } else {
            setData({
                key: '',
                value: '',
                description: '',
                type: 'general',
                comment: ''
            });
            setEditingId(null);
        }
        setIsModalVisible(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการการตั้งค่า
                </h2>
            }
        >
            <Head title="จัดการการตั้งค่า" />

            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <div className="mb-6">
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">หน้าแรก</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href={route("admin.settings.index")}>
                            <p className="text-gray-700 hover:text-blue-600 transition-colors">การตั้งค่า</p>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Card className="shadow-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                                <FaList className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">รายการการตั้งค่า</h2>
                                <p className="text-sm text-gray-500">จัดการการตั้งค่าทั้งหมดของระบบ</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm"
                                    placeholder="ค้นหาการตั้งค่า..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                            <Button gradientDuoTone="greenToBlue" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200" onClick={() => showModal()}>
                                <FaPlus className="mr-2 w-4 h-4" />
                                เพิ่มการตั้งค่า
                            </Button>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg shadow-sm">
                        <Table hoverable>
                            <Table.Head className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <Table.HeadCell className="font-semibold text-gray-900">ลำดับ</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-900">ชื่อการตั้งค่า</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-900">ค่า</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-900">คำอธิบายของการตั้งค่า</Table.HeadCell>
                                <Table.HeadCell className="font-semibold text-gray-900 w-32 text-right">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {settings.map((setting, index) => (
                                    <Table.Row
                                        key={setting.id}
                                        className="bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <Table.Cell className="font-medium text-gray-900">
                                            {index + 1}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Tooltip
                                                content={
                                                    <div className="p-2 max-w-xs">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <FaCog className="w-4 h-4 text-blue-400" />
                                                                <span className="font-medium">{setting.key}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {setting.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="flex items-center gap-2 cursor-pointer">
                                                    <FaCog className="w-4 h-4 text-blue-500" />
                                                    <span className="font-medium text-gray-900">{setting.key}</span>
                                                </div>
                                            </Tooltip>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="text-gray-600">{setting.value}</div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="text-gray-600 line-clamp-2">{setting.description}</div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="xs" color="info" className="gap-1" onClick={() => showModal(setting)}>
                                                    <FaEdit className="w-4 h-4" />
                                                    แก้ไข
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    color="failure"
                                                    onClick={() => handleDelete(setting.id)}
                                                    className="gap-1"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                    ลบ
                                                </Button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                                {settings.length === 0 && (
                                    <Table.Row>
                                        <Table.Cell colSpan={5} className="text-center py-10">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <FaInfoCircle className="w-12 h-12 mb-4 text-gray-400" />
                                                <p className="text-lg font-medium">ไม่พบข้อมูลการตั้งค่า</p>
                                                <p className="mt-1 text-sm">
                                                    ลองค้นหาด้วยคำค้นอื่น หรือล้างตัวกรอง
                                                </p>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                </Card>
            </div>

            <Modal show={isModalVisible} onClose={() => setIsModalVisible(false)}>
                <Modal.Header>
                    {editingId ? 'แก้ไขการตั้งค่า' : 'เพิ่มการตั้งค่า'}
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="key" value="ชื่อการตั้งค่า" />
                            <TextInput
                                id="key"
                                value={data.key}
                                onChange={e => setData({ ...data, key: e.target.value })}
                                color={errors.key ? 'failure' : 'gray'}
                                helperText={errors.key}
                            />
                        </div>

                        <div>
                            <Label htmlFor="value" value="ค่า" />
                            <TextInput
                                id="value"
                                value={data.value}
                                onChange={e => setData({ ...data, value: e.target.value })}
                                color={errors.value ? 'failure' : 'gray'}
                                helperText={errors.value}
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" value="คำอธิบายของการตั้งค่า" />
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={e => setData({ ...data, description: e.target.value })}
                                color={errors.description ? 'failure' : 'gray'}
                                helperText={errors.description}
                            />
                        </div>

                        <div>
                            <Label htmlFor="type" value="ประเภทการตั้งค่า" />
                            <Select
                                id="type"
                                value={data.type}
                                onChange={e => setData({ ...data, type: e.target.value })}
                                color={errors.type ? 'failure' : 'gray'}
                            >
                                {Object.entries(types).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="comment" value="คำอธิบายข้อควรระวัง" />
                            <Textarea
                                id="comment"
                                value={data.comment}
                                onChange={e => setData({ ...data, comment: e.target.value })}
                                color={errors.comment ? 'failure' : 'gray'}
                                helperText={errors.comment}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" onClick={handleSubmit}>
                        {editingId ? 'อัพเดท' : 'บันทึก'}
                    </Button>
                    <Button color="gray" onClick={() => setIsModalVisible(false)}>
                        ยกเลิก
                    </Button>
                </Modal.Footer>
            </Modal>
        </AuthenticatedLayout>
    );
}
