"use client"

import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
// import Image from 'next/image'
import { useQuery } from '@tanstack/react-query';
import { DeleteTarif, GetWilayas } from '@/lib/wilaya-api';
import { Pencil, Trash2 } from 'lucide-react';
import LoadingFirst from '../options/loading';
import AddTarifModal from '../windows/add_tarification';
import ModyTarifModal from '../windows/modify_wilaya'
import DeleteReminder from '../windows/delete_reminder';

export default function WilayaTax({ page, wilaya }: { page: string, wilaya: string }) {

    const [addWilaya, setAddWilaya] = useState<boolean>(false)
    const [modyWilaya, setModyWilaya] = useState<Wilaya | null>(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean
        productId: string | null
        productName: string
    }>({
        isOpen: false,
        productId: null,
        productName: "",
    })

    const openDeleteConfirmation = (id: string, name: string) => {
        setDeleteConfirmation({
            isOpen: true,
            productId: id,
            productName: name,
        })
    }
    const closeDeleteConfirmation = () => {
        setDeleteConfirmation({
            isOpen: false,
            productId: null,
            productName: "",
        })
    }

    const { isLoading, data, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: () => GetWilayas({ page: page, wilaya: wilaya }),
    })

    const handleDelete = async (id: string) => {

        const res = await DeleteTarif(id)
        if (res) {
            refetch()
            closeDeleteConfirmation()
        }
    }


    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <button
                onClick={() => setAddWilaya(true)}
                type="button"
                className="absolute right-4 top-3.5 flex justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 w-auto"
            >
                + Add Product
            </button>
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Wilaya sender
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Wilaya Recieve
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Prix domicile
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Prix stop desk
                                </TableCell>
                                {/* <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Wilaya
                                </TableCell> */}
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {data?.result?.map((wilaya) => (
                                <TableRow key={wilaya._id}>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {wilaya.name_send}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {wilaya.name_recieve}
                                    </TableCell>
                                    {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"> */}
                                    {/* <div className="flex -space-x-2">
                      {order.team.images.map((teamImage, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                        >
                          <Image
                            width={24}
                            height={24}
                            src={teamImage}
                            alt={`Team member ${index + 1}`}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div> */}

                                    {/* </TableCell> */}
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {wilaya.prix_domicile}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        {wilaya.prix_sd}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setModyWilaya(wilaya)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md p-1 text-sm font-medium text-white bg-brand-500 shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                {/* <span className="sr-only">Edit {product.name}</span> */}
                                            </button>
                                            <button
                                                onClick={() => openDeleteConfirmation(wilaya._id, wilaya.name_send + " to " + wilaya.name_recieve)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-red-600 p-1 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-red-500 focus:ring-offset-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                {/* <span className="sr-only">Delete {product.name}</span> */}
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {/* <Modal
                isOpen={isOpen} onClose={closeAll}
                className="max-w-[700px] mt-20 lg:mt-0 m-4">
                {info && <OrderInfo stat={StatusBadge} colie={info} onClose={closeAll} />}
            </Modal>
            {changeConfirmation.isOpen &&
                <ChangeStationReminder onClose={closeChangeConfirmation} Confirmation={changeConfirmation} refresh={refetch} />
            } */}
            {isLoading &&
                <LoadingFirst />
            }
            {addWilaya &&
                <AddTarifModal onClose={() => setAddWilaya(false)} refresh={refetch} />
            }
            {modyWilaya &&
                <ModyTarifModal onClose={() => setModyWilaya(null)} refresh={refetch} tarif={modyWilaya} />
            }
            {deleteConfirmation.isOpen &&
                <DeleteReminder closeDelet={closeDeleteConfirmation} deleteConfirmation={deleteConfirmation} handleDelete={handleDelete} />
            }
        </div>
    );
}
