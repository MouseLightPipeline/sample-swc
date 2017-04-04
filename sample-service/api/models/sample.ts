export const TableName = "Sample";

export interface ISample {
    id: string;
    idNumber: number;
    tag: string;
    animalId: string;
    comment: string;
    sampleDate: Date;
    activeRegistrationTransformId: string;
    createAt: Date
    updatedAt: Date
}

export function sequelizeImport(sequelize, DataTypes) {
    const Sample = sequelize.define(TableName, {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        idNumber: {
            type: DataTypes.INTEGER,
            defaultValue: -1
        },
        animalId: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        tag: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        comment: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        sampleDate: DataTypes.DATE,
        activeRegistrationTransformId: {
            type: DataTypes.TEXT,
            defaultValue: '',
        },

    }, {
        classMethods: {
            associate: function(models) {
                Sample.hasMany(models.RegistrationTransform, {foreignKey: 'sampleId', as: 'registrationTransforms'});
                Sample.belongsTo(models.MouseStrain, {foreignKey: 'mouseStrainId', as: 'mouseStrain'});
            }
        },
        timestamps: true,
        paranoid: true
    });

    return Sample;
};
