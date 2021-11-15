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
import {motion} from "framer-motion";
import {TodoItemCard} from "./TodoItems";

const useInputStyles = makeStyles(() => ({
    root: {
        marginBottom: 24
    },
}));
const useFilteredTodoItemsStyles = makeStyles(() => ({
    root: {
        margin:'0 14px 14px 0',
        paddingLeft: 13,
        fontWeight: 700,
        fontSize: '16px',
        fontFamily: 'Century Gothic'
    },
}));

const spring = {
    type: 'spring',
    damping: 25,
    stiffness: 120,
    duration: 0.25,
};

export default function TodoItemForm() {
    const [userSelectTags, setUserSelectTags] = useState<any>([])
    const [valueSelectTag, setValueSelectTag] = useState('')
    const [isShowFilterWindow, setIsShowFilterWindow] = useState(true)
    const classes = useInputStyles();
    const classesFilteredTodoItems = useFilteredTodoItemsStyles();
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

    const handleAddTags = (event) => {
        if (event.key === 'Enter') {
            if (event.target.value.length > 0) {
                setUserSelectTags([...userSelectTags, valueSelectTag])
                setValueSelectTag('')
            }
        }
    }

    const handleOnChangeValueSelectTag = event => setValueSelectTag(event.target.value)

    const filteredToDoItems = todoItems.filter(item => item.tags.some(tag => userSelectTags.includes(tag)))
    // console.log(todoItems.map(item => item.tags))
    // console.log(userSelectTags)
    console.log(filteredToDoItems.map(item => item))
    console.log(todoItems)


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
                                    onChange={handleOnChangeValueSelectTag}
                                    value={valueSelectTag}
                                    onKeyDown={handleAddTags}
                                />
                            )}
                        />
                        {
                            userSelectTags?.map((item, index) => {
                                return(
                                    <span
                                        style={{
                                            marginLeft: '3px',
                                            background: '#1976d1',
                                            borderRadius: '8px',
                                            padding: '5px',
                                            color: '#fff',
                                            fontWeight: 700,
                                            fontSize: '16px',
                                            fontFamily: 'Century Gothic'
                                        }}
                                        key={index}>#{item}</span>
                                )
                            })
                        }
                        {
                            <ol className={classesFilteredTodoItems.root}>
                                {filteredToDoItems.map((item) => (
                                    <motion.li key={item.id} transition={spring} layout={true}>
                                        <TodoItemCard item={item}/>
                                    </motion.li>
                                ))}
                            </ol>
                        }
                    </div> : null
            }
        </form>
    );
}
