"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableName = "RegistrationTransform";
function sequelizeImport(sequelize, DataTypes) {
    const RegistrationTransform = sequelize.define(exports.TableName, {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        location: DataTypes.TEXT,
        name: DataTypes.TEXT,
        notes: DataTypes.TEXT,
    }, {
        classMethods: {
            associate: models => {
                RegistrationTransform.belongsTo(models.Sample, { foreignKey: "sampleId", as: "sample" });
            }
        },
        timestamps: true,
        paranoid: true
    });
    return RegistrationTransform;
}
exports.sequelizeImport = sequelizeImport;
//# sourceMappingURL=registrationTransform.js.map