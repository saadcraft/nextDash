import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Pagination from "@/components/tables/Pagination";
import ProductTable from "@/components/tables/products";
import { getProduct } from "@/lib/product-api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
    title: "Gestion Product",
    description:
        "This is Gestion product Dashboard page",
    // other metadata
};

type props = {
    searchParams: Promise<{ page?: string, search?: string, category?: string }>;
}

export default async function GestionProductPage({ searchParams }: props) {

    const { page } = await searchParams;
    const pageNumber = page ?? "1";

    const products = await getProduct({ page: pageNumber })

    if (!products) notFound();

    const { result, totalAct } = products;

    return (
        <>
            <PageBreadcrumb pageTitle="Gestion Products" />
            <div className="relative space-y-6">
                <ComponentCard title="Products">
                    <ProductTable product={result} />
                    <Pagination pages={totalAct} currentPage={Number(pageNumber)} params={``} />
                </ComponentCard>
            </div>
        </>
    )
}