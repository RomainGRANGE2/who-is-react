import { useState, useEffect } from "react";

const AllGames = () => {
    const [allGames, setAllGames] = useState([]);

    useEffect(() => {
        const getAllGames = async () => {
            try {
                const response = await fetch('https://who-is-react-api.onrender.com/game', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des parties");
                }

                const games = await response.json();
                setAllGames(games);
            } catch (error) {
                console.error("Erreur :", error);
            }
        };

        getAllGames();
    }, []);


    const getStatusColor = (state) => {
        switch (state) {
            case "pending":
                return "bg-blue-100 text-blue-700 border-blue-500";
            case "playing":
                return "bg-green-100 text-green-700 border-green-500";
            case "finished":
                return "bg-red-100 text-red-700 border-red-500";
            default:
                return "bg-gray-100 text-gray-700 border-gray-500";
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Historique des Parties</h1>

            {allGames.length === 0 ? (
                <p className="text-center text-gray-500">Aucune partie disponible.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-300">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 border-b text-left">ID</th>
                            <th className="px-6 py-3 border-b text-left">Créateur</th>
                            <th className="px-6 py-3 border-b text-left">Adversaire</th>
                            <th className="px-6 py-3 border-b text-left">État</th>
                            <th className="px-6 py-3 border-b text-left">Gagnant</th>
                            <th className="px-6 py-3 border-b text-left">Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {allGames.map((game) => (
                            <tr key={game.id} className="border-b">
                                <td className="px-6 py-3">{game.id}</td>
                                <td className="px-6 py-3">{game.creator || "-"}</td>
                                <td className="px-6 py-3">{game.player || "-"}</td>
                                <td className={`px-6 py-3 font-semibold border ${getStatusColor(game.state)}`}>
                                    {game.state}
                                </td>
                                <td className="px-6 py-3">{game.winner || "-"}</td>
                                <td className="px-6 py-3">{game.winnerScore ?? "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AllGames;
