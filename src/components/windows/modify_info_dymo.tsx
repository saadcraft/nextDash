import React, { useState } from 'react'
import Button from '../ui/button/Button'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import TextArea from '../form/input/TextArea'
import { updateDynamoinfo } from '@/lib/dynamic'

interface FqaEntry {
    title: string;
    description: string;
    id?: string;
}

interface DataType {
    magasine: FormDataEntryValue | string;
    email: FormDataEntryValue | string;
    phone: FormDataEntryValue | string;
    fqa: FqaEntry[];
    removeFqa: string[];
    [key: string]: unknown;
}

export default function ModifyInfoDymo({ onClose, magasin, refresh }: { onClose: () => void, magasin: DynamicType, refresh: () => void }) {

    const [fqa, setFqa] = useState<number>(magasin.fqa.length || 1)
    const [removeFqa, setRemoveVar] = useState<string[]>([])

    const handleRemoveVar = (num: number, id?: string | null) => {
        if (id) {
            setRemoveVar(pre => [id, ...pre]);
        }
        setFqa(num)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        // Build the main object

        const data: DataType = {
            magasine: formData.get('magasine') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            fqa: [],
            removeFqa
        };

        // Collect all FQA fields
        const fqa: FqaEntry[] = [];
        let i = 0;
        while (formData.has(`fqa[${i}][title]`) || formData.has(`fqa[${i}][description]`)) {
            const title = formData.get(`fqa[${i}][title]`) as string;
            const description = formData.get(`fqa[${i}][description]`) as string;
            const _id = formData.get(`fqa[${i}][_id]`) as string;
            if (title || description) {
                const entry: FqaEntry = { title, description };
                if (_id) entry.id = _id;
                fqa.push(entry);
            }
            i++;
        }
        data.fqa = fqa;

        console.log(data)

        const response = await updateDynamoinfo(magasin._id, data);
        if (response) {
            onClose()
            refresh()
        }
    };

    return (
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Edit Hero section Pictures
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                    Update your details to keep your profile up-to-date.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className='overflow-auto max-h-[500px]'>
                    <div className="col-span-2 lg:col-span-1">
                        <Label>Magasine name</Label>
                        <Input type="text" name='magasine' defaultValue={magasin?.magasine} />
                    </div>

                    <div className='flex flex-col md:flex-row gap-2'>

                        <div className="w-full">
                            <Label>Email Address</Label>
                            <Input type="text" name='email' defaultValue={magasin?.email} />
                        </div>

                        <div className="w-full">
                            <Label>Phone</Label>
                            <Input type="text" name='phone' defaultValue={magasin?.phone} />
                        </div>

                    </div>

                    {Array.from({ length: fqa }).map((_, i) => (
                        <div key={i} className="col-span-full gap-2 mt-2 grid lg:grid-cols-3 grid-cols-2 gap-x-4 rounded-xl border border-gray-500 p-2">
                            <div>
                                <Label>Title <span className='text-red-500'>*</span></Label>
                                <Input type="text" name={`fqa[${i}][title]`} placeholder="Enter title" defaultValue={magasin?.fqa?.[i]?.title} />
                            </div>
                            <div className='col-span-full'>
                                <Label>Description <span className='text-red-500'>*</span></Label>
                                <TextArea name={`fqa[${i}][description]`} placeholder='Enter descrption' defaultValue={magasin?.fqa?.[i]?.description} />
                            </div>
                            {magasin?.fqa?.[i]?._id && !removeFqa.includes(magasin.fqa?.[i]?._id) ?
                                <input readOnly className='hidden' name={`fqa[${i}][_id]`} value={magasin?.fqa?.[i]?._id} />
                                :
                                null
                            }
                            {i + 1 == fqa &&
                                <div className='flex gap-3'>
                                    <div className=''>

                                        <span onClick={() => setFqa(i + 2)} className='w-full border px-4 py-2 rounded-xl cursor-pointer text-brand-500 font-bold border-brand-500 hover:bg-brand-500 hover:text-white transition-all'>+</span>
                                    </div>
                                    {fqa > 1 &&

                                        <div className=''>

                                            <span onClick={() => handleRemoveVar(i, magasin.fqa?.[i]?._id)} className='w-full border px-4 py-2 rounded-xl cursor-pointer text-red-500 font-bold border-red-500 hover:bg-red-500 hover:text-white transition-all'>x</span>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button size="sm">
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    )
}
