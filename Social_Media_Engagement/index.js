
const express = require('/Users/user_name/node_modules/express');
const app = express();
app.listen(3000, ()=> console.log('listening at 3000'))
app.use(express.static('public'))

