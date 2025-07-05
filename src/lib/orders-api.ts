import { toast } from "react-toastify";
import apiRequest from "./request"

type typeGetOrders = {
    result: OrderInfo[];
    totalAct: number;
}

export async function getAllOrders({ page, number, user, status }: { page: string, number: string, user: string, status?: string }): Promise<typeGetOrders | null> {
    try {
        const response = await apiRequest(`/orders/all?page=${page}&number=${number}&user=${user}&status=${status || ""}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.code == 200) {
            return {
                result: response.data.result,
                totalAct: response.data.totalPages
            }
        } else {
            return null
        }
    } catch {
        return null
    }
}

export async function GetFullOrder(id: string): Promise<OrderInfo | null> {
    try {
        const response = await apiRequest(`/orders/info/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.code == 200) {
            return response.data
        } else {
            return null
        }
    } catch {
        return null
    }
}

export async function updateOrder(data: { [k: string]: FormDataEntryValue; }) {

    const loadingToast = toast.loading("Miss a jour en cours ...", { position: "bottom-right", hideProgressBar: true })

    try {
        const response = await apiRequest(`/orders/${data.id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.code == 200) {
            toast.update(loadingToast, {
                render: "Order a Miss a jour",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            })
            return true
        } else {
            toast.update(loadingToast, {
                render: response.message,
                type: "error",
                isLoading: false,
                autoClose: 3000,
                // ...(res.code === 401 && { onClick: () => redirect("/signin") }),
            })
            return false
        }
    } catch {
        toast.update(loadingToast, {
            render: "Problem connection",
            type: "error",
            isLoading: false,
            autoClose: 3000,
        })
        return false
    }
}