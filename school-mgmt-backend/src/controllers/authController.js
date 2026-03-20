const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, classSection } = req.body;
    
    // Hash the password for production security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name, email, password: hashedPassword, role, classSection
    });

    res.status(201).json({ message: 'User created successfully', userId: newUser.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role, classSection: user.classSection}, process.env.JWT_SECRET);
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- NEW: Fetch Unique Classes ---
exports.getClasses = async (req, res) => {
  try {
    // We use Sequelize's 'fn' to call DISTINCT on the classSection column
    const classes = await User.findAll({
      attributes: [
        [User.sequelize.fn('DISTINCT', User.sequelize.col('class_section')), 'classSection']
      ],
      where: {
        role: 'student' // Only show classes that have students assigned
      },
      order: [['classSection', 'ASC']] // Sort alphabetically (e.g., 1-A, 1-B, 2-A)
    });

    // Extract the strings from the object array: [{classSection: '10-A'}] -> ['10-A']
    const classList = classes.map(item => item.classSection).filter(Boolean);

    res.json(classList);
  } catch (err) {
    console.error("Error fetching classes:", err.message);
    res.status(500).json({ error: "Could not fetch classes from database" });
  }
};