export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: "AIzaSyBlpa_KNpCM2gW3x7CU92prqCm1P6UeTcc",
    authDomain: "tps-pps.firebaseapp.com",
    databaseURL: "https://tps-pps-default-rtdb.firebaseio.com",
    projectId: "tps-pps",
    storageBucket: "tps-pps.appspot.com",
    messagingSenderId: "370063651241",
    appId: "1:370063651241:web:648d9dd8a8f0d6a71ad4b8"
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
  }
};
