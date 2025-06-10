"use client"

import { Wilaya } from "@/lib/tools/cities";
import type React from "react"

import { X, MapPinHouse } from "lucide-react"
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Select, { ActionMeta, OnChangeValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { AddTarif } from "@/lib/wilaya-api";
// import { AddTarif } from "@/lib/money_api/tarification";

interface OrderConfirmationModalProps {
    onClose: () => void;
    // handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    refresh: () => void;
}

const animatedComponents = makeAnimated();

export default function AddTarifModal({ onClose, refresh }: OrderConfirmationModalProps) {

    const [city, setCity] = useState<number | null>(null)
    const [tarif, setTarif] = useState<{ wilaya: string; code: number; }[]>([])

    // const router = useRouter()
    // const [formData, setFormData] = useState<OrderFormData>({
    //     fullName: "",
    //     phoneNumber: "",
    //     address: "",
    //     notes: "",
    // })
    // const taille = ["M", "L", "XL", "XXL"];

    // const type = ["livraison", "pickup", "echange", "recouvrement"];

    function findCityByCode(code: number) {
        const city = Wilaya.find(c => c.code === code);
        return city ? city.name : '';
    }


    const wilayaOptions = Wilaya.map(pre => ({
        value: pre.name,
        label: pre.name,
        code: pre.code
    }));

    const onChange = (
        newValue: OnChangeValue<{ value: string; label: string; code: number }, true>,
        actionMeta: ActionMeta<{ value: string; label: string; code: number }>
    ) => {
        switch (actionMeta.action) {
            case 'remove-value':
            case 'pop-value':
                if (actionMeta.removedValue.value) {
                    newValue = newValue.filter(
                        (v) => v.code !== actionMeta.removedValue?.code
                    );
                }
                break;
            case 'clear':
                newValue = [];
                break;
        }

        setTarif([...newValue.map(item => ({ wilaya: item.value, code: item.code }))]);
    };


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

        const wilayas = tarif.map((wilaya) => ({
            name_recieve: wilaya.wilaya,
            code_recieve: wilaya.code,
            prix_domicile: Number(formData.get(`price_1_${wilaya.code}`)),
            prix_sd: Number(formData.get(`price_2_${wilaya.code}`)),
        }));

        const finalData = {
            wilayas,
        };

        console.log("aaaahhhhh", finalData)



        const result = await AddTarif(finalData);

        if (result) {
            onClose();
            refresh();
        }
    };

    // const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     const formData = new FormData(event.currentTarget);

    //     const nom = formData.get("nom") as string;
    //     const code_wilaya = Number(formData.get("code_wilaya"));

    //     const tarif = selectedWilayas.map((wilaya) => ({
    //       wilaya: wilaya.value,
    //       code: wilaya.code,
    //       price_livreur: Number(formData.get(`price_livreur_${wilaya.code}`)),
    //       price_client: Number(formData.get(`price_client_${wilaya.code}`)),
    //     }));

    //     const finalData = {
    //       nom,
    //       code_wilaya,
    //       tarif,
    //     };

    //     console.log("Data to send:", finalData);

    //     const result = await AddCommune(finalData);
    //     if (result) {
    //       onClose();
    //       router.refresh();
    //     }
    //   };

    // console.log(tarif)

    return (
        <div className="fixed inset-0 z-9998 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 m-4 z-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold dark:text-white flex items-center gap-3">Ajouter Tarification <MapPinHouse size={35} /></h2>
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
                                <select
                                    onChange={(e) => setCity(Number(e.target.value))}
                                    name="wilaya_depart_id"
                                    className="w-full scrollbar-thin scrollbar-thumb-gray-700 dark:bg-gray-800 border border-neutral-700 rounded-lg px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primer/50 focus:border-primer/50 transition-colors"
                                >
                                    <option value="">Selectioné wilaya</option>
                                    {Wilaya.map((pre, index) => pre.code === 13 && (
                                        <option key={index} value={pre.code} >{pre.code} - {pre.name}</option>
                                    ))

                                    }
                                </select>
                            </div>
                            {/* <div>
                                <label htmlFor="nom" className="block text-sm font-medium mb-1">
                                    Nom <span className='text-red-600'>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    // value={}
                                    // onChange={}
                                    required
                                    className="w-full dark:bg-black/20 border border-neutral-700 rounded-lg px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primer/50 focus:border-primer/50 transition-colors"
                                    placeholder="Entre la Nom"
                                />
                            </div> */}
                        </div>

                        <Select
                            className="absolute z-50 col-span-full text-sm text-black"
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            // defaultValue={tarif}
                            isMulti
                            options={wilayaOptions}
                            onChange={onChange}
                        />

                        <div className="col-span-full flex flex-col justify-center items-center rounded-lg border p-1 min-h-[355px]">
                            {tarif.length > 0 ?
                                tarif.map((pre, index) => (
                                    <div key={index} className="w-full p-1">
                                        <label htmlFor={`price_1_${pre.code}`} className="block text-sm font-medium mb-1">
                                            {pre.wilaya} <span className='text-red-600'>*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <input
                                                    type="text"
                                                    id={`price_1_${pre.code}`}
                                                    name={`price_1_${pre.code}`}
                                                    // value={}
                                                    // onChange={}
                                                    required
                                                    className="w-full dark:bg-black/20 border border-neutral-700 rounded-lg px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primer/50 focus:border-primer/50 transition-colors"
                                                    placeholder="Stop desk prix"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    id={`price_2_${pre.code}`}
                                                    name={`price_2_${pre.code}`}
                                                    // value={}
                                                    // onChange={}
                                                    required
                                                    className="w-full dark:bg-black/20 border border-neutral-700 rounded-lg px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primer/50 focus:border-primer/50 transition-colors"
                                                    placeholder="a domicile prix"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                                :
                                <p className="">Sélectioné wilaya</p>
                            }
                        </div>

                        {/* <div>
                            <label htmlFor="commune" className="block text-sm font-medium mb-1">
                                code Postal <span className='text-red-600'>*</span>
                            </label>
                            <input
                                type="text"
                                id="commune"
                                name="code_postal"
                                // value={}
                                // onChange={}
                                required
                                className="w-full dark:bg-black/20 border border-neutral-700 rounded-lg px-4 py-2.5 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primer/50 focus:border-primer/50 transition-colors"
                                placeholder="Entre la commune"
                            />
                        </div> */}


                    </div>
                    <input readOnly name="nom" className="hidden" value={city !== null ? String(findCityByCode(city)) : ''} />


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
                            Ajouté
                        </button>
                    </div>
                </form>
            </div >
        </div >
    )
}