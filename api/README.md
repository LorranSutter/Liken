## API documentation

|End Point                          |Method|Params                                      | HLF function                 |Returns                  |
|:---                               |:---: | :---                                       | :---                         |             :---        |
|`\org\index`                       | GET  |-                                           |      -                       |list of organizations    |
|`\org\login`                       | POST |login; passowrd                             |      -                       |JWT; credentials         |
|`\org\registerModel`               | POST |credentials; name; description; model object|`registerModel`               |status message; model key|
|`\org\getModelData`                | GET  |modelKey; credentials                       |`getModelData`                |public model data        |
|`\org\getFullModelData`            | GET  |modelKey; credentials                       |`getFullModelData`            |full model data          |
|`\org\approve`                     | POST |modelKey; credentials; org; terms           |`approve`                     |status message           |
|`\org\remove`                      | POST |modelKey; credentials;                      |`remove`                      |status message           |
|`\org\queryAllModelsByOwner`       | GET  |credentials;                                |`queryAllModelsByOwner`       |list of models           |
|`\org\queryAllModelsByApprovedUser`| GET  |credentials;                                |`queryAllModelsByApprovedUser`|list of models           |
|`\org\updateModel`                 | PUT  |credentials; name; description; model object|`updateModel`                 |status message           |