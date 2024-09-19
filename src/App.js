import './App.css';
import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const scores = [0, 15, 30, 40];

function App() {

  const { sendMessage, lastMessage, readyState } = useWebSocket('wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self');

  const [liveStatus, setLiveStatus] = useState(false);

  const [score, setScore] = useState({
    player1: {
      name: 'Jogador 1',
      scoreCounter: 0,
      games: 0,
      scoreLabel: 0
    },
    player2: {
      name: 'Jogador 2',
      scoreCounter: 0,
      games: 0,
      scoreLabel: 0
    },
  });

  const updateScore = (player, delta) => {
    const newScore = structuredClone(score);

    const newScoreCounter = delta === 1 ? score[player].scoreCounter + 1 : score[player].scoreCounter - 1;

    newScore[player] = {
      ...score[player],
      scoreCounter: newScoreCounter
    }
    if (newScore[player].scoreCounter === 4) {
      console.log('new game');
      newScore[player].scoreCounter = 0;
      newScore[player].games = newScore[player].games + 1;
    }

    newScore[player].scoreLabel = scores[newScore[player].scoreCounter];

    setScore(newScore);
  };

  const handleNameChange = (player, name) => {

    const newScore = structuredClone(score);
    newScore[player] = {
      ...score[player],
      name: name.trim()
    }

    setScore(newScore);
  };

  const resetScores = () => {

    const newScore = structuredClone({
      player1: {
        name: '',
        scoreCounter: 0,
        games: 0,
        scoreLabel: 0
      },
      player2: {
        name: '',
        scoreCounter: 0,
        games: 0,
        scoreLabel: 0
      },
    });

    setScore(newScore);
  };

  useEffect(() => {
    console.log('UPDATED SCORE');
    sendMessage(JSON.stringify(score))
  }, [score])

  const startScores = () => {
    sendMessage(JSON.stringify({
      showScore: true
    }))
  }

  const stopScores = () => {
    sendMessage(JSON.stringify({
      showScore: false
    }))
  }

  const toggleStream = () => {
    setLiveStatus(!liveStatus);
    sendMessage({
      liveStream: liveStatus
    });
  }

  useEffect(() => {
    if ( 'liveStreamData' in lastMessage) {
      console.log('livestream status:');
      console.log(lastMessage.liveStreamData);
    }
  }, [lastMessage])

  return (
    <div className="container">
      <div className="player">
        <input
          type="text"
          value={score.player1.name}
          onChange={e => handleNameChange('player1', e.target.value)}
        />
        <div className="score">{score.player1.scoreLabel}</div>
        <div className="score-controls">
          <button onClick={() => updateScore('player1', -1)}>-</button>
          <button onClick={() => updateScore('player1', 1)}>+</button>
        </div>
        <div className="game-controls">Games: {score.player1.games}</div>
      </div>
      <div className="player">
        <input
          type="text"
          value={score.player2.name}
          onChange={e => handleNameChange('player2', e.target.value)}
        />
        <div className="score">{score.player2.scoreLabel}</div>
        <div className="score-controls">
          <button onClick={() => updateScore('player2', -1)}>-</button>
          <button onClick={() => updateScore('player2', 1)}>+</button>
        </div>
        <div className="game-controls">Games: {score.player2.games}</div>
      </div>
      <div className="game-controls">
        <button className='green' onClick={startScores}>Inciar Placar</button>
        <button className='blue' onClick={resetScores}>Zerar placar</button>
        <button className='red' onClick={stopScores}>Parar Placar</button>
      </div>
      <div className='game-controls'>
      {
        liveStatus 
        ? <button className='red' onClick={toggleStream}>Parar Youtube Live</button>
        : <button className='green' onClick={toggleStream}>Iniciar Youtube Live</button>
      }
      </div>
    </div>
  );
}

export default App;
