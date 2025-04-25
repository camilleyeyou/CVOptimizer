import React from 'react';
import { Box, Typography, Divider, Grid, List, ListItem, ListItemText } from '@mui/material';
import { Phone, Email, LocationOn, LinkedIn, Language } from '@mui/icons-material';

const ModernTemplate = ({ cv }) => {
  // Use dummy data if no CV is provided (for preview)
  const data = cv || {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
    }).format(date);
  };

  return (
    <Box sx={{ fontFamily: '"Inter", sans-serif', color: '#333', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header / Personal Info */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          {data.personalInfo.name}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          {data.personalInfo.title}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
          {data.personalInfo.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{data.personalInfo.phone}</Typography>
            </Box>
          )}
          {data.personalInfo.email && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{data.personalInfo.email}</Typography>
            </Box>
          )}
          {data.personalInfo.address && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{data.personalInfo.address}</Typography>
            </Box>
          )}
          {data.personalInfo.linkedin && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LinkedIn fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{data.personalInfo.linkedin}</Typography>
            </Box>
          )}
          {data.personalInfo.website && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Language fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{data.personalInfo.website}</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Summary */}
      {data.summary && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
            Professional Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">{data.summary}</Typography>
        </Box>
      )}

      {/* Work Experience */}
      {data.workExperience && data.workExperience.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
            Work Experience
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {data.workExperience.map((job, index) => (
            <Box key={index} sx={{ mb: index < data.workExperience.length - 1 ? 3 : 0 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {job.position}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {job.company}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(job.startDate)} - {formatDate(job.endDate)}
                  </Typography>
                  {job.location && (
                    <Typography variant="body2" color="text.secondary">
                      {job.location}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              {job.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
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
          <Typography variant="h5" component="h2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
            Education
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {data.education.map((edu, index) => (
            <Box key={index} sx={{ mb: index < data.education.length - 1 ? 3 : 0 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {edu.institution}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Typography>
                  {edu.location && (
                    <Typography variant="body2" color="text.secondary">
                      {edu.location}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              {edu.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
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
          <Typography variant="h5" component="h2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
            Skills
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            {data.skills.map((skill, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1">{skill.name}</Typography>
                  {skill.level && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      ({skill.level})
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
            Certifications
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List dense disablePadding>
            {data.certifications.map((cert, index) => (
              <ListItem key={index} disableGutters>
                <ListItemText
                  primary={cert.name}
                  secondary={`${cert.issuer}${cert.date ? ` • ${formatDate(cert.date)}` : ''}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <Box>
          <Typography variant="h5" component="h2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
            Languages
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            {data.languages.map((language, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1">{language.name}</Typography>
                  {language.level && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      ({language.level})
                    </Typography>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ModernTemplate;