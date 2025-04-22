import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';

const ModernTemplate = ({ cv }) => {
  if (!cv) return null;
  
  return (
    <Box sx={{ p: 3, fontFamily: '"Inter", sans-serif' }}>
      {/* Header */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {cv.personalInfo.fullName}
        </Typography>
        {cv.personalInfo.jobTitle && (
          <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
            {cv.personalInfo.jobTitle}
          </Typography>
        )}
        
        {/* Contact info */}
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
          {cv.personalInfo.email && (
            <Typography variant="body2">
              {cv.personalInfo.email}
            </Typography>
          )}
          {cv.personalInfo.phone && (
            <Typography variant="body2">
              {cv.personalInfo.phone}
            </Typography>
          )}
          {cv.personalInfo.location && (
            <Typography variant="body2">
              {cv.personalInfo.location}
            </Typography>
          )}
        </Box>
        
        {/* Links */}
        {(cv.personalInfo.website || cv.personalInfo.linkedin || cv.personalInfo.github) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            {cv.personalInfo.website && (
              <Typography variant="body2">
                {cv.personalInfo.website}
              </Typography>
            )}
            {cv.personalInfo.linkedin && (
              <Typography variant="body2">
                {cv.personalInfo.linkedin}
              </Typography>
            )}
            {cv.personalInfo.github && (
              <Typography variant="body2">
                {cv.personalInfo.github}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      
      {/* Summary */}
      {cv.summary && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
            PROFESSIONAL SUMMARY
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          <Typography variant="body2">{cv.summary}</Typography>
        </Box>
      )}
      
      {/* Work Experience */}
      {cv.workExperience && cv.workExperience.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
            WORK EXPERIENCE
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          
          {cv.workExperience.map((job, index) => (
            <Box key={index} sx={{ mb: index !== cv.workExperience.length - 1 ? 2 : 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {job.position}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {new Date(job.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                  {job.current 
                    ? ' Present' 
                    : job.endDate 
                      ? ` ${new Date(job.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` 
                      : ''}
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {job.company}{job.location ? `, ${job.location}` : ''}
              </Typography>
              
              {job.description && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {job.description}
                </Typography>
              )}
              
              {job.achievements && job.achievements.length > 0 && (
                <Box component="ul" sx={{ mt: 0.5, pl: 2, mb: 0 }}>
                  {job.achievements.map((achievement, i) => (
                    <Typography component="li" variant="body2" key={i}>
                      {achievement}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
      
      {/* Education */}
      {cv.education && cv.education.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
            EDUCATION
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          
          {cv.education.map((edu, index) => (
            <Box key={index} sx={{ mb: index !== cv.education.length - 1 ? 2 : 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                  {edu.current 
                    ? ' Present' 
                    : edu.endDate 
                      ? ` ${new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` 
                      : ''}
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {edu.institution}{edu.location ? `, ${edu.location}` : ''}
              </Typography>
              
              {edu.description && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {edu.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
      
      {/* Skills */}
      {cv.skills && cv.skills.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
            SKILLS
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {cv.skills.map((skill, index) => (
              <Chip 
                key={index} 
                label={skill.name} 
                variant="outlined" 
                size="small"
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Languages */}
      {cv.languages && cv.languages.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
            LANGUAGES
          </Typography>
          <Divider sx={{ mb: 1.5 }} />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {cv.languages.map((language, index) => (
              <Typography key={index} variant="body2">
                {language.name}: {language.proficiency}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ModernTemplate;