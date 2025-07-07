import { create } from 'zustand'
import { getUser } from '../auth';

type UserInfo = {
    user: UserAuth | null;
    setUser: (user: UserAuth | null) => void;
}



export const userInformation = create<UserInfo & { refresh: () => Promise<void> }>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    refresh: async () => {
        const user = await getUser();
        set({ user });
    }
}));