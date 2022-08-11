const express = require('express');
const app = express();
const PORT = 5000;
const db = require('./database')

app.use(express.json());

require('./models/user');
require('./models/outpass');
db.model("User");
db.model("Outpass")
app.use(require('./routes/auth'));
app.use(require('./routes/outpass'));
app.use(require('./routes/admin'));

app.listen(PORT, () => {
  console.log(`The Server is running on port: ${PORT}`);
})
