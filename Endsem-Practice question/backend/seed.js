const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Candidate = require('./models/Candidate');

dotenv.config();

const sampleCandidates = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    skills: ['React', 'Node.js', 'JavaScript', 'HTML', 'CSS', 'MongoDB'],
    experience: 3,
    bio: 'Passionate frontend-heavy full-stack developer with a knack for building responsive UIs.',
    projects: 'E-commerce dashboard, Personal portfolio site'
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
    experience: 5,
    bio: 'Experienced backend engineer focusing on scalable microservices and cloud infrastructure.',
    projects: 'Microservices billing platform, Data pipeline for analytics'
  },
  {
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    skills: ['Java', 'Spring Boot', 'MySQL', 'React', 'TypeScript'],
    experience: 2,
    bio: 'Full-stack developer with enterprise application experience.',
    projects: 'Internal HR management system'
  },
  {
    name: 'Diana Evans',
    email: 'diana@example.com',
    skills: ['Node.js', 'Express', 'MongoDB', 'React', 'Redux', 'GraphQL'],
    experience: 4,
    bio: 'MERN stack expert who loves optimizing database queries and building robust APIs.',
    projects: 'Real-time chat application, Social media clone'
  },
  {
    name: 'Evan Wright',
    email: 'evan@example.com',
    skills: ['JavaScript', 'HTML', 'CSS', 'Figma'],
    experience: 1,
    bio: 'Junior frontend developer transitioning from UI/UX design.',
    projects: 'Landing pages for local businesses'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing candidates to avoid duplicates during testing
    await Candidate.deleteMany({});
    console.log('Cleared existing candidates');

    await Candidate.insertMany(sampleCandidates);
    console.log('Sample candidates added successfully');

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
