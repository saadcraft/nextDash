import React, { useEffect, useState } from 'react'
import Button from '../ui/button/Button'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import Input from '../form/input/InputField'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GetVarients, UpdateVariants } from '@/lib/product-api'
import { useRouter } from 'next/navigation'

export default function VariantsUpdate({ id, closeModal }: { id: string, closeModal: () => void }) {

    const queryClient = useQueryClient()
    const [quantity, setQauntity] = useState<boolean>(false)
    // const [data, setData] = useState<Variants[] | null>(null)
    // const [isLoading, setIsLoading] = useState<boolean>(true)
    const router = useRouter()

    const { isLoading, data } = useQuery({
        queryKey: ['variant', id],
        queryFn: () => GetVarients(id),
    })

    useEffect(() => {
        if (data) {
            const hasQuantity = data.some((variant) => 'quantity' in variant || 'quntity' in variant);
            setQauntity(hasQuantity);
        }
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: (variants: Variants[]) => UpdateVariants(id, { updates: variants, removeAttribut: !quantity }),
        onSuccess: (updatedData: Variants[]) => {
            // Option 1: Refetch
            // queryClient.invalidateQueries(['variant', id]);

            // Option 2: Directly update cache
            queryClient.setQueryData(['variant', id], (old: Variants[]) => {
                return old.map((variant: Variants) => {
                    const updated = updatedData.find((v: Variants) => v._id === variant._id)
                    return updated || variant
                })
            })

            closeModal()
            router.refresh()
        },
    })


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const variantMap = new Map<number, Variants>();

        for (const [key, value] of formData.entries()) {
            const match = key.match(/^(\w+)\[(\d+)\]$/);
            if (!match) continue;

            const [, field, indexStr] = match;
            const index = Number(indexStr);

            if (!variantMap.has(index)) {
                variantMap.set(index, {} as Variants);
            }

            const entry = variantMap.get(index)!;
            entry[field] = field === 'price' || field === 'quntity' ? Number(value) : value.toString();
        }

        const updates = Array.from(variantMap.values());
        updateMutation.mutate(updates)
    }



    return (
        isLoading ?
            <div className='flex justify-center items-center'>
                loading ...
            </div>
            :

            <div className="no-scrollbar relative w-full max-w-[700px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Modify Variants
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Modify products to refresh the website
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        ID
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        sku
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Price
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        <div className='flex gap-1 items-center justify-end'>
                                            Quntity
                                            {quantity ?
                                                <span onClick={() => setQauntity(false)} className='font-bold text-red-500 border px-1.5 border-red-500 rounded-full cursor-pointer'>-</span>
                                                :
                                                <span onClick={() => setQauntity(true)} className='font-bold text-green-500 border px-1.5 border-green-500 rounded-full cursor-pointer'>+</span>
                                            }
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {data?.map((order, index) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 dark:text-warning-25 overflow-hidden rounded-md">
                                                    {index + 1}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 text-nowrap max-w-36 overflow-hidden">
                                                    {order.sku}
                                                </span>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    {Object.entries(order.options).map(([key, value]) => `${key}: ${value}`).join(' - ')}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 min-w-32 text-start text-theme-sm dark:text-gray-400">
                                            <Input type="text" name={`price[${index}]`} placeholder="enter price" defaultValue={order.price} />
                                            <input readOnly type='text' name={`id[${index}]`} className='hidden' value={order._id} />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 min-w-32 text-theme-sm dark:text-gray-400">
                                            <div className="flex justify-end gap-2">
                                                {quantity &&
                                                    <Input type="text" name={`quntity[${index}]`} placeholder="enter Quantity" defaultValue={order?.quntity} />
                                                }
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={closeModal}>
                            Close
                        </Button>
                        <Button size="sm">
                            {updateMutation.isPending ? 'Saving...' : 'Modify'}
                        </Button>
                    </div>
                </form>
            </div>
    )
}
