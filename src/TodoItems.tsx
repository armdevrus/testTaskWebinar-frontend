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
    const [valuePoint, setValuePoint] = useState('')

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

    const handleToggleDone = useCallback(
        () =>
            dispatch({
                type: 'toggleDone',
                data: {id: item.id},
            }),
        [item.id, dispatch],
    );

    const handleOnChangeValuePoint = (event: any) => setValuePoint(event.target.value)

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
                                <IconButton aria-label="delete" onClick={handleSave}>
                                    <SaveIcon/>
                                </IconButton>
                                <IconButton aria-label="delete" onClick={handleCancel}>
                                    <CancelIcon/>
                                </IconButton>
                            </>
                        }
                        title={
                            <Box
                                component="form"
                            >
                                <TextField id="standard-basic" label="Standard" variant="standard"
                                            value={valuePoint} onChange={handleOnChangeValuePoint}
                                />
                            </Box>
                        }
                    />
                    :
                    <CardHeader
                        action={
                            <>
                                <IconButton aria-label="delete" onClick={handleDelete}>
                                    <DeleteIcon/>
                                </IconButton>
                                <IconButton aria-label="delete" onClick={handleEdit}>
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

            {item.details ? (
                <CardContent>
                    <Typography variant="body2" component="p">
                        {item.details}
                    </Typography>
                </CardContent>
            ) : null}
        </Card>
    );
};
