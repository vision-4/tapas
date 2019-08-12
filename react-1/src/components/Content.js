import React, {useState, useEffect} from 'react';
import {createUseStyles} from 'react-jss';
import Loader from './Loader';
import UserList from './UserList';

const useStyles = createUseStyles({
	Content: {
		width: '90%',
		minHeight: 400,
		margin: 30,
		backgroundImage: props => props.themeGradient
	},
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

const Content = props => {
	const classes = useStyles(props);
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState([]);

	async function fetchData() {
		const res = await fetch("http://jsonplaceholder.typicode.com/users");
		res.json().then(res => {
			setUsers(res);
			setLoading(false);
		}).catch(err => console.warn(err));
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<section className={classes.Content}>
			{loading ? <Loader/> : <UserList users={users}/>}
		</section>
	);
};

export default Content;
