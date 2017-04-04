export const TableName = "Neuron";

export interface INeuron {
    id: string;
    idNumber: number;
    tag: string;
    keywords: string;
    x: number;
    y: number;
    z: number;
    createAt: Date
    updatedAt: Date
}

export function sequelizeImport(sequelize, DataTypes) {
    const Neuron = sequelize.define(TableName, {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        idNumber: {
            type: DataTypes.INTEGER,
            defaultValue: -1
        },
        tag: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        keywords: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        x: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        y: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
        z: {
            type: DataTypes.DOUBLE,
            defaultValue: 0
        },
    }, {
        classMethods: {
            associate: function(models) {
                Neuron.belongsTo(models.Injection, {foreignKey: 'injectionId', as: 'injection'});
                Neuron.belongsTo(models.BrainArea, {foreignKey: {name: 'brainAreaId', allowNull: true}, as: 'brainArea'});
            }
        },
        timestamps: true,
        paranoid: true
    });
    
    return Neuron;
};
