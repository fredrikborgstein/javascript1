import Toaster from "../components/toaster.js";
import Modal from "../components/modal.js";
import {checkIsMember, checkIsSubToNewsletters, setIsMember, setIsSubToNewsletter} from "./session.js";
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
    form.appendChild(nameInput);

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.placeholder = 'Your email';
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