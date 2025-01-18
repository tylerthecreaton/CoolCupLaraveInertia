import React from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';

export default function ConsumableLotForm({ consumable, lot = null, className = '' }) {
    const { data, setData, post, put, processing, errors } = useForm({
        lot_number: lot?.lot_number ?? '',
        quantity: lot?.quantity ?? '',
        remaining_quantity: lot?.remaining_quantity ?? '',
        unit_price: lot?.unit_price ?? '',
        expiry_date: lot?.expiry_date ? new Date(lot.expiry_date).toISOString().split('T')[0] : '',
        note: lot?.note ?? '',
    });

    const submit = (e) => {
        e.preventDefault();

        if (lot) {
            put(route('admin.consumables.lots.update', [consumable.id, lot.id]));
        } else {
            post(route('admin.consumables.lots.store', consumable.id));
        }
    };

    return (
        <form onSubmit={submit} className={className}>
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <InputLabel htmlFor="lot_number" value="Lot Number" />
                    <TextInput
                        id="lot_number"
                        type="text"
                        name="lot_number"
                        value={data.lot_number}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('lot_number', e.target.value)}
                    />
                    <InputError message={errors.lot_number} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="quantity" value={`จำนวน (${consumable.unit})`} />
                    <TextInput
                        id="quantity"
                        type="number"
                        name="quantity"
                        value={data.quantity}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('quantity', e.target.value)}
                        step="0.01"
                    />
                    <InputError message={errors.quantity} className="mt-2" />
                </div>

                {lot && (
                    <div>
                        <InputLabel htmlFor="remaining_quantity" value={`จำนวนคงเหลือ (${consumable.unit})`} />
                        <TextInput
                            id="remaining_quantity"
                            type="number"
                            name="remaining_quantity"
                            value={data.remaining_quantity}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('remaining_quantity', e.target.value)}
                            step="0.01"
                        />
                        <InputError message={errors.remaining_quantity} className="mt-2" />
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="unit_price" value="ราคาต่อหน่วย (บาท)" />
                    <TextInput
                        id="unit_price"
                        type="number"
                        name="unit_price"
                        value={data.unit_price}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('unit_price', e.target.value)}
                        step="0.01"
                    />
                    <InputError message={errors.unit_price} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="expiry_date" value="วันหมดอายุ" />
                    <TextInput
                        id="expiry_date"
                        type="date"
                        name="expiry_date"
                        value={data.expiry_date}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('expiry_date', e.target.value)}
                    />
                    <InputError message={errors.expiry_date} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="note" value="หมายเหตุ" />
                    <textarea
                        id="note"
                        name="note"
                        value={data.note}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        onChange={(e) => setData('note', e.target.value)}
                        rows="3"
                    />
                    <InputError message={errors.note} className="mt-2" />
                </div>

                <div className="flex items-center justify-end">
                    <Button
                        disabled={processing}
                    >
                        {lot ? 'อัพเดท' : 'บันทึก'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
