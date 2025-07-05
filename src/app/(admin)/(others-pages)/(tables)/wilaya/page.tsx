import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import WilayaTax from "@/components/tables/wilaya_tax";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Wilaya",
    description:
        "Wilaya and price livraison",
    // other metadata
};

type props = {
    searchParams: Promise<{ page?: string, wilaya?: string }>;
}

export default async function WilayaTable({ searchParams }: props) {
    const { page, wilaya } = await searchParams;
    const pageNumber = page || "1";
    const wilayasearch = wilaya || "";

    return (
        <div>
            <PageBreadcrumb pageTitle="Wilayas" />
            <div className="relative space-y-6">
                <ComponentCard title="Wilaya table">
                    <WilayaTax page={pageNumber} wilaya={wilayasearch} />
                    {/* <Pagination  /> */}
                </ComponentCard>
            </div>
        </div>
    );
}