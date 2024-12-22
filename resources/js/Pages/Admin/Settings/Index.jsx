import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button, Table, Modal, Label, TextInput, Select, Textarea } from 'flowbite-react';
import { HiOutlinePencilAlt, HiOutlineTrash, HiPlus } from 'react-icons/hi';

const Index = ({ settings, types }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        key: '',
        value: '',
        description: '',
        type: 'general',
        comment: ''
    });

    const showModal = (record = null) => {
        if (record) {
            setEditingId(record.id);
            setData(record);
        } else {
            reset();
            setEditingId(null);
        }
        setIsModalVisible(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.settings.update', editingId), {
                onSuccess: () => {
                    setIsModalVisible(false);
                    reset();
                }
            });
        } else {
            post(route('admin.settings.store'), {
                onSuccess: () => {
                    setIsModalVisible(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('คุณแน่ใจหรือไม่ที่จะลบการตั้งค่านี้?')) {
            router.delete(route('admin.settings.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="จัดการการตั้งค่า" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">จัดการการตั้งค่า</h2>
                                <Button onClick={() => showModal()} color="blue">
                                    <HiPlus className="mr-2 h-5 w-5" />
                                    เพิ่มการตั้งค่า
                                </Button>
                            </div>

                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>Key</Table.HeadCell>
                                    <Table.HeadCell>Value</Table.HeadCell>
                                    <Table.HeadCell>Description</Table.HeadCell>
                                    <Table.HeadCell>Type</Table.HeadCell>
                                    <Table.HeadCell>Actions</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {settings.map((setting) => (
                                        <Table.Row key={setting.id} className="bg-white">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                                {setting.key}
                                            </Table.Cell>
                                            <Table.Cell>{setting.value}</Table.Cell>
                                            <Table.Cell>{setting.description}</Table.Cell>
                                            <Table.Cell>{types[setting.type] || setting.type}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex space-x-2">
                                                    <Button color="info" size="sm" onClick={() => showModal(setting)}>
                                                        <HiOutlinePencilAlt className="h-4 w-4" />
                                                    </Button>
                                                    <Button color="failure" size="sm" onClick={() => handleDelete(setting.id)}>
                                                        <HiOutlineTrash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>

                            <Modal show={isModalVisible} onClose={() => setIsModalVisible(false)}>
                                <Modal.Header>
                                    {editingId ? 'แก้ไขการตั้งค่า' : 'เพิ่มการตั้งค่า'}
                                </Modal.Header>
                                <Modal.Body>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <Label htmlFor="key" value="Key" />
                                            <TextInput
                                                id="key"
                                                value={data.key}
                                                onChange={e => setData('key', e.target.value)}
                                                color={errors.key ? 'failure' : 'gray'}
                                                helperText={errors.key}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="value" value="Value" />
                                            <TextInput
                                                id="value"
                                                value={data.value}
                                                onChange={e => setData('value', e.target.value)}
                                                color={errors.value ? 'failure' : 'gray'}
                                                helperText={errors.value}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="description" value="Description" />
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                color={errors.description ? 'failure' : 'gray'}
                                                helperText={errors.description}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="type" value="Type" />
                                            <Select
                                                id="type"
                                                value={data.type}
                                                onChange={e => setData('type', e.target.value)}
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
                                            <Label htmlFor="comment" value="Comment" />
                                            <Textarea
                                                id="comment"
                                                value={data.comment}
                                                onChange={e => setData('comment', e.target.value)}
                                                color={errors.comment ? 'failure' : 'gray'}
                                                helperText={errors.comment}
                                            />
                                        </div>
                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button type="submit" onClick={handleSubmit} disabled={processing}>
                                        {editingId ? 'อัพเดท' : 'บันทึก'}
                                    </Button>
                                    <Button color="gray" onClick={() => setIsModalVisible(false)}>
                                        ยกเลิก
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
