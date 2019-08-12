import React, {useState, useRef} from 'react';
import {createUseStyles} from 'react-jss';
import clamp from 'lodash-es/clamp'
import swap from 'lodash-move'
import {useGesture} from 'react-use-gesture'
import {useSprings, animated, interpolate} from 'react-spring'
import update from 'immutability-helper';
import User from './User';
import HTML5Backend from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

const useStyles = createUseStyles({
	List: {
		height: '67vh',
		paddingInlineStart: 0,
		borderRadius: "15px",
		marginBlockStart: 30,
		marginBlockEnd: 0,
		listStyleType: "none",
		boxShadow: '0 0 60px -30px rgba(0,0,0,0.75)',
		overflowY: 'scroll',
		overflowX: 'hidden',
		'-ms-overflow-style': 'none',
		'&::-webkit-scrollbar': {
			width: '0 !important'
		}
	}
});

const fn = (order, down, originalIndex, curIndex, y) => index =>
	down && index === originalIndex
		? {y: curIndex * 100 + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: n => n === 'y' || n === 'zIndex'}
		: {y: order.indexOf(index) * 100, scale: 1, zIndex: '0', shadow: 1, immediate: false}

const Content = props => {
	const classes = useStyles(props);
	const [users, setUsers] = useState(props.users);
	const order = useRef(users.map((_, index) => index));
	const [springs, setSprings] = useSprings(users.length, fn(order.current));

	const bind = useGesture(({args: [originalIndex], down, delta: [, y]}) => {
		const curIndex = order.current.indexOf(originalIndex);
		const curRow = clamp(Math.round((curIndex * 100 + y) / 100), 0, users.length - 1);
		const newOrder = swap(order.current, curIndex, curRow);
		setSprings(fn(newOrder, down, originalIndex, curIndex, y));
		if (!down) order.current = newOrder
	});

	const moveUser = (dragIndex, hoverIndex) => {
		const dragUser = users[dragIndex];
		setUsers(
			update(users, {
				$splice: [[dragIndex, 1], [hoverIndex, 0, dragUser]],
			}),
		)
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<ul className={classes.List}>
				{springs.map(({zIndex, shadow, y, scale}, i) => (
					<animated.div
						{...bind(i)}
						key={i}
						style={{
							zIndex,
							boxShadow: shadow.interpolate(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
							transform: interpolate([y, scale], (y, s) => `translate3d(0,${y / 100}px,0) scale(${s})`)
						}}
						children={<User user={users[i]} index={i} key={users[i].id} id={users[i].id}
						                moveUser={moveUser}/>}
					/>
				))}
			</ul>
		</DndProvider>
	);
};

export default Content;
