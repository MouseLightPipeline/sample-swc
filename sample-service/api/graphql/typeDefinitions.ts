let typeDefinitions = `
type BrainArea {
    id: String!
    name: String
    structureId: Int
    depth: Int
    parentStructureId: Int
    structureIdPath: String
    safeName: String
    acronym: String
    atlasId: Int
    graphId: Int
    graphOrder: Int
    hemisphereId: Int
    createdAt: Float
    updatedAt: Float
}

type MouseStrain {
    id: String!
    name: String
    createdAt: Float
    updatedAt: Float
}

type Fluorophore {
    id: String!
    name: String
    createdAt: Float
    updatedAt: Float
}

type InjectionVirus {
    id: String!
    name: String
    createdAt: Float
    updatedAt: Float
}

type Injection {
    id: String!
    createdAt: Float
    updatedAt: Float
}

type RegistrationTransform {
    id: String!
    location: String
    name: String
    notes: String
    createdAt: Float
    updatedAt: Float
}

type Sample {
    id: String!
    idNumber: Int
    animalId: String
    tag: String
    comment: String
    sampleDate: String
    activeRegistrationTransformId: String
    createdAt: Float
    updatedAt: Float
}

type Neuron {
    id: String!
    idNumber: Int
    tag: String
    keywords: String
    x: Float
    y: Float
    z: Float
    createdAt: Float
    updatedAt: Float
}

type Query {
    brainAreas: [BrainArea!]!
    mouseStrains: [MouseStrain!]!
    fluorophores: [Fluorophore!]!
    injectionViruses: [InjectionVirus!]!
    injections: [Injection!]!
    registrationTransforms: [RegistrationTransform!]!
    samples: [Sample!]!
    neurons: [Neuron!]!
}

type Mutation {
    message(message: String): String
}

schema {
  query: Query
  mutation: Mutation
}`;

export default typeDefinitions;
