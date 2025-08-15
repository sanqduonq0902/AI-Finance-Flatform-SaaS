import mongoose, { Model, Schema } from "mongoose";
import { IUser, IUserMethod } from "../interface/user.interface";
import { compareValue, hashValue } from "../utils/bcrypt";

const userSchema = new Schema<IUser, Model<IUser>, IUserMethod>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        select: true,
        required: true
    },
    profilePicture: {
        type: String,
        default: null
    }
}, {timestamps: true, collection: 'User'});

userSchema.pre('save', async function (next) {
    if (this.isModified(this.password)) {
        this.password = await hashValue(this.password, 10);
    }
    next();
})

userSchema.methods.omitPassword = function(): Omit<IUser, 'password'> {
    const {password, ...data} = this.toObject();
    return data;
}

userSchema.methods.comparePassword = async function (password: string) {
    return await compareValue(password, this.password)
}

const UserModel = mongoose.model<IUser, Model<IUser, {}, IUserMethod>>('User', userSchema);
export default UserModel;