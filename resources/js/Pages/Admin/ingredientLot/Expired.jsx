import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Table, Button, Card, Modal } from "flowbite-react";
import {
    HiOutlineExclamationCircle,
    HiCalendar,
    HiTrash,
} from "react-icons/hi";
import { format } from "date-fns";

const Expired = ({ auth, expired_ingredients }) => {
    const { delete: destroy } = useForm();
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(null);

    const handleDispose = () => {
        if (selectedItem) {
            destroy(route("admin.ingredient-lots.expired.dispose", selectedItem.id), {
                onSuccess: () => {
                    setOpenModal(false);
                },
            });
        }
    };

    // Calculate summary statistics
    const totalExpiredItems = expired_ingredients.length;
    const totalExpiredQuantity = expired_ingredients.reduce(
        (sum, item) => sum + parseFloat(item.quantity),
        0
    );
    const earliestExpiry =
        expired_ingredients.length > 0
            ? format(
                  Math.min(
                      ...expired_ingredients.map(
                          (item) => new Date(item.expiration_date)
                      )
                  ),
                  "dd/MM/yyyy"
              )
            : null;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="จัดการวัตถุดิบหมดอายุ" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        จำนวนรายการที่หมดอายุ
                                    </p>
                                    <h5 className="text-2xl font-bold tracking-tight text-red-600">
                                        {totalExpiredItems} รายการ
                                    </h5>
                                </div>
                                <HiOutlineExclamationCircle className="h-8 w-8 text-red-600" />
                            </div>
                        </Card>
                        <Card>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        ปริมาณรวมที่หมดอายุ
                                    </p>
                                    <h5 className="text-2xl font-bold tracking-tight text-red-600">
                                        {totalExpiredQuantity.toLocaleString()}{" "}
                                        หน่วย
                                    </h5>
                                </div>
                                <HiOutlineExclamationCircle className="h-8 w-8 text-red-600" />
                            </div>
                        </Card>
                        <Card>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        วันหมดอายุที่เก่าที่สุด
                                    </p>
                                    <h5 className="text-2xl font-bold tracking-tight text-red-600">
                                        {earliestExpiry ? (
                                            <>{earliestExpiry}</>
                                        ) : (
                                            <>-</>
                                        )}
                                    </h5>
                                </div>
                                <HiCalendar className="h-8 w-8 text-red-600" />
                            </div>
                        </Card>
                    </div>

                    <Card>
                        <div className="flex items-center mb-4">
                            <HiOutlineExclamationCircle className="h-6 w-6 text-red-600 mr-2" />
                            <h5 className="text-xl font-bold">
                                รายการวัตถุดิบหมดอายุ
                            </h5>
                        </div>

                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>รูปภาพ</Table.HeadCell>
                                <Table.HeadCell>ชื่อวัตถุดิบ</Table.HeadCell>
                                <Table.HeadCell>จำนวน</Table.HeadCell>
                                <Table.HeadCell>วันหมดอายุ</Table.HeadCell>
                                <Table.HeadCell>ผู้บันทึก</Table.HeadCell>
                                <Table.HeadCell>การจัดการ</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                {expired_ingredients.map((item) => (
                                    <Table.Row
                                        key={item.id}
                                        className="bg-white"
                                    >
                                        <Table.Cell>
                                            <img
                                                src={`/storage/ingredients/${item.ingredient.image}`}
                                                alt={item.ingredient.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="font-medium text-gray-900">
                                                {item.ingredient.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {item.notes}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="font-medium">
                                            {parseFloat(
                                                item.quantity
                                            ).toLocaleString()}{" "}
                                            หน่วย
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex items-center text-red-600">
                                                <HiCalendar className="mr-1" />
                                                {format(
                                                    item.expiration_date,
                                                    "dd/MM/yyyy"
                                                )}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {item.user.name}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                color="failure"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                <HiTrash className="mr-2 h-4 w-4" />
                                                จำหน่าย
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </Card>

                    <Modal
                        show={openModal}
                        size="md"
                        popup
                        onClose={() => setOpenModal(false)}
                    >
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600" />
                                <h3 className="mb-5 text-lg font-normal text-gray-500">
                                    คุณแน่ใจหรือไม่ที่จะจำหน่ายวัตถุดิบนี้ออก?
                                    {selectedItem && (
                                        <div className="mt-2 font-medium text-gray-900">
                                            {selectedItem.ingredient.name}
                                            <div className="text-sm">
                                                จำนวน{" "}
                                                {parseFloat(
                                                    selectedItem.quantity
                                                ).toLocaleString()}{" "}
                                                หน่วย
                                            </div>
                                        </div>
                                    )}
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        color="failure"
                                        onClick={handleDispose}
                                    >
                                        ยืนยัน
                                    </Button>
                                    <Button
                                        color="gray"
                                        onClick={() => setOpenModal(false)}
                                    >
                                        ยกเลิก
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Expired;
