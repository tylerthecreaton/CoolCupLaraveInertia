import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Label, TextInput, Textarea, Select, Card } from 'flowbite-react';
import InputError from '@/Components/InputError';

export default function Create({ auth, ingredients, consumables }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        ingredient_id: '',
        consumable_id: '',
        multiplier: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.transformers.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Transformer" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Create New Transformer
                        </h5>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="name" value="Name" />
                                </div>
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    color={errors.name ? "failure" : "gray"}
                                    helperText={errors.name}
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="description" value="Description" />
                                </div>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    color={errors.description ? "failure" : "gray"}
                                    helperText={errors.description}
                                    rows={4}
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="ingredient_id" value="Ingredient Lot" />
                                </div>
                                <Select
                                    id="ingredient_id"
                                    value={data.ingredient_id}
                                    onChange={e => setData('ingredient_id', e.target.value)}
                                    color={errors.ingredient_id ? "failure" : "gray"}
                                    helperText={errors.ingredient_id}
                                >
                                    <option value="">Select ingredient</option>
                                    {ingredients?.map((ingredient) => (
                                        <option key={ingredient.id} value={ingredient.id}>
                                            {ingredient.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="consumable_id" value="Consumable Lot" />
                                </div>
                                <Select
                                    id="consumable_id"
                                    value={data.consumable_id}
                                    onChange={e => setData('consumable_id', e.target.value)}
                                    color={errors.consumable_id ? "failure" : "gray"}
                                    helperText={errors.consumable_id}
                                >
                                    <option value="">Select consumable</option>
                                    {consumables?.map((consumable) => (
                                        <option key={consumable.id} value={consumable.id}>
                                            {consumable.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="multiplier" value="Multiplier" />
                                </div>
                                <TextInput
                                    id="multiplier"
                                    type="number"
                                    step="0.01"
                                    value={data.multiplier}
                                    onChange={e => setData('multiplier', e.target.value)}
                                    color={errors.multiplier ? "failure" : "gray"}
                                    helperText={errors.multiplier}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button
                                    color="gray"
                                    onClick={() => window.history.back()}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Create Transformer
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
