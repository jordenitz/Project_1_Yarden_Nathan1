import { useState } from "react";
import Board from "../Components/Board";

export default function GameScreen({ rows, cols, onRestart }) {
    const emptyBoard = () =>
        Array.from({ length: rows }, () => Array(cols).fill(null));

    const [board, setBoard] = useState(emptyBoard());
    const [currentPlayer, setCurrentPlayer] = useState("🔴");
    const [winner, setWinner] = useState(null);

    const dropToken = (col) => {
        if (winner) return;

        const newBoard = board.map(r => [...r]);

        for (let r = rows - 1; r >= 0; r--) {
            if (!newBoard[r][col]) {
                newBoard[r][col] = currentPlayer;
                break;
            }
        }

        if (checkWinner(newBoard, rows, cols)) {
            setWinner(currentPlayer);
        } else {
            setCurrentPlayer(currentPlayer === "🔴" ? "🟡" : "🔴");
        }

        setBoard(newBoard);
    };

    const resetGame = () => {
        setBoard(emptyBoard());
        setCurrentPlayer("🔴");
        setWinner(null);
    };

    return (
        <div className="screen" dir="rtl">
            <h2>
                {winner ? `🏆 המנצח: ${winner}` : `תור: ${currentPlayer}`}
            </h2>
            <Board
                board={board}
                rows={rows}
                cols={cols}
                onColumnClick={dropToken}
            />

            <div>
                <button onClick={resetGame}>🔄 Reset</button>
                <button onClick={onRestart}>⬅ חזרה</button>
            </div>
        </div>
    );
}

function checkWinner(board, rows, cols) {
    const dirs = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = board[r][c];
            if (!cell) continue;

            for (let [dr, dc] of dirs) {
                let count = 0;
                for (let i = 0; i < 4; i++) {
                    const nr = r + dr * i;
                    const nc = c + dc * i;
                    if (
                        nr >= 0 && nr < rows &&
                        nc >= 0 && nc < cols &&
                        board[nr][nc] === cell
                    ) count++;
                }
                if (count === 4) return true;
            }
        }
    }
    return false;
}
