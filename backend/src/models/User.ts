import * as bcrypt from "bcrypt";
import {CreationOptional, DataTypes, Model, Optional, Sequelize} from "sequelize";

type UserAttribute = {
    id: number,
    username: string,
    email: string,
    password: string,
    admin: boolean,
    createdAt: Date,
    updatedAt: Date
}
type UserCreationAttribute = Optional<UserAttribute, "id" | "createdAt" | "updatedAt">
export type UserPayload = Pick<UserAttribute, "id" | "admin">

class User extends Model<UserAttribute, UserCreationAttribute> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare email: string;
    declare password: string;
    declare admin: boolean;

    static associate(sequelize: Sequelize) {
        User.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            username: {
                type: new DataTypes.STRING(100),
                allowNull: false
            },
            email: {
                type: new DataTypes.STRING(100),
                allowNull: false
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        }, {
            sequelize,
            timestamps: true,
            underscored: true
        });

        User.beforeCreate(async (user: User) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        });

        User.beforeUpdate(async (user: User) => {
            if (user.changed("password")) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        });
    }

    comparePassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }
}

export default User;
