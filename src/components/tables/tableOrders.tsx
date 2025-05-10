"use client"

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { FormatDate } from "@/lib/tools/tool";
import { Info } from "lucide-react"
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";
import OrderInfo from "../windows/order_info";
import { getAllOrders } from "@/lib/orders-api";

const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = ""
  let textColor = ""
  let text = ""

  switch (status) {
    case "livre":
      bgColor = "bg-green-100 dark:bg-green-900/30"
      textColor = "text-green-800 dark:text-green-300"
      text = "Livré"
      break
    case "en_transit":
      bgColor = "bg-blue-100 dark:bg-blue-900/30"
      textColor = "text-blue-800 dark:text-blue-300"
      text = "En transit"
      break
    case "En attente":
      bgColor = "bg-yellow-100 dark:bg-yellow-900/30"
      textColor = "text-yellow-800 dark:text-yellow-300"
      text = "En attent"
      break
    case "en_ramassage":
      bgColor = "bg-purple-100 dark:bg-purple-900/30"
      textColor = "text-purple-800 dark:text-purple-300"
      text = "En ramassage"
      break
    case "retourne":
      bgColor = "bg-red-100 dark:bg-red-900/30"
      textColor = "text-red-800 dark:text-red-300"
      text = "Retour"
      break
    case "annule":
      bgColor = "bg-gray-100 dark:bg-gray-900/30"
      textColor = "text-gray-800 dark:text-gray-300"
      text = "Annuler"
      break
    case "enregistré":
      bgColor = "bg-[#9af5f5] dark:bg-[#29e6e6]/30"
      textColor = "text-[#4e8080] dark:text-[#29e6e6]"
      text = "Enregistré"
      break
    default:
      bgColor = "bg-gray-100 dark:bg-gray-700"
      textColor = "text-gray-800 dark:text-gray-300"
  }

  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>{text}</span>
}

export default function BasicTableOne({ orders }: { orders: OrderInfo[] }) {

  const { isOpen, openModal, closeModal } = useModal();
  const [info, setInfo] = useState<OrderInfo | null>(null)
  const [order, setOrder] = useState<OrderInfo[] | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllOrders({ page: "1", number: "", user: "" })

        if (data) {
          setOrder(data.result)
        }
      } catch {
        setOrder(null)
      }
    }
    fetch()
  }, [])

  console.log(order)

  const closeAll = () => {
    closeModal();
    setInfo(null);
  }

  console.log(orders)
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Telephone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Wilaya
                </TableCell>
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
              {order?.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src="/images/placeholder.svg"
                          alt={order.fullname}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.fullname}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          items {order.orders.length}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.phoneNumber}
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
                    {FormatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.wilaya}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setInfo(order); openModal(); }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md p-1 text-sm font-medium text-white bg-brand-500 shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Info className="h-4 w-4" />
                        {/* <span className="sr-only">Edit {product.name}</span> */}
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
        {info && <OrderInfo stat={StatusBadge} colie={info} onClose={closeAll} />}
      </Modal>
    </div>
  );
}
