export const TableName = "InjectionVirus";

export interface IInjectionVirus {
    id: string;
    name: string;
    createAt: Date
    updatedAt: Date
}

export function sequelizeImport(sequelize, DataTypes) {
    const InjectionVirus = sequelize.define(TableName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: DataTypes.TEXT
        }, {
            classMethods: {
                associate: (models) => {
                    InjectionVirus.hasMany(models.Injection, {
                        foreignKey: 'injectionVirusId',
                        as: 'injections'
                    });
                }
            },
            timestamps: true,
            paranoid: true,
            tableName: 'InjectionViruses'
        }
    );

    return InjectionVirus;
};
