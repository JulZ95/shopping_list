import {useEffect, useState} from "react";
import "./ListCreator.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPen, faPlus, faSave, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useHistory, useParams} from "react-router-dom";

const ListCreator = (props) => {
    const {name} = useParams();
    const history = useHistory();

    const getName = () => {
        return name.replace("+", " ");
    }

    useEffect(() => {
        localStorage.setItem("ListNames", JSON.stringify(listNames));
        localStorage.setItem(getName(), JSON.stringify(items));
    })

    const [listNames, setListNames] = useState(
        JSON.parse(localStorage.getItem("ListNames"))
        ||
        [
            {listName: "Standart Liste"},
        ]
    );

    const [items, setItems] = useState(
        JSON.parse(localStorage.getItem(getName()))
        ||
        [
            {itemName: "Erdbeere", quantity: 2, itemMeasurement: "pck.", isSelected: false},
        ]
    )

    const [newNameInputValue, setNewNameInputValue] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [quantityValue, setQuantityValue] = useState(1);
    const [itemMeasurement, setItemMeasurement] = useState("stk.");

    const [changeListNameBool, setChangeListNameBool] = useState(false);
    const handleToggleChangeListNameBool = () => {
        setChangeListNameBool(!changeListNameBool);
    }

    const handleListNameChange = (newListName, oldListName) => {
        if (!listNames.some(item => item.listName === newListName) && newListName !== "") {
            const newListNames = [...listNames];
            newListNames[findIndexOfJSON(oldListName)].listName = newListName;
            setListNames(newListNames);
            localStorage.removeItem(oldListName);
            history.push("/listCreator/" + newListName.replace(" ", "+"));
        }
    };

    const findIndexOfJSON = (value) => {
        return listNames.findIndex((item) => {
            return item.listName === value;
        });
    }

    const handleAddButtonClick = () => {
        if (inputValue !== "" && !items.some(temp => temp.itemName === inputValue)) {
            const newItem = {
                itemName: inputValue,
                quantity: quantityValue,
                itemMeasurement: itemMeasurement,
                isSelected: false,
            }

            const newItems = [...items, newItem];
            setItems(newItems);
            setInputValue("");
            setQuantityValue(1);
        } else {
            setInputValue("");
            setQuantityValue(1);
        }
    };

    const checkIfSelected = (value, index) => {
        return items[index].itemMeasurement === value
    }

    const [updatedItemNameValue, setUpdatedItemNameValue] = useState("");
    const [changeNameBool, setChangeNameBool] = useState(false);
    const [indexOfChangeNameBool, setIndexOfChangeNameBool] = useState(-1);

    const updateItemName = (value, index) => {
        if (value !== "") {
            const newItems = [...items];
            newItems[index].itemName = value;
            setItems(newItems);
            setUpdatedItemNameValue("");
        }
        setChangeNameBool(false);
        setIndexOfChangeNameBool(-1);
    }

    const disablePens = (index) => {
        setChangeNameBool(true);
        setIndexOfChangeNameBool(index);
    }

    const penIsDisabled = (index) => {
        return changeNameBool && !(index === indexOfChangeNameBool);
    }

    const updateItemQuantity = (value, index) => {
        const newItems = [...items];
        newItems[index].quantity = value;
        setItems(newItems);
    }

    const updateItemMeasurement = (value, index) => {
        const newItems = [...items];
        newItems[index].itemMeasurement = value;
        setItems(newItems);
    }

    const deleteItemFromList = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    }

    return (
        <div>
            <div className="mainContainer_ListCreator">
                {/*<div className="listName_ListCreator">*/}
                {!changeListNameBool ? (
                    <div className="listName_ListCreator">
                        {getName()}
                    </div>
                ) : (
                    <input className="listName_ListCreator" autoFocus={true} style={{
                        textAlign: "left",
                        cursor: "text"
                    }} value={newNameInputValue}
                           onChange={(event => setNewNameInputValue(event.target.value))}
                           placeholder="Neuer Listen Name..."/>
                )}
                {/*</div>*/}
                {/*<div>*/}
                    {!changeListNameBool ? (
                        <button className="button_ListCreator listNameChangeName_ListCreator"
                                onClick={() => {
                                    handleToggleChangeListNameBool();
                                    setNewNameInputValue("");
                                }}>
                            <FontAwesomeIcon icon={faPen}/>
                        </button>
                    ) : (
                        <button className="button_ListCreator listNameChangeName_ListCreator"
                                onClick={() => {
                                    handleToggleChangeListNameBool();
                                    handleListNameChange(newNameInputValue, getName());
                                }}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </button>
                    )}
                {/*</div>*/}


                <input className="newItemInputField_ListCreator"
                       value={inputValue} onChange={(event => setInputValue(event.target.value))}
                       placeholder="Gegenstandsname..."/>

                {/*<div className="itemQuantity_ListCreator">*/}
                <input className="itemQuantity_ListCreator"
                       value={quantityValue} onChange={(event => setQuantityValue(event.target.value))}
                       min={1} max={20}
                       placeholder={1} type="number"/>
                {/*</div>*/}
                {/*<div>*/}
                <select className="itemMeasurementType_ListCreator">
                    <option value="Stück" onClick={() => setItemMeasurement("stk.")}>stk.</option>
                    <option value="Pack" onClick={() => setItemMeasurement("pck.")}>pck.</option>
                    <option value="Gramm" onClick={() => setItemMeasurement("g")}>g</option>
                    {/*<option value="Kilogramm">kg</option>*/}
                </select>
                {/*</div>*/}

                {/*<div className="itemAddButton_ListCreator">*/}
                <button className="itemAddButton_ListCreator button_ListCreator"
                        onClick={handleAddButtonClick}>
                    <FontAwesomeIcon icon={faPlus}/>
                </button>
                {/*</div>*/}

                <div className="itemMapContainer_ListCreator">
                    {items.map((item, index) => (
                        <div className="itemMapContainerGrid_ListCreator" key={index}>
                            {!(index === indexOfChangeNameBool) ? (
                                <input className="itemInputBorderCss_ListCreator" value={item.itemName}
                                       disabled={true}/>
                            ) : (
                                <input className="itemInputBorderCss_ListCreator" value={updatedItemNameValue}
                                       onChange={(event => setUpdatedItemNameValue(event.target.value))}
                                       placeholder={item.itemName}/>
                            )}
                            {!(index === indexOfChangeNameBool) ? (
                                <button className="button_ListCreator marginCss" onClick={() => disablePens(index)}
                                        disabled={penIsDisabled(index)}>
                                    <FontAwesomeIcon icon={faPen}/>
                                </button>
                            ) : (
                                <button className="button_ListCreator marginCss"
                                        onClick={() => updateItemName(updatedItemNameValue, index)}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </button>
                            )}
                            <input className="itemQuantityCss_ListCreator" onChange={() => updateItemQuantity()}
                                   value={item.quantity} type="number"/>
                            <select className="itemMeasurementCss_ListCreator">
                                <option value="Stück" onClick={() => updateItemMeasurement("stk.", index)}
                                        selected={checkIfSelected("stk.", index)}>stk.
                                </option>
                                <option value="Pack" onClick={() => updateItemMeasurement("pck.", index)}
                                        selected={checkIfSelected("pck.", index)}>pck.
                                </option>
                                <option value="Gramm" onClick={() => updateItemMeasurement("g", index)}
                                        selected={checkIfSelected("g", index)}>g
                                </option>
                            </select>
                            <button className="deleteItemCss_ListCreator button_ListCreator" onClick={() => deleteItemFromList(index)}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </button>
                        </div>
                    ))}
                </div>

                {/*<div className="saveButton_ListCreator">*/}
                {/*    <button className="button_ListCreator">*/}
                {/*        <FontAwesomeIcon icon={faSave}/>*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}

export default ListCreator;