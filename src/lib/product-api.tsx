import { redirect } from "next/navigation";
import apiRequest from "./request";
import { toast } from "react-toastify"

type typeGetProduct = {
    result: Products[];
    totalAct: number;
}

type addProduct = {
    title: string;
    category: string;
    price: number;
    description: string;
    quntity?: number;
    images: File[];
}

export async function getProduct(): Promise<typeGetProduct | null> {
    try {
        const response = await apiRequest('/products', {
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

export async function getSingleProduct(id: string): Promise<Products | null> {
    try {
        const response = await apiRequest(`/products/${id}`, {
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

export async function addProduct(Data: { [key: string]: unknown }): Promise<boolean> {
    const loadingToast = toast.loading("ajouter en cours ...", { position: "bottom-right", hideProgressBar: true })
    const form = new FormData;
    Object.entries(Data).forEach(([key, value]) => {
        if (value instanceof Blob || value instanceof Array) {
            // Handle file uploads properly
            // Array.isArray(value) ? value.forEach(v => form.append(key, v)) : form.append(key, value);
            if (Array.isArray(value)) {
                value.forEach(v => form.append(key, v));
            } else {
                form.append(key, value);
            }
        } else {
            form.append(key, String(value)); // Convert other values to string
        }
    });
    // console.log(form)
    try {
        const res = await apiRequest('/products', {
            method: "POST",
            body: form,
        })

        if (res.code == 201) {
            toast.update(loadingToast, {
                render: "Produit ajouté",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            })
            return true;
        } else {
            toast.update(loadingToast, {
                render: (
                    <div className="w-full flex items-center justify-between">
                        {res.message}
                        {res.code === 401 &&
                            <button
                                onClick={() => redirect("/signin")}
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-1"
                            >
                                Login
                            </button>
                        }
                    </div>
                ),
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

export async function UpdateProduct(id: string, Data: { [key: string]: unknown }): Promise<boolean> {
    const loadingToast = toast.loading("Miss a jour en cours ...", { position: "bottom-right", hideProgressBar: true })

    const form = new FormData;
    Object.entries(Data).forEach(([key, value]) => {
        if (value instanceof Blob || value instanceof Array) {
            // Handle file uploads properly
            // Array.isArray(value) ? value.forEach(v => form.append(key, v)) : form.append(key, value);
            if (Array.isArray(value)) {
                value.forEach(v => form.append(key, v));
            } else {
                form.append(key, value);
            }
        } else {
            form.append(key, String(value)); // Convert other values to string
        }
    });

    try {
        const response = await apiRequest(`/products/${id}`, {
            method: "PATCH",
            body: form
        })
        if (response.code == 200) {
            toast.update(loadingToast, {
                render: "Produit a Miss a jour",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            })
            return true
        } else {
            toast.update(loadingToast, {
                render: (
                    <div className="w-full flex items-center justify-between">
                        {response.message}
                        {response.code === 401 &&
                            <button
                                onClick={() => redirect("/signin")}
                                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-1"
                            >
                                Login
                            </button>
                        }
                    </div>
                ),
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