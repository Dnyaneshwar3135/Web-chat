import React, { useEffect, useState } from 'react';
import './style.css';
import Chat from '../Chat';
import Sidebar from '../Sidebar';
import NewRoom from '../NewRoom';
import chatHttp from '../../services/Http';
import RoomDetails from '../RoomDetails';

const Room = ({ history }: any) => {
	console.log(history);
	// TODO create ROOM interface
	const username = localStorage.getItem('username');
	const roomCode = localStorage.getItem('room_code');
	const [ open, setOpen ] = useState(false);
	const [ rooms, setRooms ]: Array<any> = useState([]);

	useEffect(() => {
		getRooms();
	}, []);

	const getRooms = () => {
		chatHttp
			.getRooms()
			.then(({ data }) => {
				console.log(data);
				setRooms(data.rooms);
				if (data.rooms[0]) {
					localStorage.setItem('room_code', data.rooms[0].code);
				}
			})
			.catch(({ response }) => {
				console.log(response);
				if (response.status === 401) {
					localStorage.clear();
					history.push('/login');
				}
			});
	};

	const getCurrentRoom = () => {
		return rooms.find((room: any) => {
			return room.code === roomCode;
		});
	};

	return (
		<div className="room">
			<Sidebar onNewRoom={() => setOpen(true)} rooms={rooms} history={history} />
			{roomCode ? (
				<React.Fragment>
					<Chat name={username!} room={roomCode!} />
					<RoomDetails roomDetails={getCurrentRoom()} />
				</React.Fragment>
			) : (
				<div className="chat chat--no-room">
					<div className="chat__header" />
					<div className="chat__body">
						<p>Create or Join a room to start a conversation!</p>
					</div>
				</div>
			)}

			<NewRoom
				open={open}
				onClose={(room: any) => {
					if (room) {
						setRooms([ ...rooms, room ]);
					}
					// getRooms();
					setOpen(false);
				}}
			/>
		</div>
	);
};

export default Room;
