import { useEffect, useState } from "react";
import Board from "../Components/Board";

export default function GameScreen({ rows, cols, onRestart, vsComputer }) {
    const emptyBoard = () =>
        Array.from({ length: rows }, () => Array(cols).fill(null));

    const [board, setBoard] = useState(emptyBoard());
    const [currentPlayer, setCurrentPlayer] = useState("🔴");
    const [winner, setWinner] = useState(null);

    // ===== UNDO =====
    const [history, setHistory] = useState(null);
    const [undoAvailable, setUndoAvailable] = useState(false);
    const [undoTimeLeft, setUndoTimeLeft] = useState(0);

    // ===== TURN TIMER =====
    const [timeLeft, setTimeLeft] = useState(10);

    // ===== DROP TOKEN =====
    const dropToken = (col, byComputer = false) => {
        if (winner) return;

        // חסימת שחקן אנושי בזמן תור מחשב
        if (vsComputer && currentPlayer === "🟡" && !byComputer) return;

        const newBoard = board.map(r => [...r]);

        for (let r = rows - 1; r >= 0; r--) {
            if (!newBoard[r][col]) {

                setHistory({
                    board: board.map(r => [...r]),
                    player: currentPlayer,
                });

                newBoard[r][col] = currentPlayer;
                setBoard(newBoard);

                if (checkWinner(newBoard, rows, cols)) {
                    setWinner(currentPlayer);
                } else {
                    setUndoAvailable(true);
                    setUndoTimeLeft(5);
                }
                return;
            }
        }
    };

    // ===== UNDO COUNTDOWN =====
    useEffect(() => {
        if (!undoAvailable) return;

        if (undoTimeLeft === 0) {
            setUndoAvailable(false);
            setCurrentPlayer(p => (p === "🔴" ? "🟡" : "🔴"));
            return;
        }

        const t = setTimeout(() => {
            setUndoTimeLeft(x => x - 1);
        }, 1000);

        return () => clearTimeout(t);
    }, [undoAvailable, undoTimeLeft]);

    const undoLastMove = () => {
        if (!undoAvailable || !history) return;

        setBoard(history.board);
        setCurrentPlayer(history.player);
        setHistory(null);
        setUndoAvailable(false);
        setUndoTimeLeft(0);
        setWinner(null);
    };

    // ===== TURN TIMER (10s) =====
    useEffect(() => {
        if (winner) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    // ניקוי UNDO
                    setUndoAvailable(false);
                    setUndoTimeLeft(0);
                    setHistory(null);

                    // החלפת תור – תמיד
                    setCurrentPlayer(p => (p === "🔴" ? "🟡" : "🔴"));
                    return 10;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentPlayer, winner]);

    // ===== COMPUTER MOVE =====
    useEffect(() => {
        if (!vsComputer) return;
        if (currentPlayer !== "🟡") return;
        if (winner) return;

        const timeout = setTimeout(() => {
            const validCols = [];
            for (let c = 0; c < cols; c++) {
                if (board[0][c] === null) validCols.push(c);
            }
            if (validCols.length === 0) return;

            const randomCol =
                validCols[Math.floor(Math.random() * validCols.length)];

            dropToken(randomCol, true);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [currentPlayer, winner]);

    // ===== HINT =====
    const hasWinningMove = (player) => {
        for (let c = 0; c < cols; c++) {
            let r = -1;
            for (let i = rows - 1; i >= 0; i--) {
                if (!board[i][c]) {
                    r = i;
                    break;
                }
            }
            if (r === -1) continue;

            const temp = board.map(row => [...row]);
            temp[r][c] = player;

            if (checkWinner(temp, rows, cols)) return true;
        }
        return false;
    };

    const resetGame = () => {
        setBoard(emptyBoard());
        setCurrentPlayer("🔴");
        setWinner(null);
        setHistory(null);
        setUndoAvailable(false);
        setUndoTimeLeft(0);
        setTimeLeft(10);
    };

    return (
        <div className="screen" dir="rtl">
            <h2>
                {winner
                    ? `🏆 המנצח: ${winner}`
                    : vsComputer && currentPlayer === "🟡"
                        ? `🤖 המחשב חושב… (${timeLeft})`
                        : `תור: ${currentPlayer} ⏱ ${timeLeft}`}
            </h2>

            <Board
                board={board}
                rows={rows}
                cols={cols}
                onColumnClick={dropToken}
            />

            {undoAvailable && (
                <button onClick={undoLastMove}>
                    ↩ UNDO – {undoTimeLeft}s
                </button>
            )}

            <div style={{ marginTop: 10 }}>
                <button
                    onClick={() =>
                        alert(
                            hasWinningMove(currentPlayer)
                                ? "💡 יש לך מהלך מנצח במהלך הבא!"
                                : "❌ אין מהלך מנצח כרגע"
                        )
                    }
                >
                    רמז 💡
                </button>
            </div>

            <div style={{ marginTop: 15 }}>
                <button onClick={resetGame}>🔄 Reset</button>
                <button onClick={onRestart}>⬅ חזרה</button>
            </div>
        </div>
    );
}

// ===== CHECK WINNER =====
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
                    ) {
                        count++;
                    }
                }
                if (count === 4) return true;
            }
        }
    }
    return false;
}
