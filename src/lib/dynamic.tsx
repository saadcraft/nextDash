import { redirect } from "next/navigation";
import { toast } from "react-toastify"
import apiRequest from "./request"


export async function getDynamo(id: string): Promise<DynamicType | null> {
    try {
        const response = await apiRequest(`/dynamic/${id}`, {
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

export async function updateHeroPic(id: string, Data: { [key: string]: unknown }) {
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
        const response = await apiRequest(`/dynamic/image/${id}`, {
            method: "PATCH",
            body: form
        })
        if (response.code == 200) {
            toast.update(loadingToast, {
                render: "Hero section Pictures a Miss a jour",
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