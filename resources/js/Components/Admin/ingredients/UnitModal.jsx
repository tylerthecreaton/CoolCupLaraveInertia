import { Modal, Table, Button, Spinner, Select } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { HiPencil, HiTrash, HiOutlineScale, HiFilter } from "react-icons/hi";
import Swal from "sweetalert2";

export default function UnitModal({ isOpen, setIsOpen, onEdit }) {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState("all");

    const filteredUnits = units.filter(unit =>
        selectedType === "all" ? true : unit.type === selectedType
    );

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
                Swal.fire({
                    title: "Coming Soon",
                    text: "ฟังก์ชันนี้กำลังอยู่ในระหว่างการพัฒนา",
                    icon: "info",
                });
            }
        });
    };

    const getUnitTypeColor = (type) => {
        return type === 'ingredient'
            ? 'bg-blue-100 text-blue-800 border-blue-400'
            : 'bg-purple-100 text-purple-800 border-purple-400';
    };

    const getUnitTypeText = (type) => {
        return type === 'ingredient' ? 'วัตถุดิบ' : 'วัตถุดิบสิ้นเปลือง';
    };

    return (
        <Modal show={isOpen} onClose={handleClose} size="2xl">
            <Modal.Header className="border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <HiOutlineScale className="w-6 h-6 text-gray-600" />
                    <span className="text-xl font-semibold text-gray-900">หน่วยวัดทั้งหมด</span>
                </div>
            </Modal.Header>
            <Modal.Body className="space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center space-y-3">
                            <Spinner size="xl" />
                            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
                        </div>
                    </div>
                ) : units.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="space-y-3">
                            <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
                                <HiOutlineScale className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">ไม่พบข้อมูลหน่วยวัด</h3>
                            <p className="text-gray-500 text-sm">เริ่มต้นโดยการเพิ่มหน่วยวัดใหม่</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <HiFilter className="w-5 h-5" />
                                <span className="text-sm font-medium">กรองตามประเภท:</span>
                            </div>
                            <div className="w-64">
                                <Select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="bg-white"
                                >
                                    <option value="all">ทั้งหมด ({units.length})</option>
                                    <option value="ingredient">
                                        วัตถุดิบ ({units.filter(u => u.type === 'ingredient').length})
                                    </option>
                                    <option value="consumable">
                                        วัตถุดิบสิ้นเปลือง ({units.filter(u => u.type === 'consumable').length})
                                    </option>
                                </Select>
                            </div>
                        </div>

                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell className="text-center bg-gray-50 w-16">ลำดับ</Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">ชื่อหน่วยวัด</Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">ชื่อย่อ</Table.HeadCell>
                                    <Table.HeadCell className="bg-gray-50">ประเภท</Table.HeadCell>
                                    <Table.HeadCell className="text-center bg-gray-50 w-24">จัดการ</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {filteredUnits.map((unit, index) => (
                                        <Table.Row key={unit.id} className="bg-white hover:bg-gray-50">
                                            <Table.Cell className="text-center font-medium text-gray-900">
                                                {index + 1}
                                            </Table.Cell>
                                            <Table.Cell className="font-medium text-gray-900">
                                                {unit.name}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {unit.abbreviation || '-'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getUnitTypeColor(unit.type)}`}>
                                                    {getUnitTypeText(unit.type)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
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
                    </>
                )}
            </Modal.Body>
            <Modal.Footer className="border-t border-gray-200">
                <div className="w-full flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        แสดง {filteredUnits.length} จาก {units.length} รายการ
                    </div>
                    <Button color="gray" onClick={handleClose}>
                        ปิด
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
