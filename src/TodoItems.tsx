import {useCallback, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import {motion} from 'framer-motion';
import {TodoItem, useTodoItems} from './TodoItemsContext';

const spring = {
    type: 'spring',
    damping: 25,
    stiffness: 120,
    duration: 0.25,
};

const useTodoItemListStyles = makeStyles({
    root: {
        listStyle: 'none',
        padding: 0,
    },
});

export const TodoItemsList = function () {
    const {todoItems} = useTodoItems();

    const classes = useTodoItemListStyles();

    const sortedItems = todoItems.slice().sort((a, b) => {
        if (a.done && !b.done) {
            return 1;
        }

        if (!a.done && b.done) {
            return -1;
        }

        return 0;
    });

    return (
        <ul className={classes.root}>
            {sortedItems.map((item) => (
                <motion.li key={item.id} transition={spring} layout={true}>
                    <TodoItemCard item={item}/>
                </motion.li>
            ))}
        </ul>
    );
};

const useTodoItemCardStyles = makeStyles({
    root: {
        marginTop: 24,
        marginBottom: 24,
    },
    doneRoot: {
        textDecoration: 'line-through',
        color: '#888888',
    },
});

export const TodoItemCard = function ({item}: { item: TodoItem }) {

    const [isSelectText, setIsSelectText] = useState(false)
    const [isShowAddTags, setIsShowAddTags] = useState(false)
    const [valuePoint, setValuePoint] = useState('')
    // const [valueTag, setValueTag] = useState('')

    const classes = useTodoItemCardStyles();
    const {dispatch} = useTodoItems();

    const handleEdit = () => {
        setIsSelectText(true)
    }
    const handleCancel = () => {
        setIsSelectText(false)
    }
    const handleDelete = useCallback(
        () => dispatch({type: 'delete', data: {id: item.id}}),
        [item.id, dispatch],
    );
    const handleSave = () => {
        dispatch({type: 'save', data: {id: item.id, value: valuePoint}})
        setIsSelectText(false)
    };
    const handleOnKeyUpValueTag = (event) => {
        if (event.key === 'Enter') {
            if (event.target.value.length > 0) {
                dispatch({type: 'addTags', data: {id: item.id, value: event.target.value}})
                event.target.value = ''
            }
        }
    }

    const handleToggleDone = useCallback(
        () =>
            dispatch({
                type: 'toggleDone',
                data: {id: item.id},
            }),
        [item.id, dispatch],
    );

    const handleCancelAddTags = () => {
        setIsShowAddTags(false)
    }
    const handleAddTags = () => {
        setIsShowAddTags(true)
    }

    const handleOnChangeValuePoint = (event: any) => setValuePoint(event.target.value)
    // const handleOnChangeValueTag = (event: any) => setValueTag(event.target.value)
    // console.log(item.tags)
    return (
        <Card
            className={classnames(classes.root, {
                [classes.doneRoot]: item.done,
            })}
        >
            {
                isSelectText ?
                    <CardHeader
                        action={
                            <>
                                <IconButton aria-label="save" onClick={handleSave}>
                                    <SaveIcon/>
                                </IconButton>
                                <IconButton aria-label="cancel" onClick={handleCancel}>
                                    <CancelIcon/>
                                </IconButton>
                            </>
                        }
                        title={

                            <TextField id="standard-basic" label="New value" variant="standard"
                                       value={valuePoint}
                                       onChange={handleOnChangeValuePoint}
                            />

                        }
                    />
                    :
                    <CardHeader
                        action={
                            <>
                                <IconButton aria-label="delete" onClick={handleDelete}>
                                    <DeleteIcon/>
                                </IconButton>
                                <IconButton aria-label="edit" onClick={handleEdit}>
                                    <EditIcon/>
                                </IconButton>
                            </>
                        }
                        title={
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={item.done}
                                        onChange={handleToggleDone}
                                        name={`checked-${item.id}`}
                                        color="primary"
                                    />
                                }
                                label={item.title}
                            />
                        }
                    />
            }
            <CardContent>
                {
                    item.tags?.map((item, index) => {
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
                                key={index}>
                            #{item}
                        </span>
                        )
                    })
                }
            </CardContent>

            {
                isShowAddTags ?
                    <CardContent style={{display: 'flex'}}>

                        <TextField id="standard-basic" label="Add tags" variant="standard"
                            // value={valueTag}
                            //        onChange={handleOnChangeValueTag}
                                   onKeyDown={handleOnKeyUpValueTag}
                        />

                        <IconButton aria-label="cancel" onClick={handleCancelAddTags}>
                            <CancelIcon/>
                        </IconButton>
                    </CardContent>
                    :
                    <CardContent>
                        <Button variant="contained" color="primary" onClick={handleAddTags}
                        >+ Add tags</Button>
                    </CardContent>

            }
            {
                item.details ? (
                    <CardContent>
                        <Typography variant="body2" component="p">
                            {item.details}
                        </Typography>
                    </CardContent>
                ) : null}
        </Card>
    );
};
