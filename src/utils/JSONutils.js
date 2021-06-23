// export default class JSONutils {
//
//     static validateJSONUpload(obj) {
//         const Ajv = require("ajv");
//         const ajv = new Ajv({allErrors: true});
//         const jsonData = obj;
//
//         const listDataSchema = {
//             type: "array",
//             items: [
//                 {
//                     type: "object",
//                     properties: {
//                         userName: {
//                             type: "string"
//                         },
//                         lists: {
//                             type: "array",
//                             items: [
//                                 {
//                                     type: "object",
//                                     properties: {
//                                         listName: {
//                                             type: "string"
//                                         },
//                                         items: {
//                                             type: "array",
//                                             items: [
//                                                 {
//                                                     type: "object",
//                                                     properties: {
//                                                         itemName: {
//                                                             type: "string"
//                                                         },
//                                                         quantity: {
//                                                             type: "integer"
//                                                         },
//                                                         itemMeasurement: {
//                                                             type: "string",
//                                                             enum: ["pck.", "stk.", "g"]
//                                                         },
//                                                         isSelected: {
//                                                             type: "boolean"
//                                                         }
//                                                     },
//                                                     required: ["itemName", "quantity", "itemMeasurement", "isSelected"],
//                                                     additionalItems: true,
//                                                     additionalProperties: false
//                                                 }
//                                             ]
//                                         }
//                                     },
//                                     required: ["listName", "items"],
//                                     additionalItems: true,
//                                     additionalProperties: false
//                                 }
//                             ]
//                         }
//                     },
//                     required: ["userName", "lists"],
//                     additionalProperties: false,
//                     additionalItems: false
//                 }
//             ],
//             additionalItems: false,
//             additionalProperties: false,
//         }
//
//         if (jsonData === undefined || jsonData.length === 0) {
//             console.log("JSON is undefined or empty");
//             return false;
//         }
//         const validateListNames = ajv.compile(listDataSchema);
//         if (validateListNames(jsonData)) {
//             return true;
//         } else {
//             console.log("Invalid JSON Format");
//             console.log(ajv.errorsText(validateListNames.errors));
//             return false;
//         }
//     }
//
//     static onReaderLoad(event){
//         // console.log(event.target.result);
//         try {
//             const obj = JSON.parse(event.target.result);
//             if (validateJSONUpload(obj)) {
//                 updateListData(obj);
//             }
//             // console.log(obj);
//         } catch (e) {
//             console.log("The data needs to have one array that contains one and only one JSON Object in it! -> Check your loaded data it seems to be malformed :^)");
//             console.log(e);
//         }
//     }
//
//     static readJSONFromInput(event) {
//         let reader = new FileReader();
//         reader.onload = onReaderLoad;
//         reader.readAsText(event.target.files[0])
//     }
//
//
//
//     static updateListData = (jsonData) => {
//         const newListData = [...listData];
//         for (const dataJSONElement of jsonData[0].lists) {
//             const index = newListData[0].lists.findIndex(item => item.listName === dataJSONElement.listName);
//             if (index !== -1) {
//                 newListData[0].lists[index].items = dataJSONElement.items;
//             } else {
//                 newListData[0].lists = [...newListData[0].lists, dataJSONElement]
//             }
//         }
//         console.log("Update Successful!");
//         setListData(newListData);
//     }
// };
//
