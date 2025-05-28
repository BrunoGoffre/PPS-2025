// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyClMeGLX-lZF_lfIM-eIfgGIUTqrZJMrig',
    authDomain: 'explicacionde-69955.firebaseapp.com',
    databaseURL: 'https://explicacionde-69955-default-rtdb.firebaseio.com',
    projectId: 'explicacionde-69955',
    storageBucket: 'explicacionde-69955.appspot.com',
    messagingSenderId: '729589697558',
    appId: '1:729589697558:web:fac5d632b92b4677eab937',
  },
  usuario: {
    admin: {
      email: "admin@admin.com",
      pass: "123456",
      rol : "Administrador"
    },
    tester: {
      email: "tester@tester.com",
      pass: "123456",
      rol : "Tester"
    },
    usuario: {
      email: "usuario@usuario.com",
      pass : "123456",
      rol : "Usuario"
    }
  },
}