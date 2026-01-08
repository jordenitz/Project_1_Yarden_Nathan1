import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StartScreen from "./Pages/StartScreen";
import GameScreen from "./Pages/GameScreen";
import "./App.css";

function App() {
    const [started, setStarted] = useState(false);
    const [rows, setRows] = useState(6);
    const [cols, setCols] = useState(7);
    const [vsComputer, setVsComputer] = useState(false);

    const startGame = (r, c, vsComp) => {
        setRows(r);
        setCols(c);
        setVsComputer(vsComp);
        setStarted(true);
    };

    return started ? (
        <GameScreen
            rows={rows}
            cols={cols}
            vsComputer={vsComputer}
            onRestart={() => setStarted(false)}
        />
    ) : (
        <StartScreen onStart={startGame} />
    );
}

// ⬇️ index
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

export default App;
