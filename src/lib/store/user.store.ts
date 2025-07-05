import { create } from 'zustand'

type UserInfo = {
    user: UserAuth | null;
    setUser: (user: UserAuth | null) => void;
}



export const userInformation = create<UserInfo>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));