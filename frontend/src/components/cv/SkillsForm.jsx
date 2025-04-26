import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  IconButton,
  Chip,
  MenuItem,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  FormHelperText,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { setCurrentCV } from '../../store/slices/cvSlice';
import { nextStep, prevStep, showNotification } from '../../store/slices/uiSlice';

// Skill level options
const skillLevels = [
  { value: 'Novice', label: 'Novice' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' },
];

// Language level options
const languageLevels = [
  { value: 'Elementary', label: 'Elementary' },
  { value: 'Limited Working', label: 'Limited Working' },
  { value: 'Professional Working', label: 'Professional Working' },
  { value: 'Full Professional', label: 'Full Professional' },
  { value: 'Native/Bilingual', label: 'Native/Bilingual' },
];

// Common skill suggestions
const skillSuggestions = [
  // Technical Skills
  'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js',
  'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Material UI', 'Tailwind CSS',
  'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
  'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Redis', 'GraphQL',
  'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Heroku',
  'REST API', 'Microservices', 'CI/CD', 'TDD', 'Agile', 'Scrum', 'Kanban',
  
  // Soft Skills
  'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking',
  'Time Management', 'Project Management', 'Creativity', 'Adaptability', 'Attention to Detail',
  'Negotiation', 'Conflict Resolution', 'Strategic Planning', 'Analytical Skills',
  
  // Business Skills
  'Marketing', 'Sales', 'Customer Service', 'Business Strategy', 'Data Analysis',
  'Product Management', 'UX/UI Design', 'Content Writing', 'SEO', 'Social Media',
];

// Common language suggestions
const languageSuggestions = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean',
  'Russian', 'Arabic', 'Portuguese', 'Italian', 'Dutch', 'Swedish', 'Hindi',
  'Bengali', 'Turkish', 'Vietnamese', 'Polish', 'Ukrainian', 'Greek',
];

const SkillsForm = () => {
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  
  // State for skills
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  
  // State for dialog
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  
  // Form states
  const [skillFormData, setSkillFormData] = useState({
    name: '',
    level: '',
  });
  
  const [languageFormData, setLanguageFormData] = useState({
    name: '',
    level: '',
  });
  
  // Form validation errors
  const [skillErrors, setSkillErrors] = useState({});
  const [languageErrors, setLanguageErrors] = useState({});
  
  // Load existing skills and languages on component mount
  useEffect(() => {
    if (currentCV?.skills) {
      setSkills(currentCV.skills);
    }
    if (currentCV?.languages) {
      setLanguages(currentCV.languages);
    }
  }, [currentCV]);
  
  // Handle skill form input changes
  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setSkillFormData({
      ...skillFormData,
      [name]: value,
    });
    
    // Clear error when field is updated
    if (skillErrors[name]) {
      setSkillErrors({
        ...skillErrors,
        [name]: '',
      });
    }
  };
  
  // Handle language form input changes
  const handleLanguageChange = (e) => {
    const { name, value } = e.target;
    setLanguageFormData({
      ...languageFormData,
      [name]: value,
    });
    
    // Clear error when field is updated
    if (languageErrors[name]) {
      setLanguageErrors({
        ...languageErrors,
        [name]: '',
      });
    }
  };
  
  // Validate skill form
  const validateSkillForm = () => {
    const newErrors = {};
    
    if (!skillFormData.name.trim()) {
      newErrors.name = 'Skill name is required';
    }
    
    if (!skillFormData.level) {
      newErrors.level = 'Skill level is required';
    }
    
    setSkillErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate language form
  const validateLanguageForm = () => {
    const newErrors = {};
    
    if (!languageFormData.name.trim()) {
      newErrors.name = 'Language name is required';
    }
    
    if (!languageFormData.level) {
      newErrors.level = 'Proficiency level is required';
    }
    
    setLanguageErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle skill dialog open
  const handleOpenSkillDialog = (skill, index) => {
    if (skill) {
      setEditIndex(index);
      setSkillFormData({
        name: skill.name,
        level: skill.level,
      });
    } else {
      setEditIndex(-1);
      setSkillFormData({
        name: '',
        level: '',
      });
    }
    setSkillDialogOpen(true);
  };
  
  // Handle language dialog open
  const handleOpenLanguageDialog = (language, index) => {
    if (language) {
      setEditIndex(index);
      setLanguageFormData({
        name: language.name,
        level: language.level,
      });
    } else {
      setEditIndex(-1);
      setLanguageFormData({
        name: '',
        level: '',
      });
    }
    setLanguageDialogOpen(true);
  };
  
  // Handle dialog close
  const handleCloseSkillDialog = () => {
    setSkillDialogOpen(false);
    setSkillErrors({});
  };
  
  const handleCloseLanguageDialog = () => {
    setLanguageDialogOpen(false);
    setLanguageErrors({});
  };
  
  // Handle save skill
  const handleSaveSkill = () => {
    if (!validateSkillForm()) {
      return;
    }
    
    const newSkill = {
      name: skillFormData.name.trim(),
      level: skillFormData.level,
    };
    
    let updatedSkills;
    
    if (editIndex >= 0) {
      // Edit existing skill
      updatedSkills = [
        ...skills.slice(0, editIndex),
        newSkill,
        ...skills.slice(editIndex + 1),
      ];
    } else {
      // Add new skill
      updatedSkills = [...skills, newSkill];
    }
    
    setSkills(updatedSkills);
    handleCloseSkillDialog();
    
    // Show success notification
    dispatch(showNotification({
      message: editIndex >= 0 ? 'Skill updated successfully' : 'Skill added successfully',
      type: 'success',
    }));
  };
  
  // Handle save language
  const handleSaveLanguage = () => {
    if (!validateLanguageForm()) {
      return;
    }
    
    const newLanguage = {
      name: languageFormData.name.trim(),
      level: languageFormData.level,
    };
    
    let updatedLanguages;
    
    if (editIndex >= 0) {
      // Edit existing language
      updatedLanguages = [
        ...languages.slice(0, editIndex),
        newLanguage,
        ...languages.slice(editIndex + 1),
      ];
    } else {
      // Add new language
      updatedLanguages = [...languages, newLanguage];
    }
    
    setLanguages(updatedLanguages);
    handleCloseLanguageDialog();
    
    // Show success notification
    dispatch(showNotification({
      message: editIndex >= 0 ? 'Language updated successfully' : 'Language added successfully',
      type: 'success',
    }));
  };
  
  // Handle delete skill
  const handleDeleteSkill = (index) => {
    const updatedSkills = [
      ...skills.slice(0, index),
      ...skills.slice(index + 1),
    ];
    setSkills(updatedSkills);
    
    // Show success notification
    dispatch(showNotification({
      message: 'Skill removed',
      type: 'success',
    }));
  };
  
  // Handle delete language
  const handleDeleteLanguage = (index) => {
    const updatedLanguages = [
      ...languages.slice(0, index),
      ...languages.slice(index + 1),
    ];
    setLanguages(updatedLanguages);
    
    // Show success notification
    dispatch(showNotification({
      message: 'Language removed',
      type: 'success',
    }));
  };
  
  // Handle next step
  const handleNext = () => {
    // Save skills and languages to CV
    dispatch(
      setCurrentCV({
        ...currentCV,
        skills,
        languages,
      })
    );
    
    // Move to next step
    dispatch(nextStep());
  };
  
  // Handle previous step
  const handleBack = () => {
    // Save skills and languages to CV
    dispatch(
      setCurrentCV({
        ...currentCV,
        skills,
        languages,
      })
    );
    
    // Move to previous step
    dispatch(prevStep());
  };
  
  // Get background color for skill chip based on level
  const getSkillChipColor = (level) => {
    switch (level) {
      case 'Novice':
        return '#e0f2f1';
      case 'Beginner':
        return '#b2dfdb';
      case 'Intermediate':
        return '#80cbc4';
      case 'Advanced':
        return '#4db6ac';
      case 'Expert':
        return '#26a69a';
      default:
        return '#e0e0e0';
    }
  };
  
  // Get background color for language chip based on level
  const getLanguageChipColor = (level) => {
    switch (level) {
      case 'Elementary':
        return '#fff3e0';
      case 'Limited Working':
        return '#ffe0b2';
      case 'Professional Working':
        return '#ffcc80';
      case 'Full Professional':
        return '#ffb74d';
      case 'Native/Bilingual':
        return '#ffa726';
      default:
        return '#e0e0e0';
    }
  };
  
  return (
    <Box>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ mr: 1 }}>
            Skills & Languages
          </Typography>
          <Tooltip title="List your technical and soft skills. Be specific and honest about your proficiency levels.">
            <IconButton size="small">
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          Add your technical and professional skills, as well as language proficiencies.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {/* Skills Section */}
          <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardHeader
                title="Skills"
                action={
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenSkillDialog()}
                    size="small"
                  >
                    Add Skill
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                {skills.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                    No skills added yet. Click "Add Skill" to begin.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={`${skill.name} (${skill.level})`}
                        sx={{
                          bgcolor: getSkillChipColor(skill.level),
                          '& .MuiChip-deleteIcon': {
                            color: 'rgba(0, 0, 0, 0.5)',
                          },
                        }}
                        onClick={() => handleOpenSkillDialog(skill, index)}
                        onDelete={() => handleDeleteSkill(index)}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Languages Section */}
          <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardHeader
                title="Languages"
                action={
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenLanguageDialog()}
                    size="small"
                  >
                    Add Language
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                {languages.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                    No languages added yet. Click "Add Language" to begin.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {languages.map((language, index) => (
                      <Chip
                        key={index}
                        label={`${language.name} (${language.level})`}
                        sx={{
                          bgcolor: getLanguageChipColor(language.level),
                          '& .MuiChip-deleteIcon': {
                            color: 'rgba(0, 0, 0, 0.5)',
                          },
                        }}
                        onClick={() => handleOpenLanguageDialog(language, index)}
                        onDelete={() => handleDeleteLanguage(index)}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Skill Dialog */}
      <Dialog open={skillDialogOpen} onClose={handleCloseSkillDialog}>
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Skill' : 'Add Skill'}
        </DialogTitle>
        <DialogContent sx={{ width: '400px', maxWidth: '100%' }}>
          <Box sx={{ mt: 1 }}>
            <Autocomplete
              freeSolo
              options={skillSuggestions}
              value={skillFormData.name}
              onChange={(event, newValue) => {
                setSkillFormData({
                  ...skillFormData,
                  name: newValue || '',
                });
                if (skillErrors.name) {
                  setSkillErrors({
                    ...skillErrors,
                    name: '',
                  });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skill Name"
                  name="name"
                  required
                  fullWidth
                  margin="normal"
                  error={!!skillErrors.name}
                  helperText={skillErrors.name}
                  placeholder="e.g., JavaScript"
                  onChange={(e) => handleSkillChange(e)}
                />
              )}
            />
            
            <FormControl 
              fullWidth 
              margin="normal" 
              required
              error={!!skillErrors.level}
            >
              <InputLabel>Proficiency Level</InputLabel>
              <Select
                name="level"
                value={skillFormData.level}
                label="Proficiency Level"
                onChange={handleSkillChange}
              >
                {skillLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
              {skillErrors.level && (
                <FormHelperText>{skillErrors.level}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSkillDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveSkill}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Language Dialog */}
      <Dialog open={languageDialogOpen} onClose={handleCloseLanguageDialog}>
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Language' : 'Add Language'}
        </DialogTitle>
        <DialogContent sx={{ width: '400px', maxWidth: '100%' }}>
          <Box sx={{ mt: 1 }}>
            <Autocomplete
              freeSolo
              options={languageSuggestions}
              value={languageFormData.name}
              onChange={(event, newValue) => {
                setLanguageFormData({
                  ...languageFormData,
                  name: newValue || '',
                });
                if (languageErrors.name) {
                  setLanguageErrors({
                    ...languageErrors,
                    name: '',
                  });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Language Name"
                  name="name"
                  required
                  fullWidth
                  margin="normal"
                  error={!!languageErrors.name}
                  helperText={languageErrors.name}
                  placeholder="e.g., English"
                  onChange={(e) => handleLanguageChange(e)}
                />
              )}
            />
            
            <FormControl 
              fullWidth 
              margin="normal" 
              required
              error={!!languageErrors.level}
            >
              <InputLabel>Proficiency Level</InputLabel>
              <Select
                name="level"
                value={languageFormData.level}
                label="Proficiency Level"
                onChange={handleLanguageChange}
              >
                {languageLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
              {languageErrors.level && (
                <FormHelperText>{languageErrors.level}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLanguageDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveLanguage}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          size="large"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleNext}
        >
          Save & Continue
        </Button>
      </Box>
    </Box>
  );
};

export default SkillsForm;