import React from "react";
import { Table } from "flowbite-react";

export default function ConsumableLotDetail({ lot }) {
    if (!lot) return null;

    const formatNumber = (number) => {
        return number ? number.toLocaleString() : '0';
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <Table hoverable>
                    <Table.Head>
                        <Table.HeadCell className="bg-gray-50">
                            วัตถุดิบสิ้นเปลือง
                        </Table.HeadCell>
                        <Table.HeadCell className="bg-gray-50">
                            ยี่ห้อ
                        </Table.HeadCell>
                        <Table.HeadCell className="bg-gray-50">
                            จำนวน
                        </Table.HeadCell>
                        <Table.HeadCell className="bg-gray-50">
                            ราคาต่อหน่วย
                        </Table.HeadCell>
                        <Table.HeadCell className="bg-gray-50">
                            จำนวนต่อแพค
                        </Table.HeadCell>
                        <Table.HeadCell className="bg-gray-50">
                            ราคา(แพคเกจจิ้ง)
                        </Table.HeadCell>
                        <Table.HeadCell className="bg-gray-50">
                            ผู้จำหน่าย
                        </Table.HeadCell>
                        <Table.HeadCell className="bg-gray-50">
                            หมายเหตุ
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {lot.details?.map((detail) => (
                            <Table.Row
                                key={detail.id}
                                className="bg-white hover:bg-gray-50"
                            >
                                <Table.Cell>
                                    <div className="font-medium text-gray-900">
                                        {detail.consumable?.name || '-'}
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="font-medium text-gray-900">
                                        {detail.transformer?.name || '-'}
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="font-medium">
                                        {formatNumber(detail.quantity * detail.per_pack)}{" "}
                                        {detail.consumable?.unit || '-'}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="font-medium">
                                        ฿{formatNumber(detail.cost_per_unit)}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="font-medium">
                                        {formatNumber(detail.per_pack)}{" "}
                                        {detail.consumable?.unit || '-'}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="font-medium">
                                        ฿{formatNumber(detail.price)}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    {detail.supplier || '-'}
                                </Table.Cell>
                                <Table.Cell>
                                    {detail.note || '-'}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            {lot.note && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600">
                        <strong>หมายเหตุ Lot:</strong> {lot.note}
                    </p>
                </div>
            )}
        </div>
    );
}
