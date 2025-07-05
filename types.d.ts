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
    _id?: string;
    username?: string;
    email?: string;
    number: string;
    role: 'ADMIN' | 'USER';
    dynamics: string;
}

type Errors = {
    code: number;
    message: string;
}

type ProductFormData = {
    [key: string]: FormDataEntryValue | string[]; // Adjust if needed
    images?: File[];
    image?: File[];
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

type Wilaya = {
    _id: string;
    name_send: string;
    code_send: number;
    name_recieve: string;
    code_recieve: number;
    prix_sd: number;
    prix_domicile: number;
}

type HeroPic = {
    _id: string;
    image: string[];
    dynamic: string;
}

type FaqType = {
    _id: string;
    title: string;
    description: string;
}

type DynamicType = {
    _id: string;
    magasine: string;
    email: string;
    phone: string;
    fqa: FaqType[];
    heroPictures: HeroPic;
}