import React, {useRef, useState} from "react";
import {useTodoItems} from './TodoItemsContext';
import {useForm, Controller} from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Portal from '@material-ui/core/Portal';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";

const useInputStyles = makeStyles(() => ({
    root: {
        marginBottom: 24,
    },
}));

export default function TodoItemForm() {
    const [isShowFilterWindow, setIsShowFilterWindow] = useState(true)
    const classes = useInputStyles();
    const {dispatch} = useTodoItems();
    const {control, handleSubmit, reset, watch} = useForm();
    // const container = useRef(null);

    const {todoItems} = useTodoItems();

    const handleOpenWindowFilter = () => {
        setIsShowFilterWindow(false)
    }
    const handleCloseWindowFilter = () => {
     setIsShowFilterWindow(true)
    }
    // console.log(todoItems.length > 0 ? true : false)

    return (
        <form
            onSubmit={handleSubmit((formData) => {
                dispatch({type: 'add', data: {todoItem: formData}});
                reset({title: '', details: ''});
            })}
        >
            <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{required: true}}
                render={({field}) => (
                    <TextField
                        {...field}
                        label="TODO"
                        fullWidth={true}
                        className={classes.root}
                    />
                )}
            />
            <Controller
                name="details"
                control={control}
                defaultValue=""
                render={({field}) => (
                    <TextField
                        {...field}
                        label="Details"
                        fullWidth={true}
                        multiline={true}
                        className={classes.root}
                    />
                )}
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!watch('title')}
            >
                Add
            </Button>
            {
                todoItems.length > 0 ?
                isShowFilterWindow ?
                    <div style={{
                        marginTop: 24
                    }}
                    >
                        <Button variant="contained" color="primary" onClick={handleOpenWindowFilter}
                        >Filter points</Button>
                    </div>
                    :
                    <div style={{
                        border: '2px solid black',
                        borderRadius: '8px',
                        padding: '15px',
                        marginTop: 24,
                        position: 'relative'
                    }}
                    >
                        <IconButton
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: 5
                            }}
                            aria-label="cancel" onClick={handleCloseWindowFilter}>
                            <CancelIcon/>
                        </IconButton>
                        <Typography variant="h5" component="h1">
                            Filter points by the tags
                        </Typography>
                        <Controller
                            name="add_tags"
                            control={control}
                            defaultValue=""
                            rules={{required: true}}
                            render={({field}) => (
                                <TextField
                                    {...field}
                                    label="Text tags here"
                                    fullWidth={true}
                                    className={classes.root}
                                />
                            )}
                        />
                        {

                        }
                        {/*<Button*/}
                        {/*    variant="contained"*/}
                        {/*    color="primary"*/}
                        {/*    type="submit"*/}
                        {/*    disabled={!watch('add_tags')}*/}
                        {/*>*/}
                        {/*    Add*/}
                        {/*</Button>*/}
                    </div> : null
            }
        </form>
    );
}
