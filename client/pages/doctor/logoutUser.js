import React, {useEffect, useState} from 'react';
import { useRouter } from "next/router";
import { useCookies, Cookies } from "react-cookie";

export default function LogoutUser () {
    const [cookies, setCookie, removeCookie] = useCookies(['express:sess']);
    const Router = useRouter();

    useEffect(() => {
        // Remove Cookie
        removeCookie('express:sess', { path: '/' });
        localStorage.clear();
        Router.push('/');
    });

    return (
        <div>
            Logging Out ....
        </div>
    )
};