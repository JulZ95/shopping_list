import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, makeStyles, Menu, MenuItem, TextField} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faChevronDown,
    faChevronUp,
    faCircle,
    faEllipsisV,
    faPlus, faTrash
} from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
    shoppingList: {
        display: "flex",
        justifyContent: "center",
        margin: 10,
    },
}));

const ShoppingList = (props) => {
    const classes = useStyles();

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
        <div className={classes.shoppingList}>
            <div className="main-container">
                <div className="list-header">
                    <span>{props.name}</span>
                    <Button aria-controls="list-menu"
                            aria-haspopup="true"
                            onClick={handleOpenSettings}>
                        <FontAwesomeIcon className="fontAwesomeIcon"
                                         icon={faEllipsisV}/>
                    </Button>
                    <Menu id="list-menu"
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
                <div className="item-input">
                    <input value={inputValue} onChange={(event => setInputValue(event.target.value))}
                           className="add-item-input" placeholder="Add an item..."/>
                    <FontAwesomeIcon className="fontAwesomeIcon" icon={faPlus} onClick={() => handleAddButtonClick()}/>
                </div>
                <div className="item-list">
                    {items.map((item, index) => (
                        <div key={index}>
                            <div className="item-container" onClick={() => toggleComplete(index)}>
                                {item.isSelected ? (
                                    <div>
                                        <FontAwesomeIcon className="fontAwesomeIcon" icon={faCheckCircle}/>
                                        <span className="completed">{item.itemName}</span>
                                    </div>
                                ) : (
                                    <div>
                                        <FontAwesomeIcon className="fontAwesomeIcon" icon={faCircle}/>
                                        <span>{item.itemName}</span>
                                    </div>
                                )}
                            </div>
                            <div className="quantity-delete-container">
                                <FontAwesomeIcon className="fontAwesomeIcon" icon={faChevronUp}
                                                 onClick={() => handleIncreaseQuantity(index)}/>
                                <span>{item.quantity}</span>
                                <FontAwesomeIcon className="fontAwesomeIcon" icon={faChevronDown}
                                                 onClick={() => handleDecreaseQuantity(index)}/>
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteItem(index)}/>
                            </div>
                            <div className="delete-container">
                            </div>
                        </div>
                    ))}
                </div>
                <div className="total-quantity">
                    Warenkorbanzahl: {totalItemCount}
                </div>
            </div>
        </div>
    )
}

export default ShoppingList;