export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    profilePicture: string | null,
    createdAt: Date,
    updatedAt: Date,
}

export interface IUserMethod {
    comparePassword: (password: string) => Promise<boolean>,
    omitPassword: () => Omit<IUser, 'password'>
}

