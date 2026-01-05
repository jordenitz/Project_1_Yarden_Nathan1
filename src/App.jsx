import { useState } from "react";
import StartScreen from "./Pages/StartScreen";
import GameScreen from "./Pages/GameScreen";

export default function App() {
    const [started, setStarted] = useState(false);
    const [rows, setRows] = useState(6);
    const [cols, setCols] = useState(7);

    const startGame = (r, c) => {
        setRows(r);
        setCols(c);
        setStarted(true);
    };

    return started ? (
        <GameScreen
            rows={rows}
            cols={cols}
            onRestart={() => setStarted(false)}
        />
    ) : (
        <StartScreen onStart={startGame} />
    );
}
