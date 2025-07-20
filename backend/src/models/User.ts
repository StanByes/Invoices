import * as bcrypt from "bcrypt";
import {CreationOptional, DataTypes, Model, Optional, Sequelize} from "sequelize";

import Client from "./Client";

type UserAttribute = {
    id: number,
    client?: Client,
    username: string,
    email: string,
    password: string,
    admin: boolean,
    createdAt: Date,
    updatedAt: Date
}
type UserCreationAttribute = Optional<UserAttribute, "id" | "createdAt" | "updatedAt">

class User extends Model<UserAttribute, UserCreationAttribute> {
    declare id: CreationOptional<number>;
    declare client?: Client;
    declare username: string;
    declare email: string;
    declare password: string;
    declare admin: boolean;

    static associate(sequelize: Sequelize) {
        User.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
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
            engine: "InnoDB",
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

    static makeAssociations() {
        User.hasOne(Client, {
            foreignKey: "user_id",
            as: "client",
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        });
    }

    comparePassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }
}

export default User;
