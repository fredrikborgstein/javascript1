import Modal from "../components/modal.js";
import {initCart} from "./cart.js";

const modal = new Modal();

export default function initSession() {
    if (!checkSession()) {
           modal.show({
               title: 'Hello world',
               message: 'Welcome to Gamehub!',
               confirmText: 'Ok',
               onConfirm: () => {
                   console.log('hello');
               },
           });

           setSession();
    }

    initCart();
}


function checkSession() {
    return sessionStorage.getItem('session') !== null;
}

function setSession() {
    return sessionStorage.setItem('session', 'true');
}

function checkIsMember() {
    return sessionStorage.getItem('isMember');
}

function setIsMember() {
    return sessionStorage.setItem('isMember', 'true');
}

function setIsSubToNewsletter() {
    return sessionStorage.setItem('isSubToNewsletter', 'true');
}

function checkIsSubToNewsletters() {
    return sessionStorage.getItem('isSubToNewsletters');
}
