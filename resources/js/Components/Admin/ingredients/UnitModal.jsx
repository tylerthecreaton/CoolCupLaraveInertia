import { Modal, Table, Button, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { HiPencil, HiTrash, HiOutlineScale } from "react-icons/hi";
import Swal from "sweetalert2";

export default function UnitModal({ isOpen, setIsOpen, onEdit }) {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchUnits();
        }
    }, [isOpen]);

    const fetchUnits = async () => {
        try {
            const response = await axios.get(route('admin.units.index'));
            setUnits(response.data.units);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching units:', error);
            setLoading(false);
            Swal.fire({
                title: "เกิดข้อผิดพลาด!",
                text: "ไม่สามารถโหลดข้อมูลหน่วยวัดได้",
                icon: "error",
            });
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleEdit = (unit) => {
        onEdit(unit);
        handleClose();
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
                // Implementation coming soon
                Swal.fire({
                    title: "Coming Soon",
                    text: "ฟังก์ชันนี้กำลังอยู่ในระหว่างการพัฒนา",
                    icon: "info",
                });
            }
        });
    };

    return (
        <Modal show={isOpen} onClose={handleClose} size="xl">
            <Modal.Header className="border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <HiOutlineScale className="w-6 h-6 text-gray-600" />
                    <span>หน่วยวัดทั้งหมด</span>
                </div>
            </Modal.Header>
            <Modal.Body className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center space-y-3">
                            <Spinner size="xl" />
                            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                        </div>
                    </div>
                ) : units.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="space-y-3">
                            <HiOutlineScale className="w-12 h-12 text-gray-400 mx-auto" />
                            <p className="text-gray-500">ไม่พบข้อมูลหน่วยวัด</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell className="text-center bg-gray-50">ลำดับ</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">ชื่อหน่วยวัด</Table.HeadCell>
                                <Table.HeadCell className="bg-gray-50">ชื่อย่อ</Table.HeadCell>
                                <Table.HeadCell className="text-center bg-gray-50">จัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {units.map((unit, index) => (
                                    <Table.Row key={unit.id} className="bg-white hover:bg-gray-50">
                                        <Table.Cell className="text-center font-medium text-gray-900 w-24">
                                            {index + 1}
                                        </Table.Cell>
                                        <Table.Cell className="font-medium">
                                            {unit.name}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {unit.abbreviation || '-'}
                                        </Table.Cell>
                                        <Table.Cell className="w-32">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                    onClick={() => handleEdit(unit)}
                                                    title="แก้ไข"
                                                >
                                                    <HiPencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                    onClick={() => handleDelete(unit.id)}
                                                    title="ลบ"
                                                >
                                                    <HiTrash className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer className="border-t border-gray-200">
                <Button color="gray" onClick={handleClose}>
                    ปิด
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
