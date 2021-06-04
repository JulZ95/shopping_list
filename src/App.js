import './App.css';
import React, {useEffect, useState} from "react";
import {HashRouter, NavLink, Route} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Checkbox,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    Grid,
    IconButton,
    Link,
    makeStyles,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
import {faBars, faPlus} from "@fortawesome/free-solid-svg-icons";
import ShoppingList from "./Components/ShoppingList";

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
    flex: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
    },
}));

const App = () => {
    const classes = useStyles();

    return (
        <HashRouter>
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit">
                            <FontAwesomeIcon icon={faBars}/>
                        </IconButton>
                        <Typography className={classes.title} varaint={"h2"}>Einkaufsliste für <i>Unsere
                            Kochrezepte</i></Typography>
                        <NavLink className={classes.menuButton} exact to={"/"}>Listen Übersicht</NavLink>
                        <NavLink className={classes.menuButton} to={"/login"}>Login</NavLink>
                        <NavLink className={classes.menuButton} to={"/home3"}>Home3</NavLink>
                    </Toolbar>
                </AppBar>
            </div>
            <div className="routes">
                <Route exact path="/" component={ShoppingLists}/>
                <Route path="/login" component={Login}/>
                <Route path="/home3" component={Home3}/>
            </div>
        </HashRouter>
    );
}

const ShoppingLists = () => {
    const classes = useStyles();

    const [listNames, setlistNames] = useState(
        JSON.parse(localStorage.getItem("ListNames"))
        ||
        [
            {listName: "List1"},
            {listName: "List2"},
        ]
    );

    useEffect(() => {
        localStorage.setItem("ListNames", JSON.stringify(listNames));
    });

    const [listNameValue, setListNameValue] = useState("");

    const handleAddList = (newListName) => {
        if (!listNames.some(item => item.listName === newListName)) {
            const newList = {listName: newListName};
            const newListNames = [...listNames, newList];
            setlistNames(newListNames);
        }
    };

    const handleDeleteList = (index, oldListName) => {
        const newListNames = [...listNames];
        newListNames.splice(index, 1);
        localStorage.removeItem(oldListName);
        setlistNames(newListNames);
    };

    const handleListNameChange = (index, newListName, oldListName) => {
        if (!listNames.some(item => item.listName === newListName)) {
            const newListNames = [...listNames];
            newListNames[index].listName = newListName;
            localStorage.removeItem(oldListName);
            setlistNames(newListNames);
        }
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
                <FontAwesomeIcon icon={faPlus}
                                 className="fontAwesomeIcon"/>
            </Button>
            <Dialog open={openDialog}
                    onClose={handleDialogAddListClose}>
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
                        handleAddList(listNameValue);
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
                    <ShoppingList name={list.listName}
                                  deleteFunction={handleDeleteList}
                                  nameChangeFunction={handleListNameChange}
                                  index={index}/>
                </div>
            ))}
        </div>
    )
}

const Login = () => {
    const useStyles = makeStyles((theme) => ({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
    }));

    const classes = useStyles();

    return (
        <div className="background">
            <p>Login Stuff</p>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        {/*<LockOutlinedIcon/>*/}
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>
                    {/*<Copyright />*/}
                </Box>
            </Container>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://material-ui.com/">
                    Your Website
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
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
