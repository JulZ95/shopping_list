import "./ShoppingList.css";
import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, makeStyles, Menu, MenuItem, TextField} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faChevronDown,
    faChevronUp,
    faCircle,
    faEllipsisV,
    faPlus,
    faTrash
} from "@fortawesome/free-solid-svg-icons";

// const useStyles = makeStyles((theme) => ({
//     root: {
//         // display: "flex",
//         // justifyContent: "center",
//         margin: 10,
//     },
//     headerStyling: {
//         height: 20,
//         fontSize: 10,
//         // display: "flex",
//         // justifyContent: "center",
//     },
//     cardHeaderTitle: {
//         fontSize: "1rem",
//     },
//     cardHeaderAction: {
//         fontSize: "1rem",
//         color: "Black",
//     },
//     settingsButton: {
//         width: 20,
//     },
// }));

const ShoppingList = (props) => {
    // const classes = useStyles();

    const [listNameValue, setListNameValue] = useState("");

    //Items Array with Inputvalue for new Items and Total Itemcount
    const [items, setItems] = useState(
        JSON.parse(localStorage.getItem(props.name))
        ||
        [
            {itemName: "Banane", quantity: 1, isSelected: false},
            {itemName: "Apfel", quantity: 2, isSelected: true},
            {itemName: "Erdbeere", quantity: 3, isSelected: false},
        ]
    );

    const [inputValue, setInputValue] = useState("");

    const [totalItemCount, setTotalItemCount] = useState(6);

    //UseEffect for every Rerender
    useEffect(() => {
        calcNewTotal();
        localStorage.setItem(props.name, JSON.stringify(items));
    });

    //List Operations
    const handleAddButtonClick = () => {
        if (inputValue !== "" && !items.some(temp => temp.itemName === inputValue)) {
            const newItem = {
                itemName: inputValue,
                quantity: 1,
                isSelected: false,
            }

            const newItems = [...items, newItem];
            setItems(newItems);
            setInputValue("");
        } else {
            setInputValue("");
        }
    };

    const handleIncreaseQuantity = (index) => {
        const newItems = [...items];
        newItems[index].quantity++;
        setItems(newItems);
    };

    const handleDecreaseQuantity = (index) => {
        const newItems = [...items];

        if (newItems[index].quantity > 1) {
            newItems[index].quantity--;
        }
        setItems(newItems);
    };

    const handleDeleteItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const toggleComplete = (index) => {
        const newItems = [...items];
        newItems[index].isSelected = !newItems[index].isSelected;
        setItems(newItems);
    };

    const calcNewTotal = () => {
        const totalItemCount = items.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
        setTotalItemCount(totalItemCount)
    };

    //Menu Hook and Functionality
    const [anchorEL, setAnchorEL] = useState(null);

    const handleOpenSettings = (event) => {
        setAnchorEL(event.currentTarget);
    };

    const handleCloseSettings = () => {
        setAnchorEL(null);
    };

    //Dialog Hook with Functionality
    const [open, setOpen] = useState(false);

    const handleListNameChangeOpenDialog = () => {
        setOpen(true);
    };

    const handleListNameChangeCloseDialog = () => {
        setOpen(false);
    };

    return (
        <div className="listContainer">
            <span className="listHeaderTitle">{props.name}</span>
            <button className="listHeaderSettings"
                    aria-label="settings" aria-controls="listMenu" aria-haspopup="true"
                    onClick={handleOpenSettings}>
                <FontAwesomeIcon icon={faEllipsisV}/>
            </button>

            <div>
                <Menu id="listMenu"
                      anchorEl={anchorEL}
                      open={Boolean(anchorEL)}
                      onClose={handleCloseSettings}>
                    <MenuItem onClick={() => {
                        handleCloseSettings();
                        handleListNameChangeOpenDialog();
                    }}>
                        Liste Umbenennen
                    </MenuItem>
                    <MenuItem onClick={() => {
                        handleCloseSettings();
                        props.deleteFunction(props.index, props.name);
                    }}>Delete List</MenuItem>
                </Menu>

                <Dialog open={open}
                        onClose={handleListNameChangeCloseDialog}
                        aria-labelledby="form-dialog-title">
                    <DialogContent>
                        <TextField id="inputField"
                                   onChange={(event) => setListNameValue(event.target.value)}
                                   autoFocus={true}
                                   margin="dense"
                                   label="Neuer Listenname"
                                   type="text"
                                   fullWidth={true}/>
                    </DialogContent>
                    <DialogActions>
                        <Button id="submit-button" onClick={() => {
                            props.nameChangeFunction(props.index, listNameValue, props.name);
                            handleListNameChangeCloseDialog();
                        }}>
                            Bestätigen
                        </Button>
                        <Button id="cancel-button" onClick={handleListNameChangeCloseDialog}>
                            Abbrechen
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <div className="divider1"/>

            <input value={inputValue} onChange={(event => setInputValue(event.target.value))}
                   className="listNewItemInput" placeholder="Add an item..."/>
            {/*<div className="listNewItemInput">*/}
            {/*</div>*/}

            <button className="listNewItemAddButton"
                    aria-label="addButton" aria-controls="" aria-haspopup="false"
                    onClick={handleAddButtonClick}>
                <FontAwesomeIcon icon={faPlus}/>
            </button>

            <div className="divider2"/>

            <div className="listItems">
                {items.map((item, index) => (
                    <div className="listItemTest" key={index}>
                        <div className="itemContainer" onClick={() => toggleComplete(index)}>
                            {item.isSelected ? (
                                <div>
                                    <button className="itemCompletedButton listItemButton">
                                        <FontAwesomeIcon icon={faCheckCircle}/>
                                    </button>
                                    <span className="completedItem">{item.itemName}</span>
                                </div>
                            ) : (
                                <div>
                                    <button className="itemCompletedButton listItemButton">
                                        <FontAwesomeIcon icon={faCircle}/>
                                    </button>
                                    <span>{item.itemName}</span>
                                </div>
                            )}
                        </div>

                        <button className="listItemIncreaseQuantityButton listItemButton"
                                aria-label="" aria-controls="" aria-haspopup="false"
                                onClick={() => handleIncreaseQuantity(index)}>
                            <FontAwesomeIcon icon={faChevronUp}/>
                        </button>

                        <span className="listItemQuantity">{item.quantity}</span>

                        <button className="listItemDecreaseQuantityButton listItemButton"
                                aria-label="" aria-controls="" aria-haspopup="false"
                                onClick={() => handleDecreaseQuantity(index)}>
                            <FontAwesomeIcon icon={faChevronDown}/>
                        </button>

                        <button className="listItemDeleteItemButton listItemButton"
                                aria-label="" aria-controls="" aria-haspopup="false"
                                onClick={() => handleDeleteItem(index)}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                        <div className="divider3"/>
                    </div>
                ))}
            </div>
            <div className="listTotalQuantity">
                Warenkorbanzahl: {totalItemCount}
            </div>
        </div>
    )
}

export default ShoppingList;