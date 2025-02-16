import Modal from "../components/modal.js";
import {initCart} from "./cart.js";

const modal = new Modal();
const sessionId =  Math.random().toString(36);

export default function initSession() {
    if (!checkSession()) {
           modal.show({
               title: 'Welcome to Gamehub!',
               message: 'Join us as a member today, and receive excellent benefits, discounts and more!',
               confirmText: 'Ok',
               onConfirm: () => {
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
    return sessionStorage.setItem('session', sessionId);
}

export function checkIsMember(email) {
    return sessionStorage.getItem(`isMember-${email}`) !== null;
}

export function setIsMember(email, name) {
    return sessionStorage.setItem(`isMember-${email}`, `Name: ${name}, Email: ${email}`);
}

export function setIsSubToNewsletter(email) {
    return sessionStorage.setItem(`isSubbed-${email}`, email);
}

export function checkIsSubToNewsletters(email) {
    return  sessionStorage.getItem(`isSubbed-${email}`) !== null;
}
