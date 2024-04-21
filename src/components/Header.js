import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adduser, removeUser } from "../utils/userSlice";
import { LOGO_URL, USER_ICON } from "../utils/constants";

const Header = () => {
    const dispatch = useDispatch();
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    const user = useSelector((store) => store.user);
    const userName = user?.displayName;
    const navigate = useNavigate();
    const handleSignOut = () => {
        signOut(auth).then(() => {
        }).catch((error) => {
            // An error happened.
            navigate("/error")
        });
    }

    const toggleDropDown = () => {
        setIsDropDownOpen(!isDropDownOpen);
    }
    // using fire base API to store all the values into store
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { uid, email, displayName } = user;
                dispatch(adduser({ uid: uid, email: email, displayName: displayName }))
                navigate("/browse");
            } else {
                // User is signed out
                dispatch(removeUser());
                navigate("/");
            }
        });

        // Unsubscribe when component unmount
        return () => unsubscribe();
    }, [])

    return (
        <div className="absolute top-1 left-6 z-10 flex justify-between w-full px-8 mx-auto">
            <img
                className="w-52"
                src={LOGO_URL}
                alt="logo"
            />
            {user && <div className="flex p-2 m-2">
                <img
                    className="w-8 h-9 cursor-pointer"
                    src={USER_ICON}
                    alt="usericon"
                    onClick={toggleDropDown}
                />
                {isDropDownOpen && (
                    <div className="absolute bg-gray-800 text-gray-300 mt-10 w-60 right-10 p-2 rounded-lg shadow-lg ">
                        <ul className="list-none p-0">
                            <li className="text-sm py-2 px-3 border-b border-gray-600">Hello {userName}</li>
                            <li className="text-sm py-2 px-3 border-b border-gray-600">
                                <button
                                    className="text-red-500 hover:text-red-700 focus:outline-none"
                                    onClick={handleSignOut}
                                >
                                    Sign Out
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>}
        </div>
    );
};
export default Header;