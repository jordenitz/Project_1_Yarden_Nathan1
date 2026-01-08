export default function Board({ board, rows, cols, onColumnClick }) {
    return (
        <div className="board">
            <div
                className="drop-row"
                style={{ gridTemplateColumns: `repeat(${cols}, 60px)` }}
            >
                {Array.from({ length: cols }, (_, c) => (
                    <button
                        key={c}
                        className="drop-btn"
                        onClick={() => onColumnClick(c)}
                    >
                        ↓
                    </button>
                ))}
            </div>

            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 60px)`,
                    gridTemplateRows: `repeat(${rows}, 60px)`,
                }}
            >
                {board.map((row, r) =>
                    row.map((cell, c) => (
                        <div key={`cell-${r}-${c}`} className="cell">
                        {cell && (
                                <div
                                    className={`token ${
                                        cell === "🔴" ? "red" : "yellow"
                                    }`}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
