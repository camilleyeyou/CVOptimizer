import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';

const ClassicTemplate = ({ cv }) => {
  // Define fallback data for preview or empty CV
  const defaultData = {
    personalInfo: {
      name: 'John Doe',
      title: 'Senior Software Developer',
      email: 'johndoe@example.com',
      phone: '+1 (555) 123-4567',
      address: 'New York, NY',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.com',
    },
    summary: 'Experienced software developer with 8+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating efficient, scalable solutions and mentoring junior developers.',
    workExperience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Software Developer',
        startDate: '2021-01',
        endDate: null, // Current job
        location: 'New York, NY',
        description: 'Lead developer for enterprise client solutions. Architected and implemented a microservices platform that reduced system downtime by 35%.',
      },
      {
        company: 'Web Innovations',
        position: 'Software Developer',
        startDate: '2018-03',
        endDate: '2020-12',
        location: 'Boston, MA',
        description: 'Developed and maintained multiple client web applications using React and Node.js. Improved application performance by 40% through code refactoring and optimization.',
      },
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science in Computer Science',
        startDate: '2014-09',
        endDate: '2018-05',
        location: 'Boston, MA',
        description: 'Graduated with honors. Specialized in software engineering and artificial intelligence.',
      },
    ],
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'Node.js', level: 'Expert' },
      { name: 'JavaScript', level: 'Expert' },
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'Python', level: 'Intermediate' },
      { name: 'AWS', level: 'Advanced' },
      { name: 'Docker', level: 'Advanced' },
      { name: 'CI/CD', level: 'Advanced' },
    ],
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'Spanish', level: 'Intermediate' },
    ],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2022-05' },
      { name: 'Professional Scrum Master I', issuer: 'Scrum.org', date: '2021-03' },
    ],
  };

  // Create a merged data object, using cv values if available, falling back to defaults
  const data = {
    personalInfo: {
      name: cv?.personalInfo?.name || defaultData.personalInfo.name,
      title: cv?.personalInfo?.title || defaultData.personalInfo.title,
      email: cv?.personalInfo?.email || defaultData.personalInfo.email,
      phone: cv?.personalInfo?.phone || defaultData.personalInfo.phone,
      address: cv?.personalInfo?.address || defaultData.personalInfo.address,
      linkedin: cv?.personalInfo?.linkedin || defaultData.personalInfo.linkedin,
      website: cv?.personalInfo?.website || defaultData.personalInfo.website,
    },
    summary: cv?.summary || defaultData.summary,
    workExperience: Array.isArray(cv?.workExperience) && cv.workExperience.length > 0 ? 
      cv.workExperience : defaultData.workExperience,
    education: Array.isArray(cv?.education) && cv.education.length > 0 ? 
      cv.education : defaultData.education,
    skills: Array.isArray(cv?.skills) && cv.skills.length > 0 ? 
      cv.skills : defaultData.skills,
    languages: Array.isArray(cv?.languages) && cv.languages.length > 0 ? 
      cv.languages : defaultData.languages,
    certifications: Array.isArray(cv?.certifications) && cv.certifications.length > 0 ? 
      cv.certifications : defaultData.certifications,
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
    }).format(date);
  };

  return (
    <Box sx={{ fontFamily: '"Times New Roman", serif', color: '#333', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header / Personal Info */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1, textTransform: 'uppercase' }}>
          {data.personalInfo.name}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {data.personalInfo.title}
        </Typography>
        
        <Typography variant="body2">
          {data.personalInfo.address && `${data.personalInfo.address} • `}
          {data.personalInfo.phone && `${data.personalInfo.phone} • `}
          {data.personalInfo.email}
        </Typography>
        {(data.personalInfo.linkedin || data.personalInfo.website) && (
          <Typography variant="body2">
            {data.personalInfo.linkedin && `${data.personalInfo.linkedin} • `}
            {data.personalInfo.website}
          </Typography>
        )}
      </Box>

      {/* Summary */}
      {data.summary && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
            Professional Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">{data.summary}</Typography>
        </Box>
      )}

      {/* Work Experience */}
      {data.workExperience && data.workExperience.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
            Work Experience
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {data.workExperience.map((job, index) => (
            <Box key={index} sx={{ mb: index < data.workExperience.length - 1 ? 3 : 0 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                {job.position}, {job.company}
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                {formatDate(job.startDate)} - {formatDate(job.endDate)}
                {job.location && ` | ${job.location}`}
              </Typography>
              {job.description && (
                <Typography variant="body1">
                  {job.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
            Education
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {data.education.map((edu, index) => (
            <Box key={index} sx={{ mb: index < data.education.length - 1 ? 3 : 0 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                {edu.degree}, {edu.institution}
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                {edu.location && ` | ${edu.location}`}
              </Typography>
              {edu.description && (
                <Typography variant="body1">
                  {edu.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
            Skills
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="body1">
            {data.skills.map(skill => skill.name).join(', ')}
          </Typography>
        </Box>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
            Certifications
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List dense disablePadding>
            {data.certifications.map((cert, index) => (
              <ListItem key={index} disableGutters sx={{ pb: 0 }}>
                <ListItemText
                  primary={<Typography variant="body1">{cert.name}, {cert.issuer} ({formatDate(cert.date)})</Typography>}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
            Languages
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="body1">
            {data.languages.map(lang => `${lang.name} (${lang.level})`).join(', ')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ClassicTemplate;