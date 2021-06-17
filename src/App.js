import './App.css';
import React, {useEffect, useState} from "react";
import {HashRouter, NavLink, Route, useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    makeStyles,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
import {faBars, faHammer, faHome, faPlus} from "@fortawesome/free-solid-svg-icons";
import ShoppingList from "./Components/ShoppingList";
import ListCreator from "./Components/ListCreator";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        background: "#ffb74d",
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const App = () => {
    const classes = useStyles();

    return (
        <HashRouter>
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        {/*<IconButton edge="start" className={classes.menuButton} color="inherit">*/}
                        {/*    <FontAwesomeIcon icon={faBars}/>*/}
                        {/*</IconButton>*/}
                        <Typography className={classes.title} varaint={"h2"}>Einkaufsliste für <i>Unsere
                            Kochrezepte</i></Typography>
                        <NavLink className={classes.menuButton} exact to={"/"}>
                            <FontAwesomeIcon icon={faHome} style={{color: "white"}}/>
                        </NavLink>
                        {/*<NavLink className={classes.menuButton} to={"/login"}>Login</NavLink>*/}
                        <NavLink className={classes.menuButton} to={"/listCreator/Neue+Liste"}>
                            <FontAwesomeIcon icon={faHammer} style={{color: "white"}}/>
                        </NavLink>
                    </Toolbar>
                </AppBar>
            </div>
            <div className="routes">
                <Route exact path="/" component={ShoppingLists}/>
                {/*<Route path="/login" component={Login}/>*/}
                {/*<Route path="/listCreator" component={ListCreatorView}/>*/}
                <Route path="/listCreator/:name" component={ListCreatorView}/>
            </div>
        </HashRouter>
    );
}

const ShoppingLists = () => {
    const [listNames, setlistNames] = useState(
        JSON.parse(localStorage.getItem("ListNames"))
        ||
        [
            {listName: "Standart Liste"},
        ]
    );

    useEffect(() => {
        localStorage.setItem("ListNames", JSON.stringify(listNames));
    }, [listNames]);

    const [newListNameValue, setNewListNameValue] = useState("");

    const handleAddList = (newListName) => {
        if (!listNames.some(item => item.listName === newListName)) {
            const newListNameObject = {listName: newListName};
            const newListNames = [...listNames, newListNameObject];
            setlistNames(newListNames);

            const tmp = newListName;
            setNewListNameValue("");

            // console.log(listNames);

            localStorage.setItem("ListNames", JSON.stringify(newListNames));
            localStorage.setItem(tmp, JSON.stringify([{itemName: "Banane", quantity: 1, itemMeasurement: "stk.", isSelected: false}]));

            handleOpenListCreator(tmp);
        }
    };

    const handleDeleteList = (index, oldListName) => {
        const newListNames = [...listNames];
        newListNames.splice(index, 1);
        localStorage.removeItem(oldListName);
        setlistNames(newListNames);
    };

    // const handleListNameChange = (index, newListName, oldListName) => {
    //     if (!listNames.some(item => item.listName === newListName)) {
    //         const newListNames = [...listNames];
    //         newListNames[index].listName = newListName;
    //         localStorage.removeItem(oldListName);
    //         setlistNames(newListNames);
    //     }
    // };

    const history = useHistory();
    const handleOpenListCreator = (listName) => {
        // const tmp = listName.replace(" ", "+");
        history.push("/listCreator/" + listName.replace(" ", "+"));
    }

    const [openDialog, setOpenDialog] = useState(false);
    const handleDialogAddListOpen = () => {
        setOpenDialog(true);
    };
    const handleDialogAddListClose = () => {
        setOpenDialog(false);
    };

    return (
        <div className="mainContainer">
            {/*<div className="nav">*/}
            {/*    <div className="buttonContainer">*/}
            {/*        <button className="addNewListButton"*/}
            {/*                onClick={handleDialogAddListOpen}>*/}
            {/*            <FontAwesomeIcon icon={faPlus}*/}
            {/*                             className="fontAwesomeIcon"/>*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <Dialog open={openDialog}
                    onClose={handleDialogAddListClose}>
                <DialogContent>
                    <TextField id="inputField"
                               onChange={(event) => setNewListNameValue(event.target.value)}
                               autoFocus={true}
                               margin="dense"
                               label="Listenname"
                               type="text"
                               fullWidth={true}/>
                </DialogContent>
                <DialogActions>
                    <Button id="submit-button" onClick={() => {
                        handleDialogAddListClose();
                        handleAddList(newListNameValue);
                    }}>
                        Bestätigen
                    </Button>
                    <Button id="cancel-button" onClick={handleDialogAddListClose}>
                        Abbrechen
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="main">
                    {listNames.map((list, index) => (
                        <div key={index} className="shopping-lists-container">
                            <ShoppingList name={list.listName}
                                          deleteFunction={handleDeleteList}
                                          handleOpenListCreator={handleOpenListCreator}
                                          index={index}/>
                        </div>
                    ))}
            </div>
        </div>
    )
}

// const Login = () => {
//     const useStyles = makeStyles((theme) => ({
//         paper: {
//             marginTop: theme.spacing(8),
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//         },
//         avatar: {
//             margin: theme.spacing(1),
//             backgroundColor: theme.palette.secondary.main,
//         },
//         form: {
//             width: '100%', // Fix IE 11 issue.
//             marginTop: theme.spacing(1),
//         },
//         submit: {
//             margin: theme.spacing(3, 0, 2),
//         },
//     }));
//
//     const classes = useStyles();
//
//     return (
//         <div className="background">
//             <p>Login Stuff</p>
//             <Container component="main" maxWidth="xs">
//                 <CssBaseline/>
//                 <div className={classes.paper}>
//                     <Avatar className={classes.avatar}>
//                         {/*<LockOutlinedIcon/>*/}
//                     </Avatar>
//                     <Typography component="h1" variant="h5">
//                         Sign in
//                     </Typography>
//                     <form className={classes.form} noValidate>
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             id="email"
//                             label="Email Address"
//                             name="email"
//                             autoComplete="email"
//                             autoFocus
//                         />
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             name="password"
//                             label="Password"
//                             type="password"
//                             id="password"
//                             autoComplete="current-password"
//                         />
//                         <FormControlLabel
//                             control={<Checkbox value="remember" color="primary"/>}
//                             label="Remember me"
//                         />
//                         <Button
//                             type="submit"
//                             fullWidth
//                             variant="contained"
//                             color="primary"
//                             className={classes.submit}
//                         >
//                             Sign In
//                         </Button>
//                         <Grid container>
//                             <Grid item xs>
//                                 <Link href="#" variant="body2">
//                                     Forgot password?
//                                 </Link>
//                             </Grid>
//                             <Grid item>
//                                 <Link href="#" variant="body2">
//                                     {"Don't have an account? Sign Up"}
//                                 </Link>
//                             </Grid>
//                         </Grid>
//                     </form>
//                 </div>
//                 <Box mt={8}>
//                     {/*<Copyright />*/}
//                 </Box>
//             </Container>
//             <Typography variant="body2" color="textSecondary" align="center">
//                 {'Copyright © '}
//                 <Link color="inherit" href="https://material-ui.com/">
//                     Your Website
//                 </Link>{' '}
//                 {new Date().getFullYear()}
//                 {'.'}
//             </Typography>
//         </div>
//     )
// }

const ListCreatorView = () => {
    return (
        <div className="mainContainer">
            <div className="main">
                <ListCreator name="ListName"/>
            </div>
        </div>
    )
}

export default App;
