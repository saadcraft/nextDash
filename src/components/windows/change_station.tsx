import React from 'react'
import { AlertTriangle } from "lucide-react"
import { updateOrder } from '@/lib/orders-api'
import { useQueryClient } from "@tanstack/react-query";

export default function ChangeStationReminder({ onClose, Confirmation, refresh }:
    {
        onClose: () => void,
        Confirmation: {
            isOpen: boolean
            OrderId: string | null
            OrderName: string
            station: string
        },
        refresh: () => void
    }) {

    const queryClient = useQueryClient();

    const submite = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)
        const formObject = Object.fromEntries(formData.entries())

        formObject.id = Confirmation.OrderId!
        formObject.status = Confirmation.station

        const send = await updateOrder(formObject)

        if (send) {
            refresh()
            queryClient.invalidateQueries({ queryKey: ["notification"] })
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-9999" aria-modal="true" role="dialog">
            <div className="fixed inset-0 bg-gray-700/60 z-9998" aria-hidden="true" onClick={onClose}></div>

            {/* Modal dialog */}
            <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 z-9999">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 overflow-hidden">
                    <form onSubmit={submite} className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <AlertTriangle className="h-6 w-6" />
                            <h3 className="text-lg font-medium">Confirm Change status</h3>
                        </div>

                        <p className="text-gray-700 mb-6">
                            Are you sure you want to {Confirmation.station === "Retour" ?
                                "Return" : Confirmation.station === "Annulé" ?
                                    "cancel" : Confirmation.station === "Accepté" ?
                                        "Accept" : Confirmation.station === "Livré" ?
                                            "Confirme" : "Deliver"} order of .{" "}
                            <span className="font-semibold">{Confirmation.OrderName}</span>? This action cannot be undone.
                        </p>

                        {Confirmation.station === "En route" &&
                            <div className='flex gap-3 items-center mb-3'>
                                <label>Tracking</label>
                                <input type="text" name="tracking" placeholder='Entre The tracking' className='w-full rounded-md p-1 border-2' required />
                            </div>
                        }

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                No
                            </button>
                            <button
                                // onClick={() => deleteConfirmation.productId && handleDelete(deleteConfirmation.productId)}
                                className={`px-4 py-2 rounded-md border border-transparent text-white ${Confirmation.station === "Annulé" || Confirmation.station === "Retour" ? "bg-red-600  hover:bg-red-700 focus:ring-red-500" : "bg-blue-600  hover:bg-blue-700 focus:ring-blue-500"} focus:outline-none focus:ring-2  focus:ring-offset-2`}
                            >
                                Yes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
