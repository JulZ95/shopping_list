import "./ShoppingList.css";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import ItemListMap from "./ItemListMap";

const ShoppingList = (props) => {
    //Items Array with Inputvalue for new Items and Total Itemcount
    const [items, setItems] = useState(
        JSON.parse(localStorage.getItem(props.name))
        ||
        [
            {itemName: "Erdbeere", quantity: 2, itemMeasurement: "pck.", isSelected: false},
        ]
    );

    const [finishedItemCount, setFinishedItemCount] = useState(0);

    //UseEffect for every Rerender
    useEffect(() => {
        calcFinishedItems();
        localStorage.setItem(props.name, JSON.stringify(items));
    });

    const toggleComplete = (index) => {
        const newItems = [...items];
        newItems[index].isSelected = !newItems[index].isSelected;
        setItems(newItems);
    };

    const calcFinishedItems = () => {
        let itemsFinished = 0;
        for (let i = 0; i < items.length; i++) {
            if(items[i].isSelected) {
                itemsFinished++;
            }
        }
        setFinishedItemCount(itemsFinished);
    }

    return (
        <div className="listContainer">
            <span className="listHeaderTitle">{props.name}</span>

            <button className="button_ShoppingList editListButton_ShoppingList"
                    onClick={() => {
                props.handleOpenListCreator(props.name);
            }}>
                <FontAwesomeIcon icon={faPen}/>
            </button>

            <button className="button_ShoppingList deleteListButton_ShoppingList" onClick={() => {
                // eslint-disable-next-line no-restricted-globals
                let bool = confirm("Liste Wirklich Löschen?");

                if(bool) {
                    props.deleteFunction(props.index, props.name);
                }
            }}>
                <FontAwesomeIcon icon={faTrash}/>
            </button>

            <div className="divider1"/>

            <ItemListMap name={props.name} toggleComplete={toggleComplete} items={items}/>

            <div className="divider2"/>

            <label className="listTotalQuantity">
                Fortschritt: {finishedItemCount} / {items.length}
            </label>
            <div className="progressBar_ShoppingList">
                <progress value={(100 / items.length) * finishedItemCount} max="100"/>
            </div>
        </div>
    )
}

export default ShoppingList;