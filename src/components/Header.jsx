import Icon from '@mdi/react';
import { mdiLogout,mdiWeatherSunny,mdiMoonWaningCrescent } from '@mdi/js';
import { useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from 'react';
import { SocketContext } from "../context/SocketContext.jsx";
import {jwtDecode} from "jwt-decode";
import { useLocation } from "react-router-dom";

const tokenIsValid = !!sessionStorage.getItem("token");

const logout = function () {
    sessionStorage.removeItem("token");
    window.location.reload();
};

const toggleDarkMode = function () {
    const isDarkMode = sessionStorage.getItem("darkMode") === "true";
    sessionStorage.setItem("darkMode", !isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
};

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate()
    const socket = useContext(SocketContext);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const isInGameRoute = location.pathname.startsWith("/game/");

    // Vérifiez le mode sombre au premier rendu
    useEffect(() => {
        const darkMode = sessionStorage.getItem("darkMode") === "true";
        setIsDarkMode(darkMode);
        document.documentElement.classList.toggle('dark', darkMode);
    }, []);

    const leaveGame = function (){
        const user = jwtDecode(sessionStorage.getItem("token"));
        const gameId = window.location.pathname.split("/game/")[1]; // Récupérer l'ID de la partie

        if (gameId) {
            socket.emit("leaveGame", { gameId, user });
        }

        navigate("/");
        window.location.reload();
    }

    const handleToggleDarkMode = () => {
        toggleDarkMode();
        setIsDarkMode(prev => !prev); // Inverser l'état local
    };

    return (
        <div className={"absolute top-4 right-4 left-4 flex justify-between items-center"}>
            <div className={"flex items-center gap-x-2"}>
                <button onClick={handleToggleDarkMode} className="">
                    {isDarkMode ?
                        <Icon className={"text-white"} path={mdiWeatherSunny} size={1}/> :
                        <Icon className={"text-black"} path={mdiMoonWaningCrescent} size={1}/>
                    }
                </button>
                {tokenIsValid && (
                    <div onClick={logout} className={"flex items-center gap-x-1 text-red-500 cursor-pointer text-xs"}>
                        <Icon path={mdiLogout} size={1}/>
                        <p>Se déconecter</p>
                    </div>
                )}
            </div>
            {tokenIsValid && isInGameRoute && (
                <div onClick={leaveGame} className={"flex items-center gap-x-1 text-red-500 cursor-pointer text-xs"}>
                    <Icon path={mdiLogout} size={1}/>
                    <p>Quitter la partie</p>
                </div>
            )}
        </div>
    );
}
