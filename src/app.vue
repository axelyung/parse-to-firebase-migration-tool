<template>
    <div class="app">
        <div class="title m-b-1">Parse to Firebase Migrator</div>
        <div class="content">
            <div class="m-b-1">
                <div class="label">Status:</div>
                <span v-if="!initiated">Initiating</span>
                <span v-else-if="!authenticated">Login to continue</span>
                <span v-else>Initiated and ready to migrate</span>
            </div>
            <div v-if="authenticated" class="m-b-1">
                <div class="label">Logged in as:</div>
                <span>{{ userName }}</span>
                <button @click="logout">Log out</button>
            </div>
            <div v-else class="login m-b-1">
                <div class="label">Log in with:</div>
                <button v-if="providers.facebook" @click="login('fb')">facebook</button>
                <button v-if="providers.google" @click="login('gh')">github</button>
                <button v-if="providers.github" @click="login('g')">google</button>
                <button v-if="providers.twitter" @click="login('t')">twitter</button>
            </div>
            <div class="actions m-b-1">
                <div class="label">Actions:</div>
                <button @click="simulate" :disabled="!authenticated">Simulate</button>
                <button @click="migrate" :disabled="!authenticated">Migrate</button>
            </div>
            <div class="label">Log:</div>
            <div class="activity-log">
                <div v-for="line in log" :key="line" v-html="line"></div>
                <div v-if="summary">
                    <div>{{ summary.status }}</div>
                    <div v-html="summary.message"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    import { parseInit } from './parse';
    import { firebaseInit, authenticate, signOut, subscribeToAuthChange } from './firebase';
    import { migrate, simulate } from './main';

    import config from '../config.json';

    export default {
        data() {
            return {
                msg: 'Hello from vue-loader!',
                initiated: false,
                providers: config.env.authProviders,
                userName: '',
                log: [],
                summary: {}
            }
        },
        mounted() {
            this.init();
        },
        computed: {
            authenticated() {
                return this.userName !== '';
            }
        },
        methods: {
            async init() {
                try {
                    parseInit(config.env.parse)
                    firebaseInit(config.env.firebase)
                    subscribeToAuthChange(user => {
                        if (user) {
                            this.userName = user.displayName
                        } else {
                            this.userName = ''
                        }
                    });
                    this.initiated = true;
                }
                catch (err) {
                    console.log(err)
                }
            },
            login(providerId) {
                authenticate(providerId).then(result => {
                    this.userName = result.user.displayName;
                }).catch(err => {
                    console.log(err);
                });
            },
            logout() {
                signOut();
            },
            simulate() {
                this.clear();
                simulate(message => {
                    this.log.push(message);
                }).then(summary => {
                    this.summary = summary;
                })
            },
            migrate() {
                this.clear();
                migrate(message => {
                    this.log.push(message);
                }).then(summary => {
                    this.summary = summary;
                });
            },
            clear() {
                this.log = [];
                this.summary = {};
            }
        }
    }

</script>

<style lang="scss">
    .app {
        font-family: Arial, Helvetica, sans-serif;
        padding: 2rem;
        .m-b-1 {
            margin-bottom: 1rem;
        }
        .title {
            font-size: 1.5rem;
            font-weight: bold;
        }
        .label {
            color: gray
        }
        .activity-log{
            padding: 1rem;
            height: 20rem;
            background: lightgray;
            overflow-y: scroll;
        }
    }
</style>