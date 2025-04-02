const bcrypt = require('bcrypt');
bcrypt.hash('adminpassword', 10).then(hash => console.log(hash));
