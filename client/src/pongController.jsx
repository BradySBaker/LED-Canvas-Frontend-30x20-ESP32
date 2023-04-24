const PongController = ({sendData}) => {

	return (
		<div id='pong-controller'>
			<button onClick={() => sendData('GU')} >UP</button>
			<button onClick={() => sendData('GD')} >DOWN</button>
		</div>
	)
};



export default PongController;