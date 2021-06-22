import "./ShoppingList.css";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import ItemListMap from "./ItemListMap";

const ShoppingList = (props) => {
    //Items Array with Inputvalue for new Items and Total Itemcount
    // const [items, setItems] = useState(
    //     JSON.parse(localStorage.getItem(props.name))
    //     ||
    //     [
    //         {itemName: "Erdbeere", quantity: 2, itemMeasurement: "pck.", isSelected: false},
    //     ]
    // );

    // console.log("Item Shit");
    // console.log(props.itemData);

    const [finishedItemCount, setFinishedItemCount] = useState(0);

    //UseEffect for every Rerender
    useEffect(() => {
        calcFinishedItems();
        // console.log("Recalcing: ShoppingList");
        // localStorage.setItem(props.name, JSON.stringify(items));
    });

    // useEffect(() => {
    //     console.log("Should Rerender: ShoppingList");
    // }, [props.items]);

    // const toggleComplete = (index) => {
    //     const newItems = [...items];
    //     newItems[index].isSelected = !newItems[index].isSelected;
    //     setItems(newItems);
    // };

    const calcFinishedItems = () => {
        let itemsFinished = 0;
        if(props.items !== null) {
            for (let i = 0; i < props.items.length; i++) {
                if (props.items[i].isSelected) {
                    itemsFinished++;
                }
            }
            setFinishedItemCount(itemsFinished);
        }
    }

    return (
        <div>
            {props.items !== null ? (
                <div className="listContainer">
                    <span className="listHeaderTitle">{props.listName}</span>

                    <button className="button_ShoppingList editListButton_ShoppingList"
                            onClick={() => {
                                props.handleOpenListCreator(props.listName);
                            }}>
                        <FontAwesomeIcon icon={faPen}/>
                    </button>

                    <button className="button_ShoppingList deleteListButton_ShoppingList" onClick={() => {
                        props.deleteFunction(props.listIndex, props.listName);
                    }}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>

                    <div className="divider1"/>

                    <ItemListMap toggleComplete={props.toggleComplete} items={props.items}
                                 listIndex={props.listIndex}/>

                    <div className="divider2"/>

                    <label className="listTotalQuantity">
                        Fortschritt: {finishedItemCount} / {props.items.length}
                    </label>
                    {props.items.length > 0 ? (
                        <div className="progressBar_ShoppingList">
                            <progress value={(100 / props.items.length) * finishedItemCount}
                                      max="100"/>
                        </div>
                    ) : (
                        <div className="progressBar_ShoppingList"/>
                    )}
                </div>
            ) : (
                <span>Wuff</span>
            )}
        </div>
    )
}

export default ShoppingList;