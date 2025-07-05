"use client"

import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import AddProduct from "../windows/add-product";
import { Pencil, Trash2, DollarSign } from "lucide-react"
// import { useRouter } from "next/navigation";

// import Badge from "../ui/badge/Badge";
import Image from "next/image";
import DeleteReminder from "../windows/delete_reminder";
import { UpdateProduct } from "@/lib/product-api";
import { useRouter } from "next/navigation";
import UpdateProducts from "@/components/windows/update-product"
import VariantsUpdate from "../windows/update_variants";

export default function ProductTable({ product }: { product: Products[] }) {

    const { isOpen, openModal, closeModal } = useModal();

    const router = useRouter()

    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean
        productId: string | null
        productName: string
    }>({
        isOpen: false,
        productId: null,
        productName: "",
    })

    const [addProduct, setAddProduct] = useState<boolean>(false)
    const [update, setUpdate] = useState<string | null>(null)
    const [variants, setVariants] = useState<string | null>(null)

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

    const openUpdate = (id: string) => {
        setUpdate(id);
        openModal();
    }

    const closeAll = () => {
        closeModal();
        setUpdate(null);
        setVariants(null);
        setAddProduct(false);
    }

    // console.log(product)
    // console.log(update)

    const handleDelete = async (id: string) => {

        const res = await UpdateProduct(id, { available: false })
        if (res) {
            router.refresh()
            closeDeleteConfirmation()
        }
    }

    // const handleModify = (id: string) => {
    //     console.log(`Modify product with id: ${id}`)
    // }

    // const modalContentKey = update
    //     ? `update-${update}`
    //     : variants
    //         ? `variant-${variants}`
    //         : 'add';


    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <button
                onClick={() => { setAddProduct(true); openModal(); }}
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
                                    Product
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Description
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Category
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Price
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                                >
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {product.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 overflow-hidden rounded-md">
                                                <Image
                                                    src={`${process.env.SERVER_DOMAIN}${order.primaryImage}`}
                                                    alt={order.title}
                                                    width={50} height={50}
                                                    className='h-full object-cover'
                                                />
                                            </div>
                                            <div>
                                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 text-nowrap max-w-36 overflow-hidden">
                                                    {order.title}
                                                </span>
                                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                                    exmple
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 mt-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-sm line-clamp-2">
                                        {order.description}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
                                        {order.category}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {/* <Badge
                                            size="sm"
                                            color={
                                                order.status === "Active"
                                                    ? "success"
                                                    : order.status === "Pending"
                                                        ? "warning"
                                                        : "error"
                                            }
                                        >
                                            {order.status}
                                        </Badge> */}
                                        {order.lowPrice}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => { setVariants(order._id); openModal() }}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-yellow-600 p-1 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-yellow-500 focus:ring-offset-2"
                                            >
                                                <DollarSign className="h-4 w-4" />
                                                {/* <span className="sr-only">Delete {product.name}</span> */}
                                            </button>
                                            <button
                                                onClick={() => openUpdate(order._id)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md p-1 text-sm font-medium text-white bg-brand-500 shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                {/* <span className="sr-only">Edit {product.name}</span> */}
                                            </button>
                                            <button
                                                onClick={() => openDeleteConfirmation(order._id, order.title)}
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
            <Modal
                isOpen={isOpen} onClose={closeAll}
                className="max-w-[700px] mt-20 lg:mt-0 m-4">
                {update && <UpdateProducts id={update} closeModal={closeAll} />}
                {variants && <VariantsUpdate id={variants} closeModal={closeAll} />}
                {addProduct && <AddProduct closeModal={closeAll} />}
            </Modal>
            {deleteConfirmation.isOpen &&
                <DeleteReminder closeDelet={closeDeleteConfirmation} handleDelete={handleDelete} deleteConfirmation={deleteConfirmation} />
            }
        </div>
    );
}