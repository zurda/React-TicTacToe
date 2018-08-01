import React from 'react';
import './App.css';

function Square(props) {
  return (
    <button className="Square" id={'square'+props.id} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square key={i} id={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let arr = [];
    for (let i=0; i<this.props.squares.length; i++) {
      arr.push(this.renderSquare(i));
    }
    return (
      <div className='GameGrid'>{arr}</div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          locations: Array(0).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true
      };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const locations = current.locations.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    locations.push(i);
    this.setState({
      history: history.concat([
        {
          squares: squares,
          locations: locations
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
    for (let i=0; i<9; i++) {
      let element = document.getElementById('square' + i);
      element.classList.remove("WinnerSquare");   
      }    
  }

  toggleMoveOrderHandler = () => {
    const current = this.state.isAscending;
    this.setState({
      isAscending: !current
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const locations = current.locations.slice();
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ((move % 2) === 0 ? ': O' : ': X') + ' to square ' + (move<locations.length+1 ? locations[move-1]: '?'):
        'Go to game start';
      return (
        <li className='Move' key={move} >
          <button 
            id={this.state.stepNumber === move ? 'LatestMove' : null}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner: " + (!this.state.xIsNext ? "X" : "O");
      for (let i=0; i<3; i++) {
        let element = document.getElementById('square' + winner[i]);
        element.classList.add("WinnerSquare");        
      }
    } else if (this.state.stepNumber === 0) {
      status = "Click anywhere to start";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="App">
        <div className="Game">
        <h1>Tic Tac Toe</h1>
          <div className='Status'>{status}</div>
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="GameInfo">
            <h3>Game History:</h3>
            <button className='MovesOrder' onClick={() => this.toggleMoveOrderHandler()}>{this.state.isAscending ? 'Ascending' : 'Descending'}</button>
            <ul className={this.state.isAscending ? 'Ascending' : 'Descending'} >{moves}</ul>
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

export default App;
