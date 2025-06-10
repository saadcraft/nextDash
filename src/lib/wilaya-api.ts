import { toast } from "react-toastify";
import apiRequest from "./request";

type typeGetWilayas = {
    result: Wilaya[];
    totalAct: number;
}


export async function GetWilayas({ page, wilaya }: { page: string, wilaya: string }): Promise<typeGetWilayas | null> {
    try {
        const response = await apiRequest(`/wilaya?page=${page}&wilaya=${wilaya}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
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

export async function AddTarif(data: { [key: string | number]: unknown }) {
    // console.log('here', data)
    const loadingToast = toast.loading("Validé le Tarif...", { position: "bottom-right", hideProgressBar: true })
    try {
        const response = await apiRequest('/wilaya', {
            method: "Post",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.code === 201) {
            toast.update(loadingToast, {
                render: "Tarification a été ajouté",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            })
            return true;
        } else {
            toast.update(loadingToast, {
                render: String(response.message),
                type: "error",
                isLoading: false,
                autoClose: 3000,
                // ...(res.code === 401 && { onClick: () => redirect("/signin") }),
            })
            return false;
        }
    } catch {
        toast.update(loadingToast, {
            render: "Problem connection",
            type: "error",
            isLoading: false,
            autoClose: 3000,
        })
        return false;
    }
}

export async function ModyTarif(data: { [key: string | number]: unknown }) {
    // console.log('here', data)
    const loadingToast = toast.loading("Validé le Tarif...", { position: "bottom-right", hideProgressBar: true })
    try {
        const response = await apiRequest(`/wilaya/${data.id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.code === 200) {
            toast.update(loadingToast, {
                render: "Tarification a été Modifié",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            })
            return true;
        } else {
            toast.update(loadingToast, {
                render: String(response.message),
                type: "error",
                isLoading: false,
                autoClose: 3000,
                // ...(res.code === 401 && { onClick: () => redirect("/signin") }),
            })
            return false;
        }
    } catch {
        toast.update(loadingToast, {
            render: "Problem connection",
            type: "error",
            isLoading: false,
            autoClose: 3000,
        })
        return false;
    }
}

export async function DeleteTarif(id: string) {
    const loadingToast = toast.loading("Supprimé le Tarif...", { position: "bottom-right", hideProgressBar: true })
    try {
        const response = await apiRequest(`/wilaya/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (response.code === 200) {
            toast.update(loadingToast, {
                render: "Tarification a été Supprimé",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            })
            return true;
        } else {
            toast.update(loadingToast, {
                render: String(response.message),
                type: "error",
                isLoading: false,
                autoClose: 3000,
                // ...(res.code === 401 && { onClick: () => redirect("/signin") }),
            })
            return false;
        }
    } catch {
        toast.update(loadingToast, {
            render: "Problem connection",
            type: "error",
            isLoading: false,
            autoClose: 3000,
        })
        return false;
    }
}
