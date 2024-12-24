const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000; // Make sure this matches your frontend fetch URL

app.use(bodyParser.json());

const users = [
  { email: 'test@example.com', password: 'password123' } // Sample user data
];

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.status(200).json({ success: true, message: 'Login successful!' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
