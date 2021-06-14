import {useState} from "react";
import "./ListCreator.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPen, faPlus} from "@fortawesome/free-solid-svg-icons";

const ListCreator = (props) => {

    const [inputValue, setInputValue] = useState("");
    const [newNameInputValue, setNewNameInputValue] = useState("");

    const [quantityValue, setQuantityValue] = useState(1);

    const [changeListNameBool, setChangeListNameBool] = useState(false);
    const handleToggleChangeListNameBool = () => {
        setChangeListNameBool(!changeListNameBool);
    }

    return (
        <div>
            <div className="mainContainer_ListCreator">

                <div className="listName_ListCreator">
                    {!changeListNameBool ? (
                        <div>
                            {props.name}
                        </div>
                    ) : (
                        <input className="listName_ListCreator" value={newNameInputValue}
                               onChange={(event => setNewNameInputValue(event.target.value))}
                               placeholder="Neuer Listen Name..."/>
                    )}
                </div>
                <div>
                    {!changeListNameBool ? (
                        <button className="button_ListCreator listNameChangeName_ListCreator"
                                onClick={() => {
                                    handleToggleChangeListNameBool();
                                    setNewNameInputValue("")
                                }}>
                            <FontAwesomeIcon icon={faPen}/>
                        </button>
                    ) : (
                        <button className="button_ListCreator listNameChangeName_ListCreator"
                                onClick={handleToggleChangeListNameBool}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </button>
                    )}
                </div>

                <div className="newItemInputField_ListCreator">
                    <input value={inputValue} onChange={(event => setInputValue(event.target.value))}
                           placeholder="Gegenstandsname..."/>
                </div>
                <div className="itemQuantity_ListCreator">
                    <input className="itemQuantityCss_ListCreator"
                           value={quantityValue} onChange={(event => setQuantityValue(event.target.value))}
                           min={1} max={20}
                           placeholder={1} type="number"/>
                </div>
                <div className="itemMeasurementType_ListCreator">
                    <select>
                        <option value="Stück">stk.</option>
                        <option value="Pack">pck.</option>
                        <option value="Gramm">g</option>
                        <option value="Kilogramm">kg</option>
                    </select>
                </div>

                <div className="itemAddButton_ListCreator">
                    <button className="button_ListCreator">
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </div>


            </div>
        </div>
    )
}

export default ListCreator;