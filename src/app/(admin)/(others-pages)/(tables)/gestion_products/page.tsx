import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
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

export default async function GestionProductPage() {
    const products = await getProduct()

    if (!products) notFound();

    const { result } = products;

    return (
        <>
            <PageBreadcrumb pageTitle="Gestion Products" />
            <div className="relative space-y-6">
                <ComponentCard title="Products">
                    <ProductTable product={result} />
                </ComponentCard>
            </div>
        </>
    )
}