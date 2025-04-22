import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Collapse,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Language as LanguageIcon,
  EmojiEvents as CertificationIcon,
  Code as ProjectIcon,
  ContactMail as ReferenceIcon,
  LibraryBooks as CustomSectionIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

import { updateField } from '../../store/slices/cvSlice';

const AdditionalSectionsForm = () => {
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  const { user } = useSelector((state) => state.auth);
  
  const [expandedSections, setExpandedSections] = useState({
    languages: true,
    projects: false,
    certifications: false,
    references: false,
    customSections: false,
  });
  
  const isPremiumUser = user?.subscription === 'premium';
  
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };
  
  // Check if premium sections are available
  const hasPremiumAccess = (section) => {
    const freeSections = ['languages'];
    return freeSections.includes(section) || isPremiumUser;
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Additional Sections
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Enhance your CV with additional sections that showcase your qualifications and achievements.
        {!isPremiumUser && (
          <> Some sections require a Premium subscription.</>
        )}
      </Typography>
      
      <Stack spacing={2} sx={{ mt: 3 }}>
        {/* Languages Section */}
        <Paper variant="outlined">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              cursor: 'pointer',
            }}
            onClick={() => toggleSection('languages')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LanguageIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Languages</Typography>
            </Box>
            <IconButton size="small">
              {expandedSections.languages ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Collapse in={expandedSections.languages}>
            <Divider />
            <CardContent>
              <LanguagesSection />
            </CardContent>
          </Collapse>
        </Paper>
        
        {/* Projects Section */}
        <Paper variant="outlined">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              cursor: 'pointer',
              opacity: hasPremiumAccess('projects') ? 1 : 0.7,
            }}
            onClick={() => hasPremiumAccess('projects') && toggleSection('projects')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ProjectIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Projects</Typography>
              {!hasPremiumAccess('projects') && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <LockIcon fontSize="small" color="action" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    Premium
                  </Typography>
                </Box>
              )}
            </Box>
            {hasPremiumAccess('projects') && (
              <IconButton size="small">
                {expandedSections.projects ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Box>
          
          <Collapse in={expandedSections.projects && hasPremiumAccess('projects')}>
            <Divider />
            <CardContent>
              <ProjectsSection />
            </CardContent>
          </Collapse>
        </Paper>
        
        {/* Certifications Section */}
        <Paper variant="outlined">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              cursor: 'pointer',
              opacity: hasPremiumAccess('certifications') ? 1 : 0.7,
            }}
            onClick={() => hasPremiumAccess('certifications') && toggleSection('certifications')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CertificationIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Certifications</Typography>
              {!hasPremiumAccess('certifications') && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <LockIcon fontSize="small" color="action" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    Premium
                  </Typography>
                </Box>
              )}
            </Box>
            {hasPremiumAccess('certifications') && (
              <IconButton size="small">
                {expandedSections.certifications ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Box>
          
          <Collapse in={expandedSections.certifications && hasPremiumAccess('certifications')}>
            <Divider />
            <CardContent>
              <CertificationsSection />
            </CardContent>
          </Collapse>
        </Paper>
        
        {/* References Section */}
        <Paper variant="outlined">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              cursor: 'pointer',
              opacity: hasPremiumAccess('references') ? 1 : 0.7,
            }}
            onClick={() => hasPremiumAccess('references') && toggleSection('references')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReferenceIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">References</Typography>
              {!hasPremiumAccess('references') && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <LockIcon fontSize="small" color="action" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    Premium
                  </Typography>
                </Box>
              )}
            </Box>
            {hasPremiumAccess('references') && (
              <IconButton size="small">
                {expandedSections.references ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Box>
          
          <Collapse in={expandedSections.references && hasPremiumAccess('references')}>
            <Divider />
            <CardContent>
              <ReferencesSection />
            </CardContent>
          </Collapse>
        </Paper>
        
        {/* Custom Sections */}
        <Paper variant="outlined">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              cursor: 'pointer',
              opacity: hasPremiumAccess('customSections') ? 1 : 0.7,
            }}
            onClick={() => hasPremiumAccess('customSections') && toggleSection('customSections')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomSectionIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Custom Sections</Typography>
              {!hasPremiumAccess('customSections') && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <LockIcon fontSize="small" color="action" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    Premium
                  </Typography>
                </Box>
              )}
            </Box>
            {hasPremiumAccess('customSections') && (
              <IconButton size="small">
                {expandedSections.customSections ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Box>
          
          <Collapse in={expandedSections.customSections && hasPremiumAccess('customSections')}>
            <Divider />
            <CardContent>
              <CustomSectionsComponent />
            </CardContent>
          </Collapse>
        </Paper>
      </Stack>
      
      {!isPremiumUser && (
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="subtitle2">
            Unlock all sections with a Premium subscription
          </Typography>
          <Typography variant="body2">
            Premium members can add unlimited projects, certifications, references, and create custom sections to make their CV stand out.
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            color="primary" 
            sx={{ mt: 1 }}
            onClick={() => {/* Navigate to subscription page */}}
          >
            Upgrade to Premium
          </Button>
        </Alert>
      )}
    </Box>
  );
};

// Languages Section Component
const LanguagesSection = () => {
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [formData, setFormData] = useState({
    name: '',
    proficiency: 'Intermediate',
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  const languages = currentCV?.languages || [];
  
  const proficiencyLevels = [
    'Native',
    'Fluent',
    'Advanced',
    'Intermediate',
    'Basic',
  ];
  
  const handleOpenDialog = (index = -1) => {
    if (index >= 0) {
      setFormData(languages[index]);
      setEditIndex(index);
    } else {
      setFormData({
        name: '',
        proficiency: 'Intermediate',
      });
      setEditIndex(-1);
    }
    setValidationErrors({});
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: null,
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Language name is required';
    }
    
    // Check for duplicate languages
    if (
      editIndex === -1 && 
      languages.some(lang => lang.name.toLowerCase() === formData.name.toLowerCase())
    ) {
      errors.name = 'This language already exists in your list';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    let updatedLanguages;
    
    if (editIndex >= 0) {
      updatedLanguages = [...languages];
      updatedLanguages[editIndex] = formData;
    } else {
      updatedLanguages = [...languages, formData];
    }
    
    dispatch(updateField({ path: 'languages', value: updatedLanguages }));
    handleClose();
  };
  
  const handleDelete = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    dispatch(updateField({ path: 'languages', value: updatedLanguages }));
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Add languages you speak and your proficiency level.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Language
        </Button>
      </Box>
      
      {languages.length === 0 ? (
        <Paper 
          elevation={0} 
          variant="outlined" 
          sx={{ 
            p: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No languages added yet.
          </Typography>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 1 }}
          >
            Add language
          </Button>
        </Paper>
      ) : (
        <Stack spacing={1}>
          {languages.map((language, index) => (
            <Card key={index} variant="outlined">
              <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1">{language.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {language.proficiency}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog(index)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
      
      {/* Add/Edit Language Dialog */}
      {open && (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editIndex >= 0 ? 'Edit Language' : 'Add Language'}
          </DialogTitle>
          
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Language"
                  required
                  value={formData.name}
                  onChange={handleChange('name')}
                  error={!!validationErrors.name}
                  helperText={validationErrors.name}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="language-proficiency-label">Proficiency</InputLabel>
                  <Select
                    labelId="language-proficiency-label"
                    value={formData.proficiency}
                    label="Proficiency"
                    onChange={handleChange('proficiency')}
                  >
                    {proficiencyLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

// Placeholder components for other sections
const ProjectsSection = () => (
  <Box>
    <Typography variant="body2" color="text.secondary" paragraph>
      Add your relevant projects, personal or professional, to showcase your practical skills.
    </Typography>
    {/* Implementation similar to Languages but with project fields */}
    <Paper 
      elevation={0} 
      variant="outlined" 
      sx={{ 
        p: 3,
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.02)'
      }}
    >
      <Typography variant="body1" color="text.secondary">
        Project management would be fully implemented in a complete application.
      </Typography>
    </Paper>
  </Box>
);

const CertificationsSection = () => (
  <Box>
    <Typography variant="body2" color="text.secondary" paragraph>
      Add professional certifications that demonstrate your expertise and qualifications.
    </Typography>
    {/* Implementation similar to Languages but with certification fields */}
    <Paper 
      elevation={0} 
      variant="outlined" 
      sx={{ 
        p: 3,
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.02)'
      }}
    >
      <Typography variant="body1" color="text.secondary">
        Certification management would be fully implemented in a complete application.
      </Typography>
    </Paper>
  </Box>
);

const ReferencesSection = () => (
  <Box>
    <Typography variant="body2" color="text.secondary" paragraph>
      Add professional references who can vouch for your skills and experience.
    </Typography>
    {/* Implementation similar to Languages but with reference fields */}
    <Paper 
      elevation={0} 
      variant="outlined" 
      sx={{ 
        p: 3,
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.02)'
      }}
    >
      <Typography variant="body1" color="text.secondary">
        Reference management would be fully implemented in a complete application.
      </Typography>
    </Paper>
  </Box>
);

const CustomSectionsComponent = () => (
  <Box>
    <Typography variant="body2" color="text.secondary" paragraph>
      Create custom sections to highlight specific achievements, publications, or other relevant information.
    </Typography>
    {/* Implementation for custom sections */}
    <Paper 
      elevation={0} 
      variant="outlined" 
      sx={{ 
        p: 3,
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.02)'
      }}
    >
      <Typography variant="body1" color="text.secondary">
        Custom section management would be fully implemented in a complete application.
      </Typography>
    </Paper>
  </Box>
);

// Missing components that would be defined in a complete implementation
const Dialog = ({ open, onClose, maxWidth, fullWidth, children }) => (
  <Box sx={{ display: open ? 'block' : 'none' }}>
    {children}
  </Box>
);

const DialogTitle = ({ children }) => (
  <Typography variant="h6" sx={{ p: 2 }}>{children}</Typography>
);

const DialogContent = ({ children }) => (
  <Box sx={{ p: 2 }}>{children}</Box>
);

const DialogActions = ({ children }) => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
    {children}
  </Box>
);

export default AdditionalSectionsForm;