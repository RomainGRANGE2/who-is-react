import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { SocketContext } from "./context/SocketContext.jsx";
import { useContext } from "react";
import { Button, Transition } from "@headlessui/react";
import Icon from "@mdi/react";
import { mdiCloseCircle, mdiClose } from "@mdi/js";
import { Formik } from "formik";

const Home = () => {
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const createParty = () => {
        const userId = jwtDecode(sessionStorage.getItem("token")).id;
        fetch("http://localhost:3000/game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({ userId }),
        })
            .then(async (data) => {
                const { gameId } = await data.json();
                socket.emit("join", gameId);
                navigate(`/game/${gameId}`);
            });
    };

    return (
        <div className="dark:bg-gray-900 h-[100vh] flex flex-col justify-center items-center">
            {isAuthenticated ? (
                <div className="max-w-7xl mx-auto bg-slate-300 p-4 rounded-lg">
                    <div className="flex flex-col gap-y-4 justify-center items-center">
                        <p className="text-2xl font-bold text-gray-700 dark:text-gray-200 text-center">
                            Entrer l'id de la partie
                        </p>
                        <Formik
                            initialValues={{ partyCode: "" }}
                            onSubmit={(values, { setSubmitting }) => {
                                setTimeout(() => {
                                    setSubmitting(false);
                                }, 400);
                                const userId = jwtDecode(sessionStorage.getItem("token")).id;
                                fetch(`http://localhost:3000/game/join/${values.partyCode}`, {
                                    method: "PATCH",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                                    },
                                    body: JSON.stringify({ userId }),
                                }).then(async (data) => {
                                    const gameData = await data.json();
                                    if (gameData?.id) {
                                        socket.emit("join", gameData.id);
                                        navigate(`/game/${gameData.id}`);
                                    } else {
                                        setError("Le code ne correspond à aucune partie");
                                        setShow(true);
                                        setTimeout(() => {
                                            setShow(false);
                                        }, 5000);
                                    }
                                });
                            }}
                        >
                            {({ values, handleChange, handleBlur, handleSubmit }) => (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">
                                    <input
                                        id="partyCode"
                                        name="partyCode"
                                        type="text"
                                        value={values.partyCode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 dark:bg-gray-700 dark:text-gray-300"
                                    />
                                    <div className={"flex items-center gap-x-2"}>
                                        <button
                                            onClick={createParty}
                                            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
                                        >
                                            Créer
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
                                        >
                                            Rejoindre
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-y-6 items-center">
                    <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Bienvenue sur Guess Who!</h2>
                    <p className="text-gray-500 dark:text-gray-400">Connectez-vous ou inscrivez-vous pour jouer</p>
                    <div className="flex gap-4">
                        <Link
                            to="/login"
                            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                        >
                            Se connecter
                        </Link>
                        <Link
                            to="/register"
                            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
                        >
                            S'inscrire
                        </Link>
                    </div>
                </div>
            )}

            <Transition show={show}>
                <div
                    className="absolute top-4 right-4 pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <Icon path={mdiCloseCircle} size={1} className="text-red-500"/>
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-gray-900">Erreur</p>
                                <p className="mt-1 text-sm text-gray-500">{error}</p>
                            </div>
                            <div className="ml-4 flex flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShow(false)
                                    }}
                                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <span className="sr-only">Close</span>
                                    <Icon path={mdiClose} size={1}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    );
};

export default Home;
