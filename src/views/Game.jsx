import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext.jsx";
import { jwtDecode } from "jwt-decode";

const characters = [
    { id: 1, name: "Lorada ANDRE", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op7O9ojpeWjNdCZSMwXEBz3M?pfdrid_c=true" },
    { id: 2, name: "Jérémy AUBRY", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-opxldjZ3yhWEDCZSMwXEBz3M?pfdrid_c=true" },
    { id: 3, name: "Côme BONAL", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-opz1Kjfwx_A4wCZSMwXEBz3M?pfdrid_c=true" },
    { id: 4, name: "Brahim BOUTAGJAT", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op7KWkBgRK02YCZSMwXEBz3M?pfdrid_c=true" },
    { id: 5, name: "Orian CAPEK-MESSY", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op2zcmQsKedW8CZSMwXEBz3M?pfdrid_c=true" },
    { id: 6, name: "Mateo CARCIU", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op3QDx6fzK7LiCZSMwXEBz3M?pfdrid_c=true" },
    { id: 7, name: "Mohamed CHETTAH", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op1LYUSzYfVPSCZSMwXEBz3M?pfdrid_c=true" },
    { id: 8, name: "Maxime CHOSTAK", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-opwUpu0iRPfJNCZSMwXEBz3M?pfdrid_c=true" },
    { id: 9, name: "Loan COURCHINOUX BILLONNET", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op86s2_sagboMCZSMwXEBz3M?pfdrid_c=true" },
    { id: 10, name: "Lucas DAMIAN-PICOLLET", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-opyIG9gKnrjuOCZSMwXEBz3M?pfdrid_c=true" },
    { id: 11, name: "Kylian DELEY", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op5LEbhQgMbdbCZSMwXEBz3M?pfdrid_c=true" },
    { id: 12, name: "Cedric DOUSSET", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op6oK8vda0feSCZSMwXEBz3M?pfdrid_c=true" },
    { id: 13, name: "Omar ELHADIDI", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op-NkIKrTGO34CZSMwXEBz3M?pfdrid_c=true" },
    { id: 14, name: "Antoine FALGIGLIO", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-opzVoeMC_tfISCZSMwXEBz3M?pfdrid_c=true" },
    { id: 15, name: "Liam FAUCITANO", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op0A4j9Lx4wgiCZSMwXEBz3M?pfdrid_c=true" },
    { id: 16, name: "Arnaud GOUEL", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op5zOm_ayljW8CZSMwXEBz3M?pfdrid_c=true" },
    { id: 17, name: "Romain GRANGE", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op_F4nUm0ZEO0CZSMwXEBz3M?pfdrid_c=true" },
    { id: 18, name: "Cihan KAFADAR", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op-0-LcmlOlraCZSMwXEBz3M?pfdrid_c=true" },
    { id: 19, name: "Drilon LIMANI", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-opw3I31g1hzKqCZSMwXEBz3M?pfdrid_c=true" },
    { id: 20, name: "Getoar LIMANI", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-opy9OgM8JfsKYCZSMwXEBz3M?pfdrid_c=true" },
    { id: 21, name: "Ruddy MOREL", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op0gzaMe5785GCZSMwXEBz3M?pfdrid_c=true" },
    { id: 22, name: "Paul NIGGLI", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op9GtmC5r9miKCZSMwXEBz3M?pfdrid_c=true" },
    { id: 23, name: "Bastien OEUVRARD", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op2X8G2B8QdEFCZSMwXEBz3M?pfdrid_c=true" },
    { id: 24, name: "Olivier PERDRIX", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op6X9vcsFHQo8CZSMwXEBz3M?pfdrid_c=true" },
    { id: 25, name: "Jules POISSONNET", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op4cex5ahQCy3CZSMwXEBz3M?pfdrid_c=true" },
    { id: 26, name: "Mathis ROME", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op96oSi4AhoGcCZSMwXEBz3M?pfdrid_c=true" },
    { id: 27, name: "Jérémy ROSSI", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op6gJTNbhnQ73CZSMwXEBz3M?pfdrid_c=true" },
    { id: 28, name: "Yvan SCHMITT", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op1fb1mtKH3VpCZSMwXEBz3M?pfdrid_c=true" },
    { id: 29, name: "Kenza SCHULER", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op2AZ8KuyQHOfCZSMwXEBz3M?pfdrid_c=true" },
    { id: 30, name: "Quentin SOMVEILLE", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op7rB7d_8ugGCCZSMwXEBz3M?pfdrid_c=true" },
    { id: 31, name: "Michaël YAROMISHYAN", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op8nH_oDANkpmCZSMwXEBz3M?pfdrid_c=true" },
    { id: 32, name: "Ilyas ZAHAF KRADRA", image: "https://ges-dl.kordis.fr/public/dEkj-aOcIw52B9RsgY-op_ouwrNW7W60CZSMwXEBz3M?pfdrid_c=true" }
];



const Game = () => {
    const socket = useContext(SocketContext);
    const { gameId } = useParams();
    const [players, setPlayers] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentTurn, setCurrentTurn] = useState(null);

    const [question, setQuestion] = useState("");
    const [receivedQuestion, setReceivedQuestion] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [remainingCharacters, setRemainingCharacters] = useState(characters);
    const [waitingForElimination, setWaitingForElimination] = useState(false);

    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [opponentCharacter, setOpponentCharacter] = useState(null);
    const [characterConfirmed, setCharacterConfirmed] = useState(false);

    const [bothCharactersChosen, setBothCharactersChosen] = useState(false);

    const [gameOver, setGameOver] = useState(false);
    const [winnerMessage, setWinnerMessage] = useState("");

    const [canMakeGuess, setCanMakeGuess] = useState(false);

    const [charactersToEliminate, setCharactersToEliminate] = useState([]);




    const user = jwtDecode(sessionStorage.getItem("token"));

    useEffect(() => {
        if (!socket) return;

        socket.emit("joinGame", { gameId, user });


        socket.on("updatePlayers", (playersList) => {
            setPlayers(playersList || []);
        });


        socket.on("gameStarted", () => {
            setGameStarted(true);
        });


        socket.on("updateTurn", (turnPlayerId) => {
            setCurrentTurn(turnPlayerId);
            setAnswer(null);
            setReceivedQuestion(null);
            setWaitingForElimination(false);


            if (remainingCharacters.length === 1 && turnPlayerId === user.id) {
                setCanMakeGuess(true);
            } else {
                setCanMakeGuess(false);
            }
        });


        socket.on("receiveQuestion", (question) => {
            setReceivedQuestion(question);
            setAnswer(null);
        });


        socket.on("receiveAnswer", (answer) => {
            setAnswer(answer);
            setWaitingForElimination(true);
        });


        socket.on("updateSelectedCharacters", (players) => {
            const myCharacter = players.find(p => p.id === user.id)?.selectedCharacter;
            const opponent = players.find(p => p.id !== user.id)?.selectedCharacter;

            setSelectedCharacter(myCharacter);
            setOpponentCharacter(opponent);


            if (myCharacter && opponent) {
                setBothCharactersChosen(true);
            } else {
                setBothCharactersChosen(false);
            }
        });


        socket.on("gameOver", ({ winnerId, loserId, message }) => {
            setGameOver(true);

            if (user.id === winnerId) {
                setWinnerMessage("🎉 Félicitations ! Vous avez gagné !");
            } else {
                setWinnerMessage("😞 Dommage, vous avez perdu !");
            }
        });

        return () => {
            socket.off("updatePlayers");
            socket.off("gameStarted");
            socket.off("updateTurn");
            socket.off("receiveQuestion");
            socket.off("receiveAnswer");
            socket.off("updateSelectedCharacters");
            socket.off("gameOver");
        };
    }, [gameId, socket, remainingCharacters]);



    const startGame = () => {
        socket.emit("startGame", gameId);
    };


    const nextTurn = () => {
        socket.emit("nextTurn", gameId);
    };

    return (
        <div className="dark:bg-gray-900 pt-10 min-h-screen flex justify-center">
            {!!sessionStorage.getItem("token") && (
                <div className="dark:text-white text-black max-w-5xl w-full mx-auto flex flex-col items-center">

                                        <p className="text-3xl font-bold mt-4">
                        Partie <span className="text-indigo-500">#{gameId}</span>
                    </p>

                                        <div className="mt-6 w-full text-center">
                        <h3 className="text-xl font-semibold mb-3">👥 Joueurs :</h3>
                        <ul className="flex justify-center gap-4">
                            {players.map((player) => (
                                <li
                                    key={player.id}
                                    className={`text-lg font-medium px-6 py-2 rounded-lg shadow-md transition 
                                        ${currentTurn === player.id ? "bg-indigo-500 text-white" : "bg-gray-300 dark:bg-gray-700"}`}
                                >
                                    {player.username} {currentTurn === player.id && "⭐"}
                                </li>
                            ))}
                        </ul>
                    </div>

                                        {players.length >= 2 && !gameStarted && (
                        <button
                            onClick={startGame}
                            className="mt-6 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition transform hover:scale-105"
                        >
                            🎮 Démarrer la partie
                        </button>
                    )}


                                        {gameStarted && characterConfirmed && selectedCharacter && (
                        <div
                            className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-xl flex items-center">
                            <img src={selectedCharacter.image} alt={selectedCharacter.name}
                                 className="w-16 h-16 rounded-full mr-4"/>
                            <p className="text-lg font-semibold">{selectedCharacter.name}</p>
                        </div>
                    )}

                                        {gameStarted && bothCharactersChosen && currentTurn === user.id && !receivedQuestion && !waitingForElimination && (
                        <div className="mt-6 flex gap-4 items-center">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Posez une question..."
                                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 shadow-md"
                            />
                            <button
                                onClick={() => {
                                    if (!question.trim()) return;
                                    socket.emit("askQuestion", {gameId, question});
                                    setQuestion("");
                                }}
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                            >
                                🎤 Poser
                            </button>
                        </div>
                    )}

                                        {gameStarted && receivedQuestion && !answer && currentTurn !== user.id && (
                        <div className="mt-6 text-center">
                            <p className="text-xl font-semibold text-indigo-500">❓ "{receivedQuestion}"</p>
                            <div className="mt-4 space-x-4">
                                <button
                                    onClick={() => socket.emit("answerQuestion", {gameId, answer: "Oui"})}
                                    className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition"
                                >
                                    ✅ Oui
                                </button>
                                <button
                                    onClick={() => socket.emit("answerQuestion", {gameId, answer: "Non"})}
                                    className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition"
                                >
                                    ❌ Non
                                </button>
                            </div>
                        </div>
                    )}

                                        {gameStarted && answer && currentTurn === user.id && (
                        <div className="mt-6 text-center">
                            <p className="text-lg font-semibold text-green-500">Réponse : "{answer}"</p>
                            <p className="text-sm text-gray-400">Cliquez sur les personnages à éliminer, puis cliquez
                                sur "Tour terminé".</p>

                            <button
                                onClick={() => {
                                    setRemainingCharacters((prev) => prev.filter(c => !charactersToEliminate.includes(c.id)));
                                    setCharactersToEliminate([]);
                                    setAnswer(null);
                                    setReceivedQuestion(null);
                                    setWaitingForElimination(false);
                                    socket.emit("endTurn", gameId);
                                }}
                                className="mt-4 bg-purple-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-700 transition"
                            >
                                🔄 Tour terminé
                            </button>
                        </div>
                    )}

                    {gameStarted && !characterConfirmed && (
                        <div className="mt-6 text-center">
                            <h3 className="text-xl font-semibold">Choisissez un personnage :</h3>
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {characters.map((character) => (
                                    <div
                                        key={character.id}
                                        className={`border rounded-lg p-3 text-center cursor-pointer shadow-lg transition-transform hover:scale-110 
                                            ${selectedCharacter?.id === character.id ? "border-green-500 ring-2 ring-green-300" : "border-gray-300 dark:border-gray-600"}`}
                                        onClick={() => setSelectedCharacter(character)}
                                    >
                                        <img src={character.image} alt={character.name}
                                             className="w-20 h-20 mx-auto rounded-full"/>
                                        <p className="mt-2 text-sm font-medium">{character.name}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    if (!selectedCharacter) return;
                                    setCharacterConfirmed(true);
                                    socket.emit("selectCharacter", {
                                        gameId,
                                        userId: user.id,
                                        character: selectedCharacter
                                    });
                                }}
                                className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105"
                            >
                                ✅ Confirmer mon personnage
                            </button>
                        </div>
                    )}

                                        {gameStarted && characterConfirmed && (
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            {remainingCharacters.map((character) => (
                                <div
                                    key={character.id}
                                    className={`border rounded-lg p-3 text-center cursor-pointer bg-white dark:bg-gray-800 shadow-md transition 
                                        ${charactersToEliminate.includes(character.id) ? "opacity-50" : "hover:scale-105"}`}
                                    onClick={() => {
                                        if (currentTurn === user.id && answer && waitingForElimination) {
                                            setCharactersToEliminate((prev) =>
                                                prev.includes(character.id)
                                                    ? prev.filter(id => id !== character.id)
                                                    : [...prev, character.id]
                                            );
                                        }
                                    }}
                                >
                                    <img src={character.image} alt={character.name}
                                         className="w-20 h-20 mx-auto rounded-full"/>
                                    <p className="mt-2 text-sm">{character.name}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {gameOver && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                                <h2 className="text-2xl font-bold text-red-500">{winnerMessage}</h2>
                                <button
                                    onClick={() => {
                                        setGameOver(false);
                                        setWinnerMessage("");
                                        setGameStarted(false);
                                        setCurrentTurn(null);
                                        setPlayers([]);
                                        setAnswer(null);
                                        setReceivedQuestion(null);
                                        setRemainingCharacters(characters);
                                        setCharactersToEliminate([]);
                                        setWaitingForElimination(false);
                                        setSelectedCharacter(null);
                                        setOpponentCharacter(null);
                                        setCharacterConfirmed(false);
                                        setBothCharactersChosen(false);
                                        setCanMakeGuess(false);


                                        socket.emit("joinGame", {gameId, user});
                                    }}
                                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                                >
                                    Rejouer
                                </button>


                            </div>
                        </div>
                    )}

                    {gameStarted && canMakeGuess && currentTurn === user.id && (
                        <div className="mt-6">
                            <p className="text-lg font-semibold text-yellow-500">Vous pouvez maintenant faire une proposition !</p>
                            <button
                                onClick={() => {
                                    socket.emit("makeGuess", { gameId, userId: user.id, guessedCharacter: remainingCharacters[0] });
                                }}
                                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                            >
                                Proposer {remainingCharacters[0].name}
                            </button>
                        </div>
                    )}

                    {players.length === 1 && (
                        <p className="mt-6 text-yellow-400 font-semibold text-lg">
                            En attente d'un autre joueur...
                        </p>
                    )}

                </div>
            )}
        </div>

    );
};

export default Game;
