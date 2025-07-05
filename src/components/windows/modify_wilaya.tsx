import { ModyTarif } from '@/lib/wilaya-api';
import { ArrowRight, MapPinHouse, X } from 'lucide-react';
import React from 'react'
import { toast } from 'react-toastify';

interface OrderConfirmationModalProps {
    onClose: () => void;
    // handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    refresh: () => void;
    tarif: Wilaya;
}

export default function ModyTarifModal({ onClose, refresh, tarif }: OrderConfirmationModalProps) {

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)
        const formObject = Object.fromEntries(formData.entries())

        // const nom = formData.get("nom") as string;
        // const wilaya_depart_id = Number(formData.get("wilaya_depart_id")) as number;

        // Use formData instead of data for validation
        const isInvalid = Object.keys(formObject).some((field) =>
            !formObject[field as keyof typeof formObject]
        );

        // const isUsernameInvalid = (formData.get('username') as string).length < 6;

        if (isInvalid) {
            // Display a simple error message if validation fails
            toast.error("tout les Champs droit remplire obligatoire", {
                position: "bottom-right",   // or "bottom-right", whatever you prefer
                autoClose: 1500,          // 1.5 seconds (optional, adjust as you like)
                hideProgressBar: true,    // optional
                pauseOnHover: false,
                draggable: false,
                theme: "colored",
            })
            return;
        }

        const wilaya = {
            id: tarif._id,
            prix_domicile: Number(formData.get(`price_1_${tarif._id}`)),
            prix_sd: Number(formData.get(`price_2_${tarif._id}`)),
        };

        // console.log("aaaahhhhh", finalData)



        const result = await ModyTarif(wilaya);

        if (result) {
            onClose();
            refresh();
        }
    };

    return (
        <div className="fixed inset-0 z-9998 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 m-4 z-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold dark:text-white flex items-center gap-3">Modifie Tarification <MapPinHouse size={35} /></h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-5 dark:text-gray-300 ">
                    <div className="max-h-[500px] overflow-auto p-1 grid md:grid-cols-2 grid-cols-1 gap-2 scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-transparent">
                        <div className="col-span-full gap-2 grid sm:grid-cols-2 grid-cols-1 sm:items-center">
                            <div className="">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                                    Wilaya Envoi<span className='text-red-600'>*</span>
                                </label>
                                <span className='flex gap-2'>
                                    <p>{tarif.code_send} - {tarif.name_send}</p>
                                    <p><ArrowRight /></p>
                                    <p>{tarif.code_recieve} - {tarif.name_recieve}</p>
                                </span>
                            </div>
                        </div>
                        <div className="col-span-full grid grid-cols-2 gap-2">
                            <div>
                                <label htmlFor={`price_1_${tarif._id}`} className="block text-sm font-medium mb-1">
                                    Stop Desk
                                </label>
                                <input
                                    type="text"
                                    id={`price_1_${tarif._id}`}
                                    name={`price_1_${tarif._id}`}
                                    // value={}
                                    // onChange={}
                                    required
                                    className="w-full dark:bg-black/20 border border-neutral-700 rounded-lg px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primer/50 focus:border-primer/50 transition-colors"
                                    placeholder="Stop desk prix"
                                    defaultValue={tarif.prix_sd}
                                />
                            </div>
                            <div>
                                <label htmlFor={`price_2_${tarif._id}`} className="block text-sm font-medium mb-1">
                                    A Domicile
                                </label>
                                <input
                                    type="text"
                                    id={`price_2_${tarif._id}`}
                                    name={`price_2_${tarif._id}`}
                                    // value={}
                                    // onChange={}
                                    required
                                    className="w-full dark:bg-black/20 border border-neutral-700 rounded-lg px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primer/50 focus:border-primer/50 transition-colors"
                                    placeholder="a domicile prix"
                                    defaultValue={tarif.prix_domicile}
                                />
                            </div>
                        </div>
                    </div>


                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors duration-200"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-primer hover:bg-blue-500/90 font-medium rounded-lg transition-colors duration-200 hover:text-white"
                        >
                            Modifie
                        </button>
                    </div>
                </form>
            </div >
        </div >
    )
}
