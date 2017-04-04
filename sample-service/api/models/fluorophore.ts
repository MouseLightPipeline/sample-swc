export const TableName = "Fluorophore";

export interface IFluorophore {
    id: string;
    name: string;
    createAt: Date
    updatedAt: Date
}

export function sequelizeImport(sequelize, DataTypes) {
    const Fluorophore = sequelize.define(TableName, {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function(models) {
                Fluorophore.hasMany(models.Injection, {foreignKey: 'fluorophoreId', as: 'injections'});
            }
        },
        timestamps: true,
        paranoid: true
    });

    return Fluorophore;
};
