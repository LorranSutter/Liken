export function setModelListData(modelListData, setData) {
    modelListData = modelListData.map(data => {
        return {
            modelKey: data.key,
            modelData: [
                { label: 'Owner', value: data.modelData.owner },
                { label: 'Name', value: data.modelData.modelName },
                { label: 'Description', value: data.modelData.modelDescription },
                { label: 'Publication date', value: new Date(data.modelData.publicationDate).toLocaleString() },
                { label: 'Who published last', value: data.modelData.whoPublishedLast }
            ]
        }
    });
    // ].filter(item => item.value);
    // console.log(modelListData);
    setData(modelListData);
}
