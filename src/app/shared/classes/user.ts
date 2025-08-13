export interface IUser {
    email?: string
    displayName?: string
    token?: string
    role?: string
}

export interface IChangePassword {
    CurrentPassword: string
    NewPassword: string
    ConfirmNewPassword: string    
    Email: string
}

export interface IForgotPassword {
    Email: string
}

export interface IResetPassword {
    Password: string
    ConfirmPassword: string
    Email: string
    Token: string
}