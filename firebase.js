import { initializeApp } from 'firebase'


const app = initializeApp({
  apiKey: "AIzaSyDWoKjb1rijTl9IVG6E0bqPUC7VE9qILzg",
  authDomain: "backup-vr-tictactoe.firebaseapp.com",
  databaseURL: "https://backup-vr-tictactoe.firebaseio.com",
  projectId: "backup-vr-tictactoe",
  storageBucket: "",
  messagingSenderId: "547823507364"
});

export const db = app.database();