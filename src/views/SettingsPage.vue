<script setup>
import axios from 'axios';

var private_id = defineModel();
private_id.value = localStorage.getItem("pv");
function copyClipboard () {
    navigator.clipboard.writeText(private_id.value);
}

function changePrivateId () {
    localStorage.setItem("pv", private_id.value);
}

function reset () {
    localStorage.removeItem("pv");
    axios.get(import.meta.env.VITE_APP_URL + '/init_users')
        .then(function (response) {
            private_id.value = response.data['private_id'];
            localStorage.setItem("pv", response.data['private_id']);
        });
}
</script>

<template>
    <div>
        <div class="top_setting">
            <router-link class="back_button" to="/">Retour</router-link>
        </div>
        <div class="content_setting">
            <p class="info">Voici votre identifiant utilisateur. Conservez-le précieusement, car il vous sera nécessaire
                pour récupérer
                votre compte sur un autre appareil. Pour utiliser votre compte sur un autre périphérique, veuillez copier
                votre identifiant privé sur ce nouvel appareil et valider.</p>
            <div class="private_id">
                ID Privée : <input type="text" v-model="private_id">
                <button @click="copyClipboard">Copier</button>
                <button @click="changePrivateId">Valider</button>
            </div>
            <p class="warning">En cas de perte, vous risquez de perdre l'accès à votre compte</p>
            <button @click="reset" class="reset">Reinitialiser à zéro</button>
        </div>
    </div>
</template>


<style>
.back_button {
    cursor: pointer;
    margin: 20px;
    border: 1px solid rgb(76, 181, 116);
    border-radius: 5px;
    padding: 10px 20px;
    color: rgb(76, 181, 116);
    font-weight: bold;
    text-decoration: none;
}

.content_setting button.reset {
    width: max-content;
    cursor: pointer;
    background-color: rgb(181, 78, 76);
    border-radius: 5px;
    padding: 10px 20px;
    color: white;
    font-weight: bold;
    text-decoration: none;
    margin: 0;
}

.content_setting button.reset:active {
    background-color: rgb(157, 53, 51);
}

.top_setting {
    display: flex;
}

.info {
    color: rgb(148, 148, 148);
    font-style: italic;
    font-weight: 500;
}

.warning {
    color: rgb(199, 0, 0);
    font-weight: bold;
}

.private_id {
    display: flex;
    align-items: center;
}

.content_setting {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
}

.content_setting input {
    margin-left: 12px;
    width: 33%;
    padding: 8px 6px;
    border-radius: 5px;
    border: 1px solid rgb(198, 198, 198);
}

.content_setting button {
    cursor: pointer;
    margin-left: 20px;
    background-color: rgb(76, 181, 116);
    border-radius: 5px;
    padding: 10px 20px;
    color: white;
    font-weight: bold;
    border: none;
}

.content_setting button:active {
    background-color: rgb(43, 142, 81);
}
</style>