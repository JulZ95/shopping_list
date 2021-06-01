import './App.css';
import React from "react";
import {useEffect, useState} from "react";
import {HashRouter, NavLink, Route} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    AppBar,
    Button,
    Dialog, DialogActions, DialogContent,
    makeStyles,
    Menu,
    MenuItem, TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
import {
    faCheckCircle,
    faChevronDown,
    faChevronUp,
    faCircle,
    faEllipsisV,
    faPlus,
    faTrash
} from "@fortawesome/free-solid-svg-icons";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    flex: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    shoppingList: {
        display: "flex",
        justifyContent: "center",
        margin: 10,
    },
}));

const App = () => {
    const classes = useStyles();

    return (
        <HashRouter>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography className={classes.title} varaint={"h2"}>Shopping List</Typography>
                        <NavLink className={classes.menuButton} exact to={"/"}>Shopping Lists</NavLink>
                        <NavLink className={classes.menuButton} to={"/home2"}>Home2</NavLink>
                        <NavLink className={classes.menuButton} to={"/home3"}>Home3</NavLink>
                    </Toolbar>
                </AppBar>
            </div>
            <div className="routes">
                <Route exact path="/" component={ShoppingLists}/>
                <Route path="/home2" component={Home2}/>
                <Route path="/home3" component={Home3}/>
            </div>
        </HashRouter>
    );
}

const ShoppingLists = () => {
    const classes = useStyles();

    // const [lists, setLists] = useState(() => {
    //     let data = "";
    //     for (let i = 0, len = localStorage.length; i < len; i++) {
    //         data +=JSON.parse(localStorage.getItem(localStorage.key(i)));
    //     }
    //     return data;
    // });

        // ||
        // [
        //     {listName: "List1"},
        //     {listName: "List2"},
        // ])

    const [listNames, setlistNames] = useState(
        localStorage.getItem("ListNames")
        ||
        [
        {listName: "List1"},
        {listName: "List2"},
        ]
    );

    useEffect(() => {
        localStorage.setItem("ListNames", JSON.stringify(listNames));
    });

    // const getListNames = () => {
    //     let newListNames = [];
    //     for (let i = 0, len = localStorage.length; i < len; i++) {
    //         const newListName = [
    //             {listName: JSON.parse(localStorage.getItem(localStorage.key(i)))},
    //         ]
    //         newListNames = [...newListNames, newListName];
    //     }
    //     setLists(newListNames);
    // };

    const [listNameValue, setListNameValue] = useState("");

    const handleAddList = () => {

    };

    const handleDeleteList = () => {

    };

    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogAddListOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogAddListClose = () => {
        setOpenDialog(false);
    };

    return (
        <div className={classes.flex}>
            <Button onClick={handleDialogAddListOpen}>
                <FontAwesomeIcon icon={faPlus} className="fontAwesomeIcon"/>
            </Button>
            <Dialog open={openDialog} onClose={handleDialogAddListClose}>
                <DialogContent>
                    <TextField id="inputField"
                               onChange={(event) => setListNameValue(event.target.value)}
                               autoFocus={true}
                               margin="dense"
                               label="Listenname"
                               type="text"
                               fullWidth={true}/>
                </DialogContent>
                <DialogActions>
                    <Button id="submit-button" onClick={() => {
                        handleAddList();
                        handleDialogAddListClose();
                    }}>
                        Bestätigen
                    </Button>
                    <Button id="cancel-button" onClick={handleDialogAddListClose}>
                        Abbrechen
                    </Button>
                </DialogActions>
            </Dialog>

            {listNames.map((list, index) => (
                <div key={index} className="shopping-lists-container">
                    <ShoppingList name={list.listName} closeFunction={handleDeleteList()}/>
                </div>
            ))}
        </div>
    )
}

const ShoppingList = (props) => {
    const classes = useStyles();

    //List Name and Value
    const [listName, setListName] = useState(
        JSON.parse(localStorage.getItem(props.name))[0]
        ||
        "Meine Liste"
    );

    const [listNameValue, setListNameValue] = useState("");

    //Items Array with Inputvalue for new Items and Total Itemcount
    const [items, setItems] = useState(
        JSON.parse(localStorage.getItem(props.name))[1]
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
        localStorage.setItem(props.name, JSON.stringify([listName, items]));
    });

    //List Operations
    const handleAddButtonClick = () => {
        if (inputValue !== "") {
            const newItem = {
                itemName: inputValue,
                quantity: 1,
                isSelected: false,
            }

            const newItems = [...items, newItem];
            setItems(newItems);
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
        // calcNewTotal();
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

    const handleChangeListName = () => {
        setListName(listNameValue);
    };

    return (
        <div className={classes.shoppingList}>
            <div className="main-container">
                <div className="list-header">
                    <span>{listName}</span>
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
                                handleChangeListName();
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
                            <div className="quantity-container">
                                <FontAwesomeIcon className="fontAwesomeIcon" icon={faChevronUp}
                                                 onClick={() => handleIncreaseQuantity(index)}/>
                                <span>{item.quantity}</span>
                                <FontAwesomeIcon className="fontAwesomeIcon" icon={faChevronDown}
                                                 onClick={() => handleDecreaseQuantity(index)}/>
                            </div>
                            <div className="delete-container">
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteItem(index)}/>
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

const Home2 = () => {
    return (
        <div className="background">
            <p>Home2 Stuff</p>
        </div>
    )
}

const Home3 = () => {
    return (
        <div className="background">
            <p>Home3 Stuff</p>
        </div>
    )
}

export default App;
