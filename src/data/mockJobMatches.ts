import { Consultant } from '@/types';

export interface JobMatch {
  consultant: Consultant;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
}

export const mockJobMatches: Record<string, JobMatch[]> = {
  '1': [ // Senior Java Developer
    {
      consultant: {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+1 (555) 123-4567',
        visaStatus: 'H1B',
        skills: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Kubernetes'],
        rate: 75,
        status: 'available',
        location: 'Dallas, TX',
        experience: 8,
        lastUpdated: '2024-01-15',
        matchScore: 92,
        aiSummary: 'Senior Java developer with 8+ years of experience in enterprise applications.'
      },
      matchScore: 92,
      matchingSkills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
      missingSkills: ['Kafka']
    },
    {
      consultant: {
        id: '5',
        name: 'Vikram Singh',
        email: 'vikram.singh@email.com',
        phone: '+1 (555) 567-8901',
        visaStatus: 'USC',
        skills: ['DevOps', 'Terraform', 'Ansible', 'Docker', 'Kubernetes', 'Azure'],
        rate: 90,
        status: 'placed',
        location: 'Seattle, WA',
        experience: 12,
        lastUpdated: '2024-01-11',
        matchScore: 68,
        aiSummary: 'Principal DevOps Engineer with extensive experience in cloud infrastructure.'
      },
      matchScore: 68,
      matchingSkills: ['AWS'],
      missingSkills: ['Java', 'Spring Boot', 'Kafka']
    }
  ],
  '2': [ // React Frontend Engineer
    {
      consultant: {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+1 (555) 234-5678',
        visaStatus: 'OPT',
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'MongoDB'],
        rate: 65,
        status: 'bench',
        location: 'Austin, TX',
        experience: 5,
        lastUpdated: '2024-01-14',
        matchScore: 95,
        aiSummary: 'Full-stack developer specializing in modern JavaScript frameworks.'
      },
      matchScore: 95,
      matchingSkills: ['React', 'TypeScript', 'GraphQL'],
      missingSkills: ['Tailwind CSS']
    }
  ],
  '3': [ // ML Engineer - NLP
    {
      consultant: {
        id: '3',
        name: 'Amit Patel',
        email: 'amit.patel@email.com',
        phone: '+1 (555) 345-6789',
        visaStatus: 'GC',
        skills: ['Python', 'Django', 'Machine Learning', 'TensorFlow', 'AWS'],
        rate: 85,
        status: 'marketing',
        location: 'San Francisco, CA',
        experience: 10,
        lastUpdated: '2024-01-13',
        matchScore: 88,
        aiSummary: 'Senior ML Engineer with expertise in building production-grade ML systems.'
      },
      matchScore: 88,
      matchingSkills: ['Python', 'TensorFlow', 'AWS'],
      missingSkills: ['NLP', 'Transformers', 'AWS SageMaker']
    }
  ],
  '4': [ // Salesforce Architect
    {
      consultant: {
        id: '4',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@email.com',
        phone: '+1 (555) 456-7890',
        visaStatus: 'H1B',
        skills: ['Salesforce', 'Apex', 'Lightning', 'Integration', 'CPQ'],
        rate: 80,
        status: 'interview',
        location: 'Chicago, IL',
        experience: 7,
        lastUpdated: '2024-01-12',
        matchScore: 85,
        aiSummary: 'Certified Salesforce Architect with deep expertise in enterprise CRM.'
      },
      matchScore: 85,
      matchingSkills: ['Salesforce', 'Apex', 'Integration'],
      missingSkills: ['Health Cloud', 'LWC']
    }
  ],
  '5': [ // DevOps Lead - Azure
    {
      consultant: {
        id: '5',
        name: 'Vikram Singh',
        email: 'vikram.singh@email.com',
        phone: '+1 (555) 567-8901',
        visaStatus: 'USC',
        skills: ['DevOps', 'Terraform', 'Ansible', 'Docker', 'Kubernetes', 'Azure'],
        rate: 90,
        status: 'placed',
        location: 'Seattle, WA',
        experience: 12,
        lastUpdated: '2024-01-11',
        matchScore: 91,
        aiSummary: 'Principal DevOps Engineer with extensive experience in cloud infrastructure.'
      },
      matchScore: 91,
      matchingSkills: ['Azure', 'Terraform', 'Kubernetes', 'Python'],
      missingSkills: ['CI/CD']
    },
    {
      consultant: {
        id: '3',
        name: 'Amit Patel',
        email: 'amit.patel@email.com',
        phone: '+1 (555) 345-6789',
        visaStatus: 'GC',
        skills: ['Python', 'Django', 'Machine Learning', 'TensorFlow', 'AWS'],
        rate: 85,
        status: 'marketing',
        location: 'San Francisco, CA',
        experience: 10,
        lastUpdated: '2024-01-13',
        matchScore: 62,
        aiSummary: 'Senior ML Engineer with expertise in building production-grade ML systems.'
      },
      matchScore: 62,
      matchingSkills: ['Python'],
      missingSkills: ['Azure', 'Terraform', 'Kubernetes', 'CI/CD']
    }
  ]
};

export const mockOriginalResume = `RAJESH KUMAR
Senior Software Developer
Dallas, TX | rajesh.kumar@email.com | +1 (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software developer with 8+ years of expertise in building enterprise-grade applications using Java and related technologies. Proven track record of delivering scalable solutions.

TECHNICAL SKILLS
• Languages: Java, Python, JavaScript
• Frameworks: Spring Boot, Spring MVC, Hibernate
• Cloud: AWS (EC2, S3, Lambda), Docker
• Databases: MySQL, PostgreSQL, MongoDB
• Tools: Git, Jenkins, Maven, Gradle

PROFESSIONAL EXPERIENCE

Senior Software Developer | ABC Tech Solutions | 2020 - Present
• Developed and maintained microservices using Spring Boot
• Implemented REST APIs serving 1M+ daily requests
• Collaborated with cross-functional teams on agile projects

Software Developer | XYZ Corporation | 2016 - 2020
• Built Java-based web applications using Spring framework
• Designed and optimized database schemas for performance
• Mentored junior developers on best practices

EDUCATION
B.Tech in Computer Science | ABC University | 2016

CERTIFICATIONS
• AWS Certified Solutions Architect
• Oracle Certified Java Professional`;

export const mockTailoredResume = `RAJESH KUMAR
**Senior Java Developer - Banking & Financial Services**
Dallas, TX | rajesh.kumar@email.com | +1 (555) 123-4567

PROFESSIONAL SUMMARY
**Senior Java Developer with 8+ years of expertise in building enterprise-grade banking applications** using Java, Spring Boot, and Microservices architecture. **Proven track record of delivering highly scalable, fault-tolerant financial systems on AWS**. Strong experience with **Kafka-based event streaming** for real-time transaction processing.

TECHNICAL SKILLS
• Languages: **Java (Expert)**, Python, JavaScript
• Frameworks: **Spring Boot (Expert)**, Spring MVC, Hibernate, **Spring Cloud**
• **Microservices**: Service mesh, API Gateway, Circuit breakers
• Cloud: **AWS (EC2, ECS, S3, Lambda, RDS)**, Docker, **Kubernetes**
• **Messaging**: Apache Kafka, RabbitMQ, AWS SQS
• Databases: MySQL, PostgreSQL, MongoDB, **Redis**
• Tools: Git, Jenkins, Maven, Gradle, **Terraform**

PROFESSIONAL EXPERIENCE

Senior Software Developer | ABC Tech Solutions | 2020 - Present
• **Architected and developed core banking microservices** using Spring Boot, **processing 5M+ daily transactions**
• **Implemented Kafka-based event streaming** for real-time payment processing
• **Deployed containerized applications on AWS ECS/EKS** with auto-scaling
• Implemented REST APIs serving 1M+ daily requests **with 99.99% uptime**
• **Led migration of monolithic banking system to microservices architecture**

Software Developer | XYZ Corporation | 2016 - 2020
• Built Java-based **financial web applications** using Spring framework
• **Optimized database queries reducing response time by 40%**
• Designed and optimized database schemas for **high-throughput financial data**
• Mentored junior developers on **banking domain best practices**

EDUCATION
B.Tech in Computer Science | ABC University | 2016

CERTIFICATIONS
• **AWS Certified Solutions Architect - Associate**
• Oracle Certified Java Professional
• **Spring Professional Certification**

**KEY ACHIEVEMENTS**
• **Reduced transaction processing time by 60%** through Kafka optimization
• **Zero critical production incidents** in last 2 years
• **Contributed to $2M cost savings** through cloud optimization`;
