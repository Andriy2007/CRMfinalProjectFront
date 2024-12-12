export interface IUser {
    _id: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    manager: string;
    isDeleted: boolean;
    isVerified: boolean;
    isBanned: boolean;
}
export interface IUsers {
    users: IUser[]
    data: IUser[];
}
export interface AuthProps {
    onLoginSuccess?: (userData: IUsers) => void;
}
