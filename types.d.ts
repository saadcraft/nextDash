type Products = {
    _id: string;
    title: string;
    description: string;
    quntity?: number;
    category: string;
    lowPrice: number;
    updatedAt?: string;
    primaryImage?: string;
    images?: string[];
    variants?: Variants[];
}

type Variants = {
    _id: string;
    sku: string;
    options: string[];
    quntity?: number;
    price: number;
}

type UserAuth = {
    id?: string;
    username?: string;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
    expires_at?: number;
}

type Errors = {
    code: number;
    message: string;
}

type ProductFormData = {
    [key: string]: FormDataEntryValue | string[]; // Adjust if needed
    images?: File[];
}