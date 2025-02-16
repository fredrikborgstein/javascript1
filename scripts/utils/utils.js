import Toaster from "../components/toaster.js";
import Modal from "../components/modal.js";
import {checkIsMember, checkIsSubToNewsletters, setIsMember, setIsSubToNewsletter} from "./session.js";
import {getOneProduct} from "./apiFunctions.js";
const toast = new Toaster();
const modal = new Modal();
export async function loadHeaderAndFooter() {
    try {
        const headerResponse = await fetch('../../html-components/header.html');
        document.getElementById('header-placeholder').innerHTML = await headerResponse.text();

        const footerResponse = await fetch('../../html-components/footer.html');
        document.getElementById('footer-placeholder').innerHTML = await footerResponse.text();

    } catch (error) {
        toast.show(error.message, 'error');
    }
}

export function subscribeToNewsletter()
{
    const input = document.getElementById('email-input');
    const email = input.value;

    if (!email) {
        toast.show('Please enter a valid email address', 'error');
        return;
    }

    if (checkIsSubToNewsletters(email)) {
        toast.show('You are already subscribed to our newsletter.', 'error');
        input.value = '';
        return;
    }

    setIsSubToNewsletter(email);
    toast.show('You successfully subscribed to our newsletter.', 'success');
    input.value = '';
}

export function becomeMemberForm() {
    const modalHtml = document.createElement('div');
    const form = document.createElement('form');
    form.id = 'member-form';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'name';
    nameInput.placeholder = 'Your name';
    nameInput.required;
    nameInput.classList.add('form-control');

    form.appendChild(nameInput);

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.required;
    emailInput.placeholder = 'Your email';
    emailInput.classList.add('form-control');
    form.appendChild(emailInput);

    modalHtml.appendChild(form);

    modal.show({
        title: 'Become Member',
        message: 'Join our members, and experience our great benefits!',
        html: modalHtml,
        confirmText: 'Submit',
        cancelText: 'Cancel',
        onConfirm: () => {
            const name = nameInput.value;
            const email = emailInput.value;

            if (!email || !name) {
                toast.show('Email and name are required', 'error');
                return;
            }

            if (!checkIsMember(email)) {
                setIsMember(email, name);
                toast.show('Welcome as our newest member!', 'success');
                nameInput.value = '';
                emailInput.value = '';
            } else {
                toast.show('You are already a member!', 'error');
                nameInput.value = '';
                emailInput.value = '';
            }
        },
        onCancel: () => {},
    });
}

export function submitContactForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const name = nameInput.value;
    const email = emailInput.value;
    const message = messageInput.value;
    const submitId = Math.random().toString(36);

    if (!email) {
        toast.show('Please enter a valid email address', 'error');
    } else if (!name) {
        toast.show('Please enter a name', 'error');
    } else if (!message) {
        toast.show('Please enter a message', 'error');
    } else {
        const formObject = {
            name,
            email,
            message,
        }

        localStorage.setItem(submitId, JSON.stringify(formObject));
        modal.show({
            title: 'Thank you for reaching out!',
            message: 'We will reply as soon as possible, and within 3-5 business days.',
            confirmText: 'Ok',
            onConfirm: () => {
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
            }
        });
    }
}

export async function getProductDetails(cartData) {
    const cartProducts = [];

    for (const item of cartData) {
        try {
            const product = await getOneProduct(item.productId);
            if (product) {
                cartProducts.push({ ...product, quantity: item.quantity });
            } else {
                console.warn(`Product with ID ${item.productId} not found.`);
            }
        } catch (error) {
            console.error(`Error fetching product details for ID ${item.productId}:`, error);
        }
    }

    return cartProducts;
}