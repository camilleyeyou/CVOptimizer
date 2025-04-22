import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Chip,
  Paper,
} from '@mui/material';

const ClassicTemplate = ({ cv }) => {
  if (!cv) return null;
  
  return (
    <Box sx={{ p: 3, fontFamily: '"Georgia", serif' }}>
      {/* Header */}
      <Box sx={{ mb: 4, pb: 2, borderBottom: '2px solid #000' }}>
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 1, textAlign: 'center', textTransform: 'uppercase' }}>
          {cv.personalInfo.fullName}
        </Typography>
        {cv.personalInfo.jobTitle && (
          <Typography variant="h6" sx={{ textAlign: 'center', fontStyle: 'italic', mb: 2 }}>
            {cv.personalInfo.jobTitle}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3, mt: 2 }}>
          {cv.personalInfo.email && (
            <Typography variant="body2">
              Email: {cv.personalInfo.email}
            </Typography>
          )}
          {cv.personalInfo.phone && (
            <Typography variant="body2">
              Phone: {cv.personalInfo.phone}
            </Typography>
          )}
          {cv.personalInfo.location && (
            <Typography variant="body2">
              Location: {cv.personalInfo.location}
            </Typography>
          )}
          {cv.personalInfo.website && (
            <Typography variant="body2">
              Website: {cv.personalInfo.website}
            </Typography>
          )}
          {cv.personalInfo.linkedin && (
            <Typography variant="body2">
              LinkedIn: {cv.personalInfo.linkedin}
            </Typography>
          )}
        </Box>
      </Box>
      
      {/* Summary */}
      {cv.summary && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, borderBottom: '1px solid #ccc', pb: 1 }}>
            Professional Summary
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>{cv.summary}</Typography>
        </Box>
      )}
      
      {/* Work Experience */}
      {cv.workExperience && cv.workExperience.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
            Professional Experience
          </Typography>
          
          {cv.workExperience.map((job, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {job.company}
                </Typography>
                <Typography variant="body2">
                  {new Date(job.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} - 
                  {job.current 
                    ? ' Present' 
                    : job.endDate 
                      ? ` ${new Date(job.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}` 
                      : ''}
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" sx={{ fontWeight: 500, fontStyle: 'italic', mb: 1 }}>
                {job.position}{job.location ? ` | ${job.location}` : ''}
              </Typography>
              
              {job.description && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {job.description}
                </Typography>
              )}
              
              {job.achievements && job.achievements.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mt: 1 }}>Key Achievements:</Typography>
                  <ul style={{ marginTop: '8px' }}>
                    {job.achievements.map((achievement, i) => (
                      <li key={i}>
                        <Typography variant="body2">{achievement}</Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              
              {index !== cv.workExperience.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Box>
      )}
      
      {/* Education */}
      {cv.education && cv.education.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
            Education
          </Typography>
          
          {cv.education.map((edu, index) => (
            <Box key={index} sx={{ mb: index !== cv.education.length - 1 ? 3 : 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {edu.institution}
                </Typography>
                <Typography variant="body2">
                  {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} - 
                  {edu.current 
                    ? ' Present' 
                    : edu.endDate 
                      ? ` ${new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}` 
                      : ''}
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" sx={{ fontWeight: 500, fontStyle: 'italic', mb: 1 }}>
                {edu.degree}{edu.field ? `, ${edu.field}` : ''}{edu.location ? ` | ${edu.location}` : ''}
              </Typography>
              
              {edu.description && (
                <Typography variant="body2">
                  {edu.description}
                </Typography>
              )}
              
              {index !== cv.education.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Box>
      )}
      
      {/* Skills */}
      {cv.skills && cv.skills.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
            Skills
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {cv.skills.map((skill, index) => (
              <Paper 
                key={index} 
                elevation={0}
                sx={{ 
                  px: 1.5, 
                  py: 0.75, 
                  m: 0.5, 
                  bgcolor: 'background.default',
                  border: '1px solid #ccc',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2">{skill.name}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
      
      {/* Languages */}
      {cv.languages && cv.languages.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
            Languages
          </Typography>
          
          <Grid container spacing={2}>
            {cv.languages.map((language, index) => (
              <Grid item xs={6} sm={4} key={index}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {language.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {language.proficiency}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ClassicTemplate;