const express = require('express');
const app = express();
const PORT = 5000;
const db = require('./database')

app.use(express.json());

require('./models/user');
db.model("User");
app.use(require('./routes/auth'));

app.listen(PORT, () => {
  console.log(`The Server is running on port: ${PORT}`);
})
