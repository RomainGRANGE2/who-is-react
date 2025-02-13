import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext.jsx";
import { jwtDecode } from "jwt-decode";

const characters = [
    { id: 1, name: "Alice", image: "https://via.placeholder.com/100", glasses: true, hat: false },
    { id: 2, name: "Bob", image: "https://via.placeholder.com/100", glasses: false, hat: true },
    { id: 3, name: "Charlie", image: "https://via.placeholder.com/100", glasses: true, hat: true },
    { id: 4, name: "David", image: "https://via.placeholder.com/100", glasses: false, hat: false },
];


const Game = () => {
    const socket = useContext(SocketContext);
    const { gameId } = useParams();
    const [players, setPlayers] = useState([]); // Liste des joueurs
    const [gameStarted, setGameStarted] = useState(false);
    const [currentTurn, setCurrentTurn] = useState(null); // Qui joue actuellement

    const [question, setQuestion] = useState(""); // Question posée
    const [receivedQuestion, setReceivedQuestion] = useState(null); // Question reçue
    const [answer, setAnswer] = useState(null); // Réponse donnée
    const [remainingCharacters, setRemainingCharacters] = useState(characters); // Personnages en jeu
    const [waitingForElimination, setWaitingForElimination] = useState(false); // Bloque le tour tant que le joueur n'a pas validé

    const [selectedCharacter, setSelectedCharacter] = useState(null); // Personnage choisi par le joueur
    const [opponentCharacter, setOpponentCharacter] = useState(null); // Personnage choisi par l'adversaire
    const [characterConfirmed, setCharacterConfirmed] = useState(false); // Validation du choix

    const [bothCharactersChosen, setBothCharactersChosen] = useState(false);

    const [gameOver, setGameOver] = useState(false);
    const [winnerMessage, setWinnerMessage] = useState("");

    const [canMakeGuess, setCanMakeGuess] = useState(false);

    const [charactersToEliminate, setCharactersToEliminate] = useState([]);




    const user = jwtDecode(sessionStorage.getItem("token"));

    useEffect(() => {
        if (!socket) return; // Vérifie que le socket est bien défini
        // Rejoindre la partie
        socket.emit("joinGame", { gameId, user });

        // Mettre à jour la liste des joueurs
        socket.on("updatePlayers", (playersList) => {
            setPlayers(playersList || []);
        });

        // Écouter si la partie démarre
        socket.on("gameStarted", () => {
            setGameStarted(true);
        });

        // Écouter les changements de tour
        socket.on("updateTurn", (turnPlayerId) => {
            setCurrentTurn(turnPlayerId);
            setAnswer(null); // Réinitialise la réponse pour éviter qu'elle apparaisse au mauvais joueur
            setReceivedQuestion(null); // Réinitialise la question pour permettre au nouveau joueur de poser la sienne
            setWaitingForElimination(false); // Permet au joueur suivant de poser sa question

            // Vérifie si le joueur n'a plus qu'un personnage et active "canMakeGuess" pour le tour suivant
            if (remainingCharacters.length === 1 && turnPlayerId === user.id) {
                setCanMakeGuess(true);
            } else {
                setCanMakeGuess(false); // Réinitialise au cas où
            }
        });

        // Réception d'une question posée
        socket.on("receiveQuestion", (question) => {
            setReceivedQuestion(question);
            setAnswer(null);
        });

        // Réception d'une réponse
        socket.on("receiveAnswer", (answer) => {
            setAnswer(answer);
            setWaitingForElimination(true); // Empêche de passer au tour suivant immédiatement
        });

        // Mise à jour des personnages sélectionnés
        socket.on("updateSelectedCharacters", (players) => {
            const myCharacter = players.find(p => p.id === user.id)?.selectedCharacter;
            const opponent = players.find(p => p.id !== user.id)?.selectedCharacter;

            setSelectedCharacter(myCharacter);
            setOpponentCharacter(opponent);

            // Vérifie si les deux joueurs ont choisi un personnage
            if (myCharacter && opponent) {
                setBothCharactersChosen(true);
            } else {
                setBothCharactersChosen(false); // 🔹 Empêche l'affichage de l'input si un joueur n'a pas encore choisi
            }
        });

        // Fin de partie
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


    // Fonction pour démarrer la partie
    const startGame = () => {
        socket.emit("startGame", gameId);
    };

    // Fonction pour passer au joueur suivant
    const nextTurn = () => {
        socket.emit("nextTurn", gameId);
    };

    return (
        <div className="dark:bg-gray-900 mt-10">
            {!!sessionStorage.getItem("token") && (
                <div
                    className="dark:text-white text-black max-w-7xl mx-auto flex flex-col items-center h-[calc(100vh-40px)]">
                    <p className="text-2xl">Partie numéro : <span className="font-bold">{gameId}</span></p>

                    <div className="mt-6">
                        <h3 className="text-lg font-bold">Joueurs dans la partie :</h3>
                        <ul>
                            {players.map((player) => (
                                <li key={player.id} className="text-indigo-500 font-semibold">
                                    {player.username} {currentTurn === player.id && "⭐"}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sélection du personnage uniquement AVANT que la partie ne commence */}
                    {gameStarted && !characterConfirmed && (
                        <div className="mt-6">
                            <h3 className="text-lg font-bold">Choisissez un personnage :</h3>
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {characters.map((character) => (
                                    <div
                                        key={character.id}
                                        className={`border rounded-lg p-2 text-center cursor-pointer 
                    ${selectedCharacter?.id === character.id ? "border-green-500" : "border-gray-300"}`}
                                        onClick={() => setSelectedCharacter(character)}
                                    >
                                        <img src={character.image} alt={character.name} className="w-20 h-20 mx-auto rounded-full" />
                                        <p className="mt-2">{character.name}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    if (!selectedCharacter) return;
                                    setCharacterConfirmed(true);
                                    socket.emit("selectCharacter", { gameId, userId: user.id, character: selectedCharacter });
                                }}
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                            >
                                Confirmer mon personnage
                            </button>
                        </div>
                    )}

                    {/* Affichage de la liste des personnages SEULEMENT après le début de la partie */}
                    {gameStarted && characterConfirmed && (
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            {remainingCharacters.map((character) => (
                                <div
                                    key={character.id}
                                    className={`border rounded-lg p-2 text-center cursor-pointer bg-white dark:bg-gray-800 
                ${charactersToEliminate.includes(character.id) ? "opacity-50" : ""}`}
                                    onClick={() => {
                                        if (currentTurn === user.id && answer && waitingForElimination) {
                                            // Ajoute ou retire un personnage de la liste d'élimination
                                            setCharactersToEliminate((prev) =>
                                                prev.includes(character.id)
                                                    ? prev.filter(id => id !== character.id) // Retirer si déjà sélectionné
                                                    : [...prev, character.id] // Ajouter sinon
                                            );
                                        }
                                    }}
                                >
                                    <img src={character.image} alt={character.name}
                                         className="w-20 h-20 mx-auto rounded-full"/>
                                    <p className="mt-2">{character.name}</p>
                                </div>
                            ))}
                        </div>

                    )}


                    {gameStarted && characterConfirmed && selectedCharacter && (
                        <div
                            className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg flex items-center">
                            <img src={selectedCharacter.image} alt={selectedCharacter.name}
                                 className="w-16 h-16 rounded-full mr-4"/>
                            <p className="text-lg font-bold">{selectedCharacter.name}</p>
                        </div>
                    )}

                    {gameStarted && bothCharactersChosen && currentTurn === user.id && !receivedQuestion && !waitingForElimination && (
                        <div className="mt-6">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Posez une question..."
                                className="border rounded p-2"
                            />
                            <button
                                onClick={() => {
                                    if (!question.trim()) return;
                                    socket.emit("askQuestion", { gameId, question });
                                    setQuestion("");
                                }}
                                className="ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                            >
                                Poser la question
                            </button>
                        </div>
                    )}



                    {gameStarted && receivedQuestion && !answer && currentTurn !== user.id && (
                        <div className="mt-6">
                            <p className="text-lg font-semibold text-indigo-500">Question : "{receivedQuestion}"</p>
                            <button
                                onClick={() => socket.emit("answerQuestion", {gameId, answer: "Oui"})}
                                className="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                            >
                                Oui
                            </button>
                            <button
                                onClick={() => socket.emit("answerQuestion", {gameId, answer: "Non"})}
                                className="mt-2 ml-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                            >
                                Non
                            </button>
                        </div>
                    )}

                    {gameStarted && answer && currentTurn === user.id && (
                        <div className="mt-6">
                            <p className="text-lg font-semibold text-green-500">Réponse : "{answer}"</p>
                            <p className="text-sm text-gray-400">Cliquez sur les personnages à éliminer, puis cliquez sur "Tour terminé".</p>

                            <button
                                onClick={() => {
                                    setRemainingCharacters((prev) => prev.filter(c => !charactersToEliminate.includes(c.id)));

                                    setCharactersToEliminate([]);

                                    setAnswer(null);
                                    setReceivedQuestion(null);
                                    setWaitingForElimination(false);

                                    socket.emit("endTurn", gameId);
                                }}
                                className="mt-4 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition"
                            >
                                Tour terminé
                            </button>
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
                                        setBothCharactersChosen(false); // 🔹 Réinitialise la validation des personnages
                                        setCanMakeGuess(false);

                                        // Rejoindre à nouveau la partie
                                        socket.emit("joinGame", {gameId, user});
                                    }}
                                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                                >
                                    Rejouer
                                </button>


                            </div>
                        </div>
                    )}


                    {players.length === 1 && (
                        <p className="mt-6 text-yellow-400 font-semibold text-lg">
                            En attente d'un autre joueur...
                        </p>
                    )}

                    {players.length >= 2 && !gameStarted && (
                        <button
                            onClick={startGame}
                            className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-center"
                        >
                            Démarrer la partie
                        </button>
                    )}

                </div>
            )}
        </div>
    );
};

export default Game;
