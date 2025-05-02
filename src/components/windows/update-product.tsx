import React, { useState } from 'react'
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import { ChevronDownIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import TextArea from '../form/input/TextArea';
import Image from "next/image"
import Button from '../ui/button/Button';
import { TrashBinIcon } from '@/icons';
import { useQuery } from '@tanstack/react-query';
import { getSingleProduct, UpdateProduct } from '@/lib/product-api';

export default function UpdateProducts({ id, closeModal }: { id: string, closeModal: () => void }) {


    const { isLoading, data } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getSingleProduct(id),
    })

    // console.log("here data : ", data);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    // const [variants, setVariats] = useState<number>(1)
    const [removePic, setRemovePic] = useState<string[]>([])
    // const [removeVar, setRemoveVar] = useState<string[]>([])
    const [selected, setSelected] = useState<string | null>(null);

    // const handleRemoveVar = (num: number, id?: string | null) => {
    //     if (id) {
    //         setRemoveVar(pre => [id, ...pre]);
    //     }
    //     setVariats(num)
    // }

    // useEffect(() => {
    //     if (data?.variants?.length) {
    //         setVariats(data.variants.length);
    //     }
    // }, [data]);

    const router = useRouter()

    // console.log("remove picture", removePic)
    // console.log("remove variants", removeVar)

    const options = [
        { value: "foods", label: "Foods" },
        { value: "fétes", label: "Fétes" },
        { value: "médical", label: "Médical" },
        { value: "beauty", label: "Beauty" },
        { value: "sport", label: "Sport" },
        { value: "gaming", label: "Gaming" },
    ];

    const onDrop = (acceptedFiles: File[]) => {
        // console.log("Files dropped:", acceptedFiles);
        setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

    };


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/webp": [],
            "image/svg+xml": [],
        },
    });

    const handleRemoveSelectedPic = (name: string) => {
        setSelectedFiles((prevImages) => prevImages.filter((image) => image.name !== name));
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget); // Get form values

        if (removePic.length > 0) {
            removePic.map((pre, index) => {
                formData.append(`removeImage[${index}]`, pre)
            })
        }

        // if (removeVar.length > 0) {
        //     removeVar.map((pre, index) => {
        //         formData.append(`removeVariant[${index}]`, pre)
        //     })
        // }

        const formObject = Object.fromEntries(formData.entries())

        const filteredData: ProductFormData = Object.fromEntries(
            Object.entries(formObject).filter(([, value]) => value !== "")
        );

        filteredData.images = selectedFiles;

        // console.log(filteredData)

        const response = await UpdateProduct(id, filteredData)
        if (response) {
            closeModal()
            router.refresh()
        }
    };
    return (
        isLoading ?
            <div className='flex justify-center items-center'>
                loading ...
            </div>
            :

            <div className="no-scrollbar relative w-full max-w-[700px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Modify Product
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Modify products to refresh the website
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-2">
                            <div>
                                <Label>Title <span className='text-red-500'>*</span></Label>
                                <Input type="text" name="title" placeholder="enter title" defaultValue={data?.title} />
                            </div>

                            <div>
                                <Label>Category <span className='text-red-500'>*</span></Label>
                                <div className='relative'>
                                    <Select
                                        options={options}
                                        placeholder="Select Category"
                                        className="dark:bg-dark-900"
                                        name='category'
                                        defaultValue={data?.category}
                                    />
                                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                        <ChevronDownIcon />
                                    </span>
                                </div>
                            </div>
                            {/* {Array.from({ length: variants }).map((_, i) => (
                                <div key={i} className="col-span-full grid lg:grid-cols-3 grid-cols-2 gap-x-4 rounded-xl border border-gray-500 p-2">
                                    <div>
                                        <Label>Price <span className='text-red-500'>*</span></Label>
                                        <Input type="text" name={`variants[${i}][price]`} placeholder="Enter price" defaultValue={data?.variants?.[i]?.price} />
                                    </div>
                                    <div>
                                        <Label>Quantity</Label>
                                        <Input type="text" name={`variants[${i}][quantity]`} placeholder="Enter quantity" defaultValue={data?.variants?.[i]?.quntity} />
                                    </div>
                                    {data?.variants?.[i]?._id && !removeVar.includes(data?.variants?.[i]?._id) ?
                                        <input readOnly className='hidden' name={`variants[${i}][_id]`} value={data?.variants?.[i]?._id} />
                                        :
                                        null
                                    }
                                    {i + 1 == variants &&
                                        <div className='flex gap-3'>
                                            <div className='mt-9'>

                                                <span onClick={() => setVariats(i + 2)} className='w-full border px-4 py-2 rounded-xl cursor-pointer text-brand-500 font-bold border-brand-500 hover:bg-brand-500 hover:text-white transition-all'>+</span>
                                            </div>
                                            {variants > 1 &&

                                                <div className='mt-9'>

                                                    <span onClick={() => handleRemoveVar(i, data?.variants?.[i]?._id)} className='w-full border px-4 py-2 rounded-xl cursor-pointer text-red-500 font-bold border-red-500 hover:bg-red-500 hover:text-white transition-all'>x</span>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            ))} */}

                            <div>
                                <Label>Description <span className='text-red-500'>*</span></Label>
                                <TextArea
                                    name='description'
                                    placeholder='Entre description'
                                    rows={5}
                                    defaultValue={data?.description}
                                />
                            </div>
                            <div>
                                <Label>Products images <span className='text-red-500'>*</span></Label>
                                <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
                                    <div {...getRootProps()}
                                        className={`dropzone rounded-xl   border-dashed border-gray-300 p-3 lg:p-5
                                ${isDragActive
                                                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                                                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                                            }
                                `}
                                        id="demo-upload"
                                    >
                                        {/* Hidden Input */}
                                        <input {...getInputProps()} />

                                        <div className="dz-message flex flex-col items-center m-0!">
                                            {/* Icon Container */}
                                            <div className="mb-[10px] flex justify-center">
                                                <div className="flex h-[30px] w-[30px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                                    <svg
                                                        className="fill-current"
                                                        width="15"
                                                        height="16"
                                                        viewBox="0 0 29 28"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <h4 className="mb-1 font-semibold text-gray-800 text-theme-md dark:text-white/90">
                                                {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
                                            </h4>

                                            <span className=" text-center block w-full max-w-[290px] text-xs text-gray-700 dark:text-gray-400">
                                                Drag and drop your PNG, JPG, WebP, SVG images here or browse
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {selectedFiles.length > 0 && <Label>Sélectionée Primer image <span className='text-red-500'>*</span></Label>}
                                    <div className='flex flex-wrap mt-2 gap-2'>
                                        {selectedFiles.length > 0 &&
                                            selectedFiles.map((pre, index) => {
                                                return (
                                                    <div key={index} className='flex dark:text-white'>

                                                        <input name='newPrimaryImage' id={pre.name} type='radio' value={pre.name} className="peer hidden" checked={selected === 'b' + index} onChange={() => setSelected('b' + index)} />
                                                        <label htmlFor={pre.name} className='relative rounded-lg peer-checked:border-2 peer-checked:border-blue-600 cursor-pointer' >
                                                            <span onClick={() => handleRemoveSelectedPic(pre.name)} className='absolute text-white right-0 bg-gray-500 opacity-40 hover:opacity-70 rounded-md'><TrashBinIcon /></span>
                                                            <Image width={100} height={100} src={URL.createObjectURL(pre)} alt={pre.name} className='w-15 h-15 object-cover rounded-lg' />
                                                        </label>
                                                        {/* <p>{pre.name}</p> */}
                                                    </div>
                                                )
                                            })
                                        }
                                        {data?.images?.map((pre, index) => {
                                            if (!removePic.includes(pre)) {
                                                return (
                                                    <div key={index} className='flex dark:text-white'>
                                                        <input name='oldPrimaryImage' id={pre} type='radio' value={pre} className="peer hidden" checked={selected === 'a' + index} onChange={() => setSelected('a' + index)} />
                                                        <label htmlFor={pre} className='relative rounded-lg peer-checked:border-2 peer-checked:border-blue-600 cursor-pointer' >
                                                            <span onClick={() => setRemovePic([pre, ...removePic])} className='absolute text-white right-0 bg-gray-500 opacity-40 hover:opacity-70 rounded-md'><TrashBinIcon /></span>
                                                            <Image width={100} height={100} src={`${process.env.SERVER_DOMAIN}${pre}`} alt={pre} className='w-15 h-15 object-cover rounded-lg' />
                                                        </label>
                                                        {/* <p>{pre.name}</p> */}
                                                    </div>
                                                )
                                            }
                                        })

                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={closeModal}>
                            Close
                        </Button>
                        <Button size="sm">
                            Add Product
                        </Button>
                    </div>
                </form>
            </div>
    )
}
