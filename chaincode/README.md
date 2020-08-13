## Chaincode documentation

| Function | Visibility | Parameters | Action | Returns |
|-|:-:|-|-|-|
| `initLedger` | public | `array of objects` initialData  | Populates the ledger with initialData parameter. Can be called only once. |  |
| `registerModel` | public | `object model | Stringifies model parameter. Saves the model in the ledger. | `bool` success or fail |
| `approve` | public | `string` modelKey, `string` user | Allows user to update model. Creates composite key. | `bool` success or fail |
| `remove` | public | `string` modelKey, `string` user | Removes user allowance. Deletes composite key. | `bool` success or fail |
| `updateModel` | public | `string` modelKey, `object` modelUpdate | Checks if caller is allowed to update model. Updates model. | `bool` success or fail |
| `queryAllModelsByOwner` | public |  | Verifies if caller is owner of any registered model. Returns a list od models. | `array of objects` models |
| `queryAllModelsByApprovedUser` | public |  | Returns a list of models approved for caller | `array of objects` models |
| `isOwner` | private | `string` modelKey | Verifies if caller is the model owner | `bool` |
| `isApproved` | private | `string` modelKey | Verifies if user is owner or allowed to update model | `bool` |
| `getCallerId` | private |  | Extracts the CA Id. | `string` Id |
| `getModelsByCaller` | private |  | Returns a list of models approved by caller. | `array of objects` models |
| `getRelationsArray` | private | `Iterator` relationsResultIterator | Iterates a composite key iterator. | `array of strings` model keys |