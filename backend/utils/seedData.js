const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');
const MentorshipRequest = require('../models/MentorshipRequest');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-mgmt');
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Sample users data
const sampleUsers = [
  {
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'admin@kecalumni.edu',
    password: 'admin123',
    role: 'admin',
    phone: '+91-9876543210',
    graduationYear: 2015,
    department: 'Computer Science and Engineering',
    currentJob: {
      title: 'Alumni Relations Manager',
      company: 'Kongu Engineering College',
      location: 'Perundurai, Tamil Nadu'
    },
    bio: 'Alumni Relations Manager at Kongu Engineering College. Computer Science graduate with expertise in system administration and alumni network management.',
    isMentor: true,
    mentorshipAreas: ['career-guidance', 'technical-skills', 'industry-insights'],
    linkedinProfile: 'https://linkedin.com/in/rajeshkumar'
  },
  {
    firstName: 'Priya',
    lastName: 'Subramanian',
    email: 'priya.subramanian@tcs.com',
    password: 'password123',
    role: 'alumni',
    phone: '+91-9123456789',
    graduationYear: 2018,
    department: 'Information Technology',
    currentJob: {
      title: 'Senior Software Engineer',
      company: 'Tata Consultancy Services',
      location: 'Chennai, Tamil Nadu'
    },
    bio: 'Senior Software Engineer at TCS with 6+ years of experience in full-stack development. Passionate about mentoring junior developers and helping students transition to industry.',
    isMentor: true,
    mentorshipAreas: ['career-guidance', 'technical-skills', 'interview-preparation'],
    linkedinProfile: 'https://linkedin.com/in/priyasubramanian'
  },
  {
    firstName: 'Arjun',
    lastName: 'Krishnamurthy',
    email: 'arjun.krishna@infosys.com',
    password: 'password123',
    role: 'alumni',
    phone: '+91-8765432109',
    graduationYear: 2020,
    department: 'Computer Science and Engineering',
    currentJob: {
      title: 'Technology Analyst',
      company: 'Infosys Limited',
      location: 'Bangalore, Karnataka'
    },
    bio: 'Technology Analyst specializing in cloud computing and DevOps. Love sharing knowledge about modern software development practices.',
    isMentor: true,
    mentorshipAreas: ['technical-skills', 'career-guidance', 'industry-insights'],
    linkedinProfile: 'https://linkedin.com/in/arjunkrishnamurthy'
  },
  {
    firstName: 'Lakshmi',
    lastName: 'Narayanan',
    email: 'lakshmi.narayanan@wipro.com',
    password: 'password123',
    role: 'alumni',
    phone: '+91-7654321098',
    graduationYear: 2019,
    department: 'Electronics and Communication Engineering',
    currentJob: {
      title: 'Project Manager',
      company: 'Wipro Technologies',
      location: 'Coimbatore, Tamil Nadu'
    },
    bio: 'Project Manager with expertise in embedded systems and IoT solutions. Experienced in leading cross-functional teams.',
    isMentor: true,
    mentorshipAreas: ['career-guidance', 'industry-insights'],
    linkedinProfile: 'https://linkedin.com/in/lakshmi-narayanan'
  },
  {
    firstName: 'Vikram',
    lastName: 'Chandrasekaran',
    email: 'vikram.chandra@zoho.com',
    password: 'password123',
    role: 'alumni',
    phone: '+91-6543210987',
    graduationYear: 2021,
    department: 'Mechanical Engineering',
    currentJob: {
      title: 'Product Designer',
      company: 'Zoho Corporation',
      location: 'Chennai, Tamil Nadu'
    },
    bio: 'Product Designer working on innovative software solutions. Interested in design thinking and user experience.',
    isMentor: false,
    mentorshipAreas: [],
    linkedinProfile: 'https://linkedin.com/in/vikramchandrasekaran'
  },
  {
    firstName: 'Kavya Shree',
    lastName: 'C S',
    email: 'kavyashreecs.24it@kongu.edu',
    password: 'password123',
    role: 'student',
    phone: '+91-9876501234',
    graduationYear: 2028,
    department: 'Information Technology',
    bio: 'Final year Information Technology student interested in web development and artificial intelligence. Active in coding competitions and technical events.',
    isMentor: false,
    mentorshipAreas: []
  },
  {
    firstName: 'Madhu Sri',
    lastName: 'R',
    email: 'madhusrir.24it@kongu.edu',
    password: 'password123',
    role: 'student',
    phone: '+91-9876501235',
    graduationYear: 2028,
    department: 'Information Technology',
    bio: 'Final year Information Technology student passionate about data science and machine learning. Member of the college coding club.',
    isMentor: false,
    mentorshipAreas: []
  },
  {
    firstName: 'Arun',
    lastName: 'Prakash',
    email: 'arun.prakash@amazon.com',
    password: 'password123',
    role: 'alumni',
    phone: '+91-5432109876',
    graduationYear: 2017,
    department: 'Computer Science and Engineering',
    currentJob: {
      title: 'Software Development Engineer',
      company: 'Amazon India',
      location: 'Hyderabad, Telangana'
    },
    bio: 'Software Development Engineer at Amazon with expertise in distributed systems and scalable architecture. Alumni mentor for technical interviews.',
    isMentor: true,
    mentorshipAreas: ['career-guidance', 'technical-skills', 'interview-preparation'],
    linkedinProfile: 'https://linkedin.com/in/arunprakash'
  },
  {
    firstName: 'Divya',
    lastName: 'Ramesh',
    email: 'divya.ramesh@microsoft.com',
    password: 'password123',
    role: 'alumni',
    phone: '+91-4321098765',
    graduationYear: 2016,
    department: 'Information Technology',
    currentJob: {
      title: 'Senior Program Manager',
      company: 'Microsoft India',
      location: 'Bangalore, Karnataka'
    },
    bio: 'Senior Program Manager at Microsoft focusing on cloud solutions. Passionate about empowering women in technology.',
    isMentor: true,
    mentorshipAreas: ['career-guidance', 'personal-development', 'industry-insights'],
    linkedinProfile: 'https://linkedin.com/in/divyaramesh'
  }
];

// Sample events data
const sampleEvents = [
  {
    title: 'KEC Alumni Meet 2025',
    description: 'Annual reunion of Kongu Engineering College alumni. Connect with your batchmates, faculty, and fellow engineers. Cultural programs, tech talks, and networking sessions planned.',
    eventDate: new Date('2025-12-15'),
    eventTime: '10:00',
    location: 'KEC Main Auditorium, Perundurai, Tamil Nadu',
    eventType: 'reunion',
    maxAttendees: 800,
    isVirtual: false,
    tags: ['reunion', 'networking', 'kec', 'alumni'],
    registrationDeadline: new Date('2025-12-10')
  },
  {
    title: 'Tech Career Workshop: Cracking IT Interviews',
    description: 'Comprehensive workshop on landing your dream job in IT companies. Learn interview strategies, coding practice, and industry insights from KEC alumni working in top tech companies.',
    eventDate: new Date('2025-11-20'),
    eventTime: '14:00',
    location: 'Virtual - Google Meet',
    eventType: 'workshop',
    maxAttendees: 200,
    isVirtual: true,
    virtualLink: 'https://meet.google.com/kec-tech-workshop',
    tags: ['career', 'technology', 'interview', 'it-jobs'],
    registrationDeadline: new Date('2025-11-18')
  },
  {
    title: 'Entrepreneurship Panel: Success Stories from Tamil Nadu',
    description: 'Hear from successful KEC alumni entrepreneurs who have built thriving businesses in Tamil Nadu. Learn about startup ecosystem, funding, and building teams in South India.',
    eventDate: new Date('2025-11-25'),
    eventTime: '16:00',
    location: 'TIDEL Park, Chennai, Tamil Nadu',
    eventType: 'seminar',
    maxAttendees: 150,
    isVirtual: false,
    tags: ['entrepreneurship', 'startup', 'business', 'tamilnadu'],
    registrationDeadline: new Date('2025-11-23')
  },
  {
    title: 'KEC Alumni Networking - Coimbatore Chapter',
    description: 'Casual networking event for KEC alumni working in and around Coimbatore. Great opportunity to expand your professional network and discuss opportunities in textile and manufacturing industries.',
    eventDate: new Date('2025-12-05'),
    eventTime: '18:30',
    location: 'Hotel Heritage Inn, Race Course, Coimbatore',
    eventType: 'networking',
    maxAttendees: 100,
    isVirtual: false,
    tags: ['networking', 'coimbatore', 'manufacturing', 'textile']
  },
  {
    title: 'Virtual Placement Drive 2025',
    description: 'Exclusive placement opportunities for KEC students and recent graduates. Leading IT companies, manufacturing firms, and startups from Tamil Nadu and Bangalore participating.',
    eventDate: new Date('2025-11-30'),
    eventTime: '09:00',
    location: 'Virtual - KEC Placement Portal',
    eventType: 'career-fair',
    maxAttendees: 500,
    isVirtual: true,
    virtualLink: 'https://placements.kongu.edu',
    tags: ['career', 'jobs', 'placement', 'virtual', 'students']
  },
  {
    title: 'Technical Symposium: Industry 4.0 and IoT',
    description: 'Technical symposium featuring latest trends in Industry 4.0, IoT, and smart manufacturing. Industry experts and KEC faculty will present cutting-edge research and applications.',
    eventDate: new Date('2025-12-20'),
    eventTime: '09:30',
    location: 'KEC Seminar Hall, Perundurai, Tamil Nadu',
    eventType: 'seminar',
    maxAttendees: 300,
    isVirtual: false,
    tags: ['technology', 'iot', 'industry4.0', 'research', 'technical'],
    registrationDeadline: new Date('2025-12-18')
  }
];

// Hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Seed users
const seedUsers = async () => {
  console.log('Seeding users...');
  
  // Clear existing users
  await User.deleteMany({});
  
  // Hash passwords and create users
  const usersWithHashedPasswords = await Promise.all(
    sampleUsers.map(async (user) => ({
      ...user,
      password: await hashPassword(user.password)
    }))
  );
  
  const createdUsers = await User.insertMany(usersWithHashedPasswords);
  console.log(`Created ${createdUsers.length} users`);
  return createdUsers;
};

// Seed events
const seedEvents = async (users) => {
  console.log('Seeding events...');
  
  // Clear existing events
  await Event.deleteMany({});
  
  // Add organizer (admin user) to events
  const adminUser = users.find(user => user.role === 'admin');
  const eventsWithOrganizer = sampleEvents.map(event => ({
    ...event,
    organizer: adminUser._id
  }));
  
  const createdEvents = await Event.insertMany(eventsWithOrganizer);
  console.log(`Created ${createdEvents.length} events`);
  return createdEvents;
};

// Seed sample mentorship requests
const seedMentorshipRequests = async (users) => {
  console.log('Seeding mentorship requests...');
  
  // Clear existing mentorship requests
  await MentorshipRequest.deleteMany({});
  
  const mentors = users.filter(user => user.isMentor);
  const mentees = users.filter(user => !user.isMentor || user.role === 'student');
  
  if (mentors.length === 0 || mentees.length === 0) {
    console.log('No mentors or mentees found, skipping mentorship requests');
    return [];
  }
  
  const sampleRequests = [
    {
      mentor: mentors[0]._id, // Priya Subramanian
      mentee: mentees.find(u => u.email === 'kavyashreecs.24it@kongu.edu')._id,  // Kavya Shree
      subject: 'Career Guidance for IT Graduate',
      message: 'Hi Priya ma\'am, I\'m final year IT student at KEC. I would love guidance on transitioning from college to IT industry and preparing for campus placements.',
      mentorshipArea: 'career-guidance',
      status: 'pending',
      preferredMeetingType: 'video-call',
      urgency: 'medium',
      expectedDuration: '1-hour',
      preferredTimeSlots: [
        { day: 'tuesday', timeSlot: 'evening' },
        { day: 'thursday', timeSlot: 'afternoon' }
      ]
    },
    {
      mentor: mentors.find(u => u.firstName === 'Arjun')._id, // Arjun Krishnamurthy
      mentee: mentees.find(u => u.email === 'madhusrir.24it@kongu.edu')._id,  // Madhu Sri
      subject: 'Technical Interview Preparation',
      message: 'Hello Arjun sir, I have upcoming technical interviews for IT companies and would appreciate your guidance on coding interview preparation and what to expect.',
      mentorshipArea: 'interview-preparation',
      status: 'accepted',
      preferredMeetingType: 'video-call',
      urgency: 'high',
      expectedDuration: '1-2-hours',
      mentorResponse: 'I\'d be happy to help you prepare for technical interviews. Let\'s schedule a session to go over DSA concepts and practice problems.',
      respondedAt: new Date(),
      preferredTimeSlots: [
        { day: 'saturday', timeSlot: 'morning' },
        { day: 'sunday', timeSlot: 'afternoon' }
      ]
    },
    {
      mentor: mentors.find(u => u.firstName === 'Lakshmi')._id, // Lakshmi Narayanan
      mentee: users.find(u => u.firstName === 'Vikram')._id, // Vikram Chandrasekaran
      subject: 'Industry Insights - Project Management',
      message: 'Hi Lakshmi, I\'m interested in transitioning to project management role. Would love to learn about the field and growth opportunities.',
      mentorshipArea: 'career-guidance',
      status: 'completed',
      preferredMeetingType: 'phone-call',
      urgency: 'low',
      expectedDuration: '30-minutes',
      mentorResponse: 'Sure, I can share insights about project management and different career paths in this field.',
      respondedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      rating: {
        mentorRating: 5,
        menteeRating: 5,
        mentorFeedback: 'Vikram was well-prepared and asked great questions. Pleasure to help!',
        menteeFeedback: 'Lakshmi provided excellent insights and was very helpful. Highly recommend!'
      }
    },
    {
      mentor: mentors.find(u => u.firstName === 'Divya')._id, // Divya Ramesh
      mentee: mentees.find(u => u.email === 'kavyashreecs.24it@kongu.edu')._id,  // Kavya Shree
      subject: 'Women in Tech - Career Growth',
      message: 'Hi Divya ma\'am, As a woman entering the tech field, I would love guidance on career growth and professional development opportunities.',
      mentorshipArea: 'personal-development',
      status: 'accepted',
      preferredMeetingType: 'video-call',
      urgency: 'medium',
      expectedDuration: '1-hour',
      mentorResponse: 'I\'d be delighted to share my experience and discuss strategies for women in tech. Let\'s connect!',
      respondedAt: new Date(),
      preferredTimeSlots: [
        { day: 'wednesday', timeSlot: 'evening' },
        { day: 'friday', timeSlot: 'evening' }
      ]
    }
  ];
  
  const createdRequests = await MentorshipRequest.insertMany(sampleRequests);
  console.log(`Created ${createdRequests.length} mentorship requests`);
  return createdRequests;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    const users = await seedUsers();
    const events = await seedEvents(users);
    const requests = await seedMentorshipRequests(users);
    
    console.log('\n=== Seeding Complete! ===');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${events.length} events`);
    console.log(`Created ${requests.length} mentorship requests`);
    
    console.log('\n=== Sample Login Credentials ===');
    console.log('Admin: admin@kecalumni.edu / admin123');
    console.log('Alumni: priya.subramanian@tcs.com / password123');
    console.log('Student: kavyashreecs.24it@kongu.edu / password123');
    console.log('Student: madhusrir.24it@kongu.edu / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };