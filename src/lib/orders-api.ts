import apiRequest from "./request"

type typeGetOrders = {
    result: OrderInfo[];
    totalAct: number;
}

export async function getAllOrders({ page, number, user }: { page: string, number: string, user: string }): Promise<typeGetOrders | null> {
    try {
        const response = await apiRequest(`/orders/all?page=${page}&number=${number}&user=${user}`, {
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