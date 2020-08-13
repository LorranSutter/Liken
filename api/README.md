## API documentation

|End Point              |Method|Params               | HLF function     |Returns          |
|:---                   |:---: | :---:               | :---             |             ---:|
|`\login`               | POST |login; passowrd      |      -           |JWT; credentials |
|`\org\getModelData`    | GET  |modelKey; credentials|`getModelData`    |public model data|
|`\org\getFullModelData`| GET  |modelKey; credentials|`getFullModelData`|full model data  |