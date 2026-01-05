import { useState } from "react";

export default function StartScreen({ onStart }) {
    const [rows, setRows] = useState(6);
    const [cols, setCols] = useState(7);

    return (
        <div className="screen" dir="rtl">
            <h1>🎮 ארבע בשורה</h1>

            <label>
                שורות:
                <input
                    type="number"
                    min="4"
                    max="10"
                    value={rows}
                    onChange={(e) => setRows(+e.target.value)}
                />
            </label>

            <br /><br />

            <label>
                עמודות:
                <input
                    type="number"
                    min="4"
                    max="10"
                    value={cols}
                    onChange={(e) => setCols(+e.target.value)}
                />
            </label>

            <br /><br />

            <button onClick={() => onStart(rows, cols)}>
                התחל משחק
            </button>
        </div>
    );
}
