import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/tableOrders";
// import { getAllOrders } from "@/lib/orders-api";
// import Pagination from "@/components/tables/Pagination";
import { Metadata } from "next";
// import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Orders",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

type props = {
  searchParams: Promise<{ page?: string, number?: string, user?: string }>;
}


export default async function BasicTables({ searchParams }: props) {

  const { page, number, user } = await searchParams;
  const pageNumber = page || "1";
  const trackingNum = number || "";
  const searchUser = user || "";


  return (
    <div>
      <PageBreadcrumb pageTitle="Orders" />
      <div className="space-y-6">
        <ComponentCard title="Orders table">
          <BasicTableOne page={pageNumber} number={trackingNum} user={searchUser} />
          {/* <Pagination  /> */}
        </ComponentCard>
      </div>
    </div>
  );
}
