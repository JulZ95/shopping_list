import {useEffect, useState} from "react";
import "./ListCreator.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPlus, faSave, faTimes, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useHistory, useParams} from "react-router-dom";

const ListCreator = () => {
    const {userID, listName} = useParams();
    const history = useHistory();
    const getName = () => {
        return listName.replaceAll("+", " ");
    }

    const existingListIndex = JSON.parse(localStorage.getItem(userID))[0].lists.findIndex(element => element.listName === getName());

    if (userID === undefined || parseInt(userID) < 1 || isNaN(parseInt(userID)) || listName === undefined || typeof listName !== "string"
        || !(JSON.parse(localStorage.getItem("userIDs"))).some(element => element.userID === parseInt(userID))
        || (!(JSON.parse(localStorage.getItem(userID)))[0].lists.some(element => element.listName === getName()) && listName !== "Neue+Liste")) {
        history.push("/");
    }

    const [listData, setListData] = useState(() => {
        if (existingListIndex !== -1) {
            console.log(JSON.parse(localStorage.getItem(userID))[0].lists);
            return [JSON.parse(localStorage.getItem(userID))[0].lists[existingListIndex]];
        } else {
            const tmpListData = JSON.parse(localStorage.getItem("tmpListData"));
            if (tmpListData !== null) {
                return tmpListData;
            } else {
                return [{
                    listName: "",
                    items: []
                }]
            }
        }
    });

    useEffect(() => {
        localStorage.setItem("tmpListData", JSON.stringify(listData));
        setNewNameInputValue(listData[0].listName);
    }, [listData]);

    useEffect(() => {
        return () => {
            console.log("Destory");
            localStorage.removeItem("tmpListData");
        }
    }, []);

    const addItemClick = () => {
        if (itemNameInputValue !== "" && !listData[0].items.some(temp => temp.itemName === itemNameInputValue) && !parseInt(itemQuantityValue) <= 0) {
            const newItem = {
                itemName: itemNameInputValue,
                quantity: parseInt(itemQuantityValue),
                itemMeasurement: itemMeasurement,
                isSelected: false,
            }
            const newItems = [...listData];
            newItems[0].items.push(newItem);
            setListData(newItems);
            setItemNameInputValue("");
            setItemQuantityValue(1);
        }
    };

    const [updatedItemNameValue, setUpdatedItemNameValue] = useState("");
    const [newNameInputValue, setNewNameInputValue] = useState("");
    const [itemNameInputValue, setItemNameInputValue] = useState("");

    const [itemQuantityValue, setItemQuantityValue] = useState(1);
    const updateItemQuantity = (value, index) => {
        const newItems = [...listData];
        newItems[0].items[index].quantity = value;
        setListData(newItems);
    }

    const [itemMeasurement, setItemMeasurement] = useState("stk.");
    const updateItemMeasurement = (value, index) => {
        const newItems = [...listData];
        newItems[0].items[index].itemMeasurement = value;
        setListData(newItems);
    }

    const deleteItemFromList = (index) => {
        const newItems = [...listData];
        newItems[0].items.splice(index, 1);
        setListData(newItems);
    }

    const [validListNameBool, setValidListNameBool] = useState(false);
    const checkIfListNameIsValid = () => {
        if (newNameInputValue === "" || newNameInputValue === "Neue Liste"
            || ((JSON.parse(localStorage.getItem(userID)))[0].lists.some(element => element.listName === newNameInputValue)
                && !(existingListIndex !== -1 && newNameInputValue === getName()))
        ) {
            setValidListNameBool(false);
        } else {
            const newListData = [...listData];
            newListData[0].listName = newNameInputValue;
            setListData(newListData);
            setValidListNameBool(true);
        }
    }

    useEffect(() => {
    }, [validListNameBool])

    const filterNumbers = (input) => {
        return input.replace(/\D/g, "");
    }

    const filterLetters = (input) => {
        return input.replace(/[^A-Za-züöäÜÖÄ -]/g, "")
    }

    const safeList = () => {
        if (validListNameBool) {
            if (existingListIndex === -1) {
                const newUserListData = JSON.parse(localStorage.getItem(userID));
                newUserListData[0].lists.push(listData[0]);
                localStorage.setItem(userID, JSON.stringify(newUserListData));
                history.push("/listView/" + userID);
            } else {
                const newUserListData = JSON.parse(localStorage.getItem(userID));
                newUserListData[0].lists[existingListIndex].listName = listData[0].listName;
                newUserListData[0].lists[existingListIndex].items = listData[0].items;
                localStorage.setItem(userID, JSON.stringify(newUserListData));
                history.push("/listView/" + userID);
            }
        }
    }

    return (
        <div className="mainContainer_ListCreator">
            <input className="listName_ListCreator" autoFocus={true} style={{
                textAlign: "center",
                cursor: "text"
            }} value={newNameInputValue}
                   onChange={(event => {
                       setNewNameInputValue(event.target.value);
                       // checkIfListNameIsValid(event.target.value);
                   })} onBlur={() => checkIfListNameIsValid()}
                   placeholder="Neuer Listen Name..."/>
            {validListNameBool ? (
                <FontAwesomeIcon className="checkListNameIcon_ListCreator" style={{color: "green"}} icon={faCheck}/>
            ) : (
                <FontAwesomeIcon className="checkListNameIcon_ListCreator" style={{color: "red"}} icon={faTimes}/>
            )}
            <button className="saveButton_ListCreator button_ListCreator" onClick={safeList}>
                <FontAwesomeIcon icon={faSave}/>
            </button>

            <input className="newItemInputField_ListCreator"
                   value={itemNameInputValue}
                   onChange={(event => setItemNameInputValue(filterLetters(event.target.value)))}
                   placeholder="Gegenstandsname..."/>

            <input className="itemQuantity_ListCreator"
                   value={itemQuantityValue}
                   onChange={(event => setItemQuantityValue(filterNumbers(event.target.value)))}
                   placeholder="Anzahl"/>
            <select className="itemMeasurementType_ListCreator">
                <option value="Stück" onClick={() => setItemMeasurement("stk.")}>stk.</option>
                <option value="Pack" onClick={() => setItemMeasurement("pck.")}>pck.</option>
                <option value="Gramm" onClick={() => setItemMeasurement("g")}>g</option>
            </select>

            <button className="itemAddButton_ListCreator button_ListCreator"
                    onClick={addItemClick}>
                <FontAwesomeIcon icon={faPlus}/>
            </button>

            <div className="itemMapContainer_ListCreator">
                {listData[0].items.map((item, index) => (
                    <div className="itemMapContainerGrid_ListCreator" key={index}>
                        <input disabled={true} className="itemInputBorderCss_ListCreator" value={updatedItemNameValue}
                               onChange={(event => setUpdatedItemNameValue(filterLetters(event.target.value)))}
                               placeholder={item.itemName}/>
                        <input className="itemQuantityCss_ListCreator" onChange={() => updateItemQuantity()}
                               value={item.quantity}/>
                        <select className="itemMeasurementCss_ListCreator"
                                defaultValue={listData[0].items[index].itemMeasurement}
                                onChange={(event) => updateItemMeasurement(event.target.value, index)}>
                            <option value="stk.">stk.</option>
                            <option value="pck.">pck.</option>
                            <option value="g">g</option>
                        </select>
                        <button className="deleteItemCss_ListCreator button_ListCreator"
                                onClick={() => deleteItemFromList(index)}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default ListCreator;