"use client"

import React from 'react'
import UserMetaCard from './UserMetaCard'
import UserInfoCard from './UserInfoCard'
import UserAddressCard from './UserAddressCard'
import { userInformation } from '@/lib/store/user.store'
import { getDynamo } from '@/lib/dynamic'
import { notFound } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useModal } from '@/hooks/useModal'
import { Modal } from "../ui/modal";
import AddInfoDymo from '../windows/add_Magasin'
import LoadingFirst from '../options/loading'

export default function ClientProfile() {

    const { user, refresh } = userInformation()

    const { isOpen, openModal, closeModal } = useModal();

    console.log("from store : ", user)

    const { data, refetch, isLoading } = useQuery({
        queryKey: ['dynamo', user?.dynamics],
        queryFn: async () => {
            if (!user?.dynamics) return undefined;
            return await getDynamo(user.dynamics);
        },
        enabled: !!user
    })

    if (isLoading) return <LoadingFirst />

    return (
        <div className="space-y-6">
            {!user ?
                <p className='text-center dark:text-white'>Loading ....</p>
                :
                data ?
                    <>
                        <UserMetaCard magasin={data} />
                        <UserInfoCard magasin={data} refresh={refetch} />
                        <UserAddressCard magasin={data} refresh={refetch} />
                    </>
                    :
                    <button onClick={openModal} className='bg-fuchsia-500 hover:bg-fuchsia-400 rounded-xl text-white p-2 flex gap-2 items-center mx-auto'>
                        <p className='text-xl font-bold'>+</p> Ajouté Magasine
                    </button>
            }
            <Modal
                isOpen={isOpen} onClose={closeModal}
                className="max-w-[700px] mt-20 lg:mt-0 m-4">
                <AddInfoDymo onClose={closeModal} refresh={refetch} user={refresh} />
            </Modal>
        </div>
    )
}
