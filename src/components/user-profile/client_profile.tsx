"use client"

import React from 'react'
import UserMetaCard from './UserMetaCard'
import UserInfoCard from './UserInfoCard'
import UserAddressCard from './UserAddressCard'
import { userInformation } from '@/lib/store/user.store'
import { getDynamo } from '@/lib/dynamic'
import { notFound } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

export default function ClientProfile() {

    const { user } = userInformation()

    console.log("from store : ", user)

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['dynamo'],
        queryFn: async () => await getDynamo(user?.dynamics!),
        enabled: !!user?.dynamics
    })

    if (isError) notFound()

    console.log("here :", data)

    return (
        <div className="space-y-6">
            <UserMetaCard magasin={data!} />
            <UserInfoCard magasin={data!} />
            <UserAddressCard magasin={data!} refresh={refetch} />
        </div>
    )
}
