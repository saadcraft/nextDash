type Products = {
    _id: string;
    title: string;
    description: string;
    quntity?: number;
    category: string;
    lowPrice: number;
    updatedAt?: string;
    primaryImage: string;
    images?: string[];
    variants?: Variants[];
}

type Variants = {
    _id: string;
    sku: string;
    product: Products;
    options: string[];
    quntity?: number;
    price: number;
    [key: string]: string | number | undefined;
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

type Parsonalizer = {
    height: number;
    Width: number;
    font: string;
    text: string;
    color: string;
    materiel: string;
}
type Order = {
    _id: string;
    variant?: Variants;
    parsonalizer?: Parsonalizer;
    orderInfo: string;
    quantity: number;
    price: number;
}


type OrderInfo = {
    _id: string;
    fullname: string;
    phoneNumber: string;
    wilaya: string;
    adresse: string;
    email?: string;
    status: string;
    tracking?: string;
    orders: Order[];
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}