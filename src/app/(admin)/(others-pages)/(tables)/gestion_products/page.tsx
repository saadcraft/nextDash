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

    console.log("here")
    const products = await getProduct()
    console.log("here2")
    console.log(products)

    if (!products) notFound();

    console.log("here3")

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