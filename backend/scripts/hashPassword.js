// scripts/hashPassword.js
const bcrypt = require('bcrypt');

const run = async () => {
  const plainPassword = 'hola123'; // la contraseña que deseas usar
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log('Hash generado:', hash);
};

run();
