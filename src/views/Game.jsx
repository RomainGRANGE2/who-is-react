import {useParams} from "react-router-dom";
import {useContext} from "react";
import {SocketContext} from "../context/SocketContext.jsx";

const Game = () => {

    const socket = useContext(SocketContext);
    console.log(socket);

    const params = useParams()

    return (
        <div style={{height: "calc(100vh - 64px)"}} className="dark:bg-gray-900">
            {
                !!sessionStorage.getItem("token") &&
                <div
                    className="dark:text-white text-black h-screen max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-4 flex justify-center">
                    <p className="text-2xl">Partie numéro : <span className="font-bold">{params.gameId}</span></p>
                </div>
            }
        </div>
    );
};

export default Game;
