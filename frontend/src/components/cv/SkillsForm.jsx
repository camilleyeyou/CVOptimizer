import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AutoAwesome as AutoAwesomeIcon,
  Code as CodeIcon,
  Laptop as LaptopIcon,
  Language as LanguageIcon,
  Psychology as PsychologyIcon,
  Handyman as HandymanIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';

import { updateField } from '../../store/slices/cvSlice';

// Skill categories with icons
const skillCategories = [
  { value: 'technical', label: 'Technical', icon: <CodeIcon /> },
  { value: 'software', label: 'Software', icon: <LaptopIcon /> },
  { value: 'language', label: 'Language', icon: <LanguageIcon /> },
  { value: 'soft', label: 'Soft Skills', icon: <PsychologyIcon /> },
  { value: 'other', label: 'Other', icon: <HandymanIcon /> },
];

const SkillsForm = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  const { user } = useSelector((state) => state.auth);
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: 3,
    category: 'technical',
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [validationErrors, setValidationErrors] = useState({});
  const [filterCategory, setFilterCategory] = useState('all');
  
  const skills = currentCV?.skills || [];
  const isPremiumUser = user?.subscription === 'premium';
  
  // Get recommended skills based on job description (mock function)
  const [suggestedSkills, setSuggestedSkills] = useState([
    { name: 'React.js', category: 'technical' },
    { name: 'Node.js', category: 'technical' },
    { name: 'MongoDB', category: 'technical' },
    { name: 'RESTful APIs', category: 'technical' },
    { name: 'User Interface Design', category: 'software' },
    { name: 'Team Leadership', category: 'soft' },
  ]);
  
  const handleOpenDialog = (index = -1) => {
    if (index >= 0) {
      setFormData(skills[index]);
      setEditIndex(index);
    } else {
      setFormData({
        name: '',
        level: 3,
        category: 'technical',
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
  
  const handleLevelChange = (_, newValue) => {
    setFormData({
      ...formData,
      level: newValue,
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Skill name is required';
    }
    
    // Check for duplicate skill names
    if (
      editIndex === -1 && 
      skills.some(skill => skill.name.toLowerCase() === formData.name.toLowerCase())
    ) {
      errors.name = 'This skill already exists in your list';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    let updatedSkills;
    
    if (editIndex >= 0) {
      updatedSkills = [...skills];
      updatedSkills[editIndex] = formData;
    } else {
      updatedSkills = [...skills, formData];
    }
    
    dispatch(updateField({ path: 'skills', value: updatedSkills }));
    handleClose();
  };
  
  const handleDelete = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    dispatch(updateField({ path: 'skills', value: updatedSkills }));
  };
  
  const handleAddSuggested = (skill) => {
    // Check if skill already exists
    const exists = skills.some(
      s => s.name.toLowerCase() === skill.name.toLowerCase()
    );
    
    if (!exists) {
      const newSkill = {
        name: skill.name,
        level: 3,
        category: skill.category,
      };
      
      dispatch(updateField({ path: 'skills', value: [...skills, newSkill] }));
      
      // Remove from suggested list
      setSuggestedSkills(
        suggestedSkills.filter(s => s.name !== skill.name)
      );
    }
  };
  
  const getCategoryIcon = (categoryValue) => {
    const category = skillCategories.find(cat => cat.value === categoryValue);
    return category ? category.icon : <HandymanIcon />;
  };
  
  const getCategoryLabel = (categoryValue) => {
    const category = skillCategories.find(cat => cat.value === categoryValue);
    return category ? category.label : 'Other';
  };
  
  const getFilteredSkills = () => {
    if (filterCategory === 'all') {
      return skills;
    }
    return skills.filter(skill => skill.category === filterCategory);
  };
  
  const filteredSkills = getFilteredSkills();
  
  const skillLevelLabels = {
    1: 'Beginner',
    2: 'Basic',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert',
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Skills
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Skill
        </Button>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Add your technical, professional, and soft skills. Rate your proficiency level for each skill.
      </Typography>
      
      {/* Filters and view toggles */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="category-filter-label">Filter by</InputLabel>
          <Select
            labelId="category-filter-label"
            value={filterCategory}
            label="Filter by"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {skillCategories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 1 }}>{category.icon}</Box>
                  {category.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box>
          <Tooltip title="Grid View">
            <IconButton 
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
            >
              <ViewModuleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="List View">
            <IconButton 
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
            >
              <ViewListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Skills Display */}
      {skills.length === 0 ? (
        <Paper 
          elevation={0} 
          variant="outlined" 
          sx={{ 
            p: 3, 
            mt: 2, 
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No skills added yet.
          </Typography>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 1 }}
          >
            Add your first skill
          </Button>
        </Paper>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {filteredSkills.map((skill, index) => {
            const realIndex = skills.findIndex(s => s.name === skill.name);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1, color: 'primary.main' }}>
                          {getCategoryIcon(skill.category)}
                        </Box>
                        <Typography variant="subtitle1" noWrap sx={{ maxWidth: '150px' }}>
                          {skill.name}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton size="small" onClick={() => handleOpenDialog(realIndex)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(realIndex)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Chip 
                      size="small" 
                      label={getCategoryLabel(skill.category)} 
                      sx={{ mt: 1, mb: 1 }}
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Rating
                        name={`skill-rating-${index}`}
                        value={skill.level}
                        readOnly
                        size="small"
                      />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {skillLevelLabels[skill.level]}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Paper variant="outlined" sx={{ mt: 1 }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <Box component="thead" sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
              <Box component="tr">
                <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Skill</Box>
                <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Category</Box>
                <Box component="th" sx={{ p: 2, textAlign: 'left' }}>Level</Box>
                <Box component="th" sx={{ p: 2, textAlign: 'right' }}>Actions</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {filteredSkills.map((skill, index) => {
                const realIndex = skills.findIndex(s => s.name === skill.name);
                return (
                  <Box 
                    component="tr" 
                    key={index} 
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: alpha(theme.palette.action.hover, 0.05) },
                      '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.1) }
                    }}
                  >
                    <Box component="td" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1, color: 'primary.main' }}>
                          {getCategoryIcon(skill.category)}
                        </Box>
                        {skill.name}
                      </Box>
                    </Box>
                    <Box component="td" sx={{ p: 2 }}>
                      {getCategoryLabel(skill.category)}
                    </Box>
                    <Box component="td" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating
                          name={`skill-rating-list-${index}`}
                          value={skill.level}
                          readOnly
                          size="small"
                        />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          {skillLevelLabels[skill.level]}
                        </Typography>
                      </Box>
                    </Box>
                    <Box component="td" sx={{ p: 2, textAlign: 'right' }}>
                      <IconButton size="small" onClick={() => handleOpenDialog(realIndex)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(realIndex)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Paper>
      )}
      
      {/* Suggested Skills Section (Premium Feature) */}
      {isPremiumUser && suggestedSkills.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoAwesomeIcon color="secondary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Recommended Skills
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Based on job market trends and your profile, we recommend adding these skills to your CV.
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap gap={1}>
              {suggestedSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill.name}
                  onClick={() => handleAddSuggested(skill)}
                  color="primary"
                  variant="outlined"
                  clickable
                  icon={getCategoryIcon(skill.category)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
          </Paper>
        </Box>
      )}
      
      {/* Add/Edit Skill Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Skill' : 'Add Skill'}
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skill Name"
                required
                value={formData.name}
                onChange={handleChange('name')}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="skill-category-label">Category</InputLabel>
                <Select
                  labelId="skill-category-label"
                  value={formData.category}
                  label="Category"
                  onChange={handleChange('category')}
                >
                  {skillCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}>{category.icon}</Box>
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography component="legend">Proficiency Level</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  name="skill-level"
                  value={formData.level}
                  onChange={handleLevelChange}
                />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {skillLevelLabels[formData.level]}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkillsForm;