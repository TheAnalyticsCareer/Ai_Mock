import { InterviewTemplate } from '../types';

export const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'React Developer',
  'Node.js Developer',
  'Python Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile Developer',
  'UI/UX Designer'
];

export const TECH_STACKS = {
  'Frontend Developer': ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Vue.js', 'Angular'],
  'Backend Developer': ['Node.js', 'Python', 'Java', 'Go', 'PostgreSQL', 'MongoDB'],
  'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
  'React Developer': ['React', 'TypeScript', 'Redux', 'Next.js', 'Jest'],
  'Node.js Developer': ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'TypeScript'],
  'Python Developer': ['Python', 'Django', 'Flask', 'PostgreSQL', 'Redis'],
  'Data Scientist': ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow'],
  'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
  'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin'],
  'UI/UX Designer': ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research']
};

export const DUMMY_INTERVIEWS: InterviewTemplate[] = [
  {
    id: 'template-1',
    role: 'Frontend Developer',
    level: 'Mid',
    techStack: ['React', 'TypeScript', 'CSS'],
    description: 'Practice frontend development concepts with React and TypeScript',
    estimatedDuration: '45 minutes',
    coverImage: 'photo-1649972904349-6e44c42644a7'
  },
  {
    id: 'template-2',
    role: 'Full Stack Developer',
    level: 'Senior',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    description: 'Comprehensive full-stack interview covering frontend and backend',
    estimatedDuration: '60 minutes',
    coverImage: 'photo-1488590528505-98d2b5aba04b'
  },
  {
    id: 'template-3',
    role: 'Backend Developer',
    level: 'Junior',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    description: 'Backend fundamentals and API development',
    estimatedDuration: '30 minutes',
    coverImage: 'photo-1461749280684-dccba630e2f6'
  }
];

export const COVER_IMAGES = [
  'photo-1649972904349-6e44c42644a7',
  'photo-1488590528505-98d2b5aba04b',
  'photo-1461749280684-dccba630e2f6',
  'photo-1486312338219-ce68d2c6f44d',
  'photo-1581091226825-a6a2a5aee158'
];
