import React, { useEffect, useState } from 'react'
import Button from '../ui/button/Button'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import Input from '../form/input/InputField'
import { useQuery } from '@tanstack/react-query'
import { GetVarients, UpdateVariants } from '@/lib/product-api'
import { useRouter } from 'next/navigation'

export default function VariantsUpdate({ id, closeModal }: { id: string, closeModal: () => void }) {

    const [quantity, setQauntity] = useState<boolean>(false)
    const [data, setData] = useState<Variants[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // const { isLoading, data } = useQuery({
    //     queryKey: ['variant', id],
    //     queryFn: () => GetVarients(id),
    // })

    useEffect(() => {
        const fatchData = async () => {
            const res = await GetVarients(id);
            if (res) {
                setData(res)
                setIsLoading(false)
            } else {
                setData(null)
                setIsLoading(false)
            }
        }

        fatchData();

    }, [])

    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const variantMap = new Map<number, any>();

        for (const [key, value] of formData.entries()) {
            const match = key.match(/^(\w+)\[(\d+)\]$/);
            if (!match) continue;

            const [, field, indexStr] = match;
            const index = Number(indexStr);

            if (!variantMap.has(index)) {
                variantMap.set(index, {});
            }

            const entry = variantMap.get(index);
            entry[field] = field === 'price' || field === 'quantity' ? Number(value) : value;
        }

        const variants = Array.from(variantMap.values());

        // const transformedData = Object.fromEntries(
        //     Object.entries(filteredData).map(([key, value]) => [key, Array.isArray(value) ? value : [value]])
        // );
        const update = await UpdateVariants(id, { updates: variants })

        if (update) {
            closeModal()
            router.refresh()
        }
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
                                        Quntity
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {data?.map((order, index) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 text-warning-25 overflow-hidden rounded-md">
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
                                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            <Input type="text" name={`price[${index}]`} placeholder="enter price" defaultValue={order.price} />
                                            <input readOnly type='text' name={`id[${index}]`} className='hidden' value={order._id} />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <div className="flex justify-end gap-2">
                                                {quantity &&
                                                    <Input type="text" name="quntity" placeholder="enter Quantity" defaultValue={order?.quntity} />
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
                            Modify
                        </Button>
                    </div>
                </form>
            </div>
    )
}
