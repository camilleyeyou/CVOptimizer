import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Grid,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { setCurrentCV } from '../../store/slices/cvSlice';
import { prevStep, showNotification } from '../../store/slices/uiSlice';
import { isNotEmpty, isNotFutureDate } from '../../utils/validators';
import { formatMonthYear } from '../../utils/dateFormatter';

const AdditionalSectionsForm = () => {
  const dispatch = useDispatch();
  const { currentCV } = useSelector((state) => state.cv);
  
  // State for certifications, projects, and awards
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [awards, setAwards] = useState([]);
  
  // State for dialogs
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [awardDialogOpen, setAwardDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  
  // Form data for certifications
  const [certFormData, setCertFormData] = useState({
    name: '',
    issuer: '',
    date: '',
    description: '',
    url: '',
  });
  
  // Form data for projects
  const [projectFormData, setProjectFormData] = useState({
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    url: '',
    isOngoing: false,
  });
  
  // Form data for awards
  const [awardFormData, setAwardFormData] = useState({
    name: '',
    issuer: '',
    date: '',
    description: '',
  });
  
  // Form validation errors
  const [certErrors, setCertErrors] = useState({});
  const [projectErrors, setProjectErrors] = useState({});
  const [awardErrors, setAwardErrors] = useState({});
  
  // Load existing data on component mount
  useEffect(() => {
    if (currentCV?.certifications) {
      setCertifications(currentCV.certifications);
    }
    if (currentCV?.projects) {
      setProjects(currentCV.projects);
    }
    if (currentCV?.awards) {
      setAwards(currentCV.awards);
    }
  }, [currentCV]);
  
  // Handle form input changes for certifications
  const handleCertChange = (e) => {
    const { name, value } = e.target;
    setCertFormData({
      ...certFormData,
      [name]: value,
    });
    
    // Clear error when field is updated
    if (certErrors[name]) {
      setCertErrors({
        ...certErrors,
        [name]: '',
      });
    }
  };
  
  // Handle form input changes for projects
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData({
      ...projectFormData,
      [name]: value,
    });
    
    // Clear error when field is updated
    if (projectErrors[name]) {
      setProjectErrors({
        ...projectErrors,
        [name]: '',
      });
    }
  };
  
  // Handle form input changes for awards
  const handleAwardChange = (e) => {
    const { name, value } = e.target;
    setAwardFormData({
      ...awardFormData,
      [name]: value,
    });
    
    // Clear error when field is updated
    if (awardErrors[name]) {
      setAwardErrors({
        ...awardErrors,
        [name]: '',
      });
    }
  };
  
  // Toggle ongoing project
  const handleOngoingProjectToggle = (e) => {
    const isOngoing = e.target.checked;
    setProjectFormData({
      ...projectFormData,
      isOngoing,
      endDate: isOngoing ? '' : projectFormData.endDate,
    });
  };
  
  // Validate certification form
  const validateCertForm = () => {
    const newErrors = {};
    
    if (!isNotEmpty(certFormData.name)) {
      newErrors.name = 'Certification name is required';
    }
    
    if (!isNotEmpty(certFormData.issuer)) {
      newErrors.issuer = 'Issuing organization is required';
    }
    
    if (!isNotEmpty(certFormData.date)) {
      newErrors.date = 'Date is required';
    } else if (!isNotFutureDate(certFormData.date)) {
      newErrors.date = 'Date cannot be in the future';
    }
    
    setCertErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate project form
  const validateProjectForm = () => {
    const newErrors = {};
    
    if (!isNotEmpty(projectFormData.name)) {
      newErrors.name = 'Project name is required';
    }
    
    if (!isNotEmpty(projectFormData.startDate)) {
      newErrors.startDate = 'Start date is required';
    } else if (!isNotFutureDate(projectFormData.startDate)) {
      newErrors.startDate = 'Start date cannot be in the future';
    }
    
    if (!projectFormData.isOngoing && !isNotEmpty(projectFormData.endDate)) {
      newErrors.endDate = 'End date is required';
    } else if (!projectFormData.isOngoing && !isNotFutureDate(projectFormData.endDate)) {
      newErrors.endDate = 'End date cannot be in the future';
    }
    
    setProjectErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate award form
  const validateAwardForm = () => {
    const newErrors = {};
    
    if (!isNotEmpty(awardFormData.name)) {
      newErrors.name = 'Award name is required';
    }
    
    if (!isNotEmpty(awardFormData.issuer)) {
      newErrors.issuer = 'Issuing organization is required';
    }
    
    if (!isNotEmpty(awardFormData.date)) {
      newErrors.date = 'Date is required';
    } else if (!isNotFutureDate(awardFormData.date)) {
      newErrors.date = 'Date cannot be in the future';
    }
    
    setAwardErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle certification dialog open
  const handleOpenCertDialog = (cert, index) => {
    if (cert) {
      setEditIndex(index);
      setCertFormData({
        name: cert.name || '',
        issuer: cert.issuer || '',
        date: cert.date || '',
        description: cert.description || '',
        url: cert.url || '',
      });
    } else {
      setEditIndex(-1);
      setCertFormData({
        name: '',
        issuer: '',
        date: '',
        description: '',
        url: '',
      });
    }
    setCertDialogOpen(true);
  };
  
  // Handle project dialog open
  const handleOpenProjectDialog = (project, index) => {
    if (project) {
      setEditIndex(index);
      setProjectFormData({
        name: project.name || '',
        role: project.role || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        description: project.description || '',
        url: project.url || '',
        isOngoing: !project.endDate,
      });
    } else {
      setEditIndex(-1);
      setProjectFormData({
        name: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
        url: '',
        isOngoing: false,
      });
    }
    setProjectDialogOpen(true);
  };
  
  // Handle award dialog open
  const handleOpenAwardDialog = (award, index) => {
    if (award) {
      setEditIndex(index);
      setAwardFormData({
        name: award.name || '',
        issuer: award.issuer || '',
        date: award.date || '',
        description: award.description || '',
      });
    } else {
      setEditIndex(-1);
      setAwardFormData({
        name: '',
        issuer: '',
        date: '',
        description: '',
      });
    }
    setAwardDialogOpen(true);
  };
  
  // Handle dialog close
  const handleCloseCertDialog = () => {
    setCertDialogOpen(false);
    setCertErrors({});
  };
  
  const handleCloseProjectDialog = () => {
    setProjectDialogOpen(false);
    setProjectErrors({});
  };
  
  const handleCloseAwardDialog = () => {
    setAwardDialogOpen(false);
    setAwardErrors({});
  };
  
  // Handle save certification
  const handleSaveCert = () => {
    if (!validateCertForm()) {
      return;
    }
    
    let updatedCerts;
    
    if (editIndex >= 0) {
      // Edit existing certification
      updatedCerts = [
        ...certifications.slice(0, editIndex),
        certFormData,
        ...certifications.slice(editIndex + 1),
      ];
    } else {
      // Add new certification
      updatedCerts = [...certifications, certFormData];
    }
    
    // Sort by date (most recent first)
    updatedCerts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    setCertifications(updatedCerts);
    handleCloseCertDialog();
    
    // Show success notification
    dispatch(showNotification({
      message: editIndex >= 0 ? 'Certification updated successfully' : 'Certification added successfully',
      type: 'success',
    }));
  };
  
  // Handle save project
  const handleSaveProject = () => {
    if (!validateProjectForm()) {
      return;
    }
    
    const newProject = {
      ...projectFormData,
      endDate: projectFormData.isOngoing ? null : projectFormData.endDate,
    };
    
    let updatedProjects;
    
    if (editIndex >= 0) {
      // Edit existing project
      updatedProjects = [
        ...projects.slice(0, editIndex),
        newProject,
        ...projects.slice(editIndex + 1),
      ];
    } else {
      // Add new project
      updatedProjects = [...projects, newProject];
    }
    
    // Sort by date (most recent first)
    updatedProjects.sort((a, b) => {
      const dateA = a.endDate || new Date().toISOString().slice(0, 10);
      const dateB = b.endDate || new Date().toISOString().slice(0, 10);
      return new Date(dateB) - new Date(dateA);
    });
    
    setProjects(updatedProjects);
    handleCloseProjectDialog();
    
    // Show success notification
    dispatch(showNotification({
      message: editIndex >= 0 ? 'Project updated successfully' : 'Project added successfully',
      type: 'success',
    }));
  };
  
  // Handle save award
  const handleSaveAward = () => {
    if (!validateAwardForm()) {
      return;
    }
    
    let updatedAwards;
    
    if (editIndex >= 0) {
      // Edit existing award
      updatedAwards = [
        ...awards.slice(0, editIndex),
        awardFormData,
        ...awards.slice(editIndex + 1),
      ];
    } else {
      // Add new award
      updatedAwards = [...awards, awardFormData];
    }
    
    // Sort by date (most recent first)
    updatedAwards.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    setAwards(updatedAwards);
    handleCloseAwardDialog();
    
    // Show success notification
    dispatch(showNotification({
      message: editIndex >= 0 ? 'Award updated successfully' : 'Award added successfully',
      type: 'success',
    }));
  };
  
  // Handle delete certification
  const handleDeleteCert = (index) => {
    const updatedCerts = [
      ...certifications.slice(0, index),
      ...certifications.slice(index + 1),
    ];
    setCertifications(updatedCerts);
    
    // Show success notification
    dispatch(showNotification({
      message: 'Certification removed',
      type: 'success',
    }));
  };
  
  // Handle delete project
  const handleDeleteProject = (index) => {
    const updatedProjects = [
      ...projects.slice(0, index),
      ...projects.slice(index + 1),
    ];
    setProjects(updatedProjects);
    
    // Show success notification
    dispatch(showNotification({
      message: 'Project removed',
      type: 'success',
    }));
  };
  
  // Handle delete award
  const handleDeleteAward = (index) => {
    const updatedAwards = [
      ...awards.slice(0, index),
      ...awards.slice(index + 1),
    ];
    setAwards(updatedAwards);
    
    // Show success notification
    dispatch(showNotification({
      message: 'Award removed',
      type: 'success',
    }));
  };
  
  // Handle finalize CV
  const handleFinalize = () => {
    // Save all sections to CV
    dispatch(
      setCurrentCV({
        ...currentCV,
        certifications,
        projects,
        awards,
      })
    );
    
    // Show success notification
    dispatch(showNotification({
      message: 'Your CV has been saved successfully!',
      type: 'success',
    }));
    
    // Navigate to preview
    window.location.href = `/cv/preview/${currentCV.id}`;
  };
  
  // Handle previous step
  const handleBack = () => {
    // Save all sections to CV
    dispatch(
      setCurrentCV({
        ...currentCV,
        certifications,
        projects,
        awards,
      })
    );
    
    // Move to previous step
    dispatch(prevStep());
  };
  
  return (
    <Box>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" gutterBottom sx={{ mr: 1 }}>
            Additional Sections
          </Typography>
          <Tooltip title="Add optional sections to make your CV more comprehensive and showcase additional achievements.">
            <IconButton size="small">
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          Enhance your CV with certifications, projects, and awards to stand out to employers.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {/* Certifications Section */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="certifications-content"
            id="certifications-header"
          >
            <Typography variant="h6">Certifications & Licenses</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {certifications.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                No certifications added yet.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {certifications.map((cert, index) => (
                  <Grid sx={{ width: '100%' }} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {cert.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {cert.issuer}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatMonthYear(cert.date)}
                        </Typography>
                        {cert.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {cert.description}
                          </Typography>
                        )}
                        {cert.url && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <a href={cert.url} target="_blank" rel="noopener noreferrer">
                              View Certificate
                            </a>
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <IconButton color="primary" onClick={() => handleOpenCertDialog(cert, index)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteCert(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenCertDialog()}
              >
                Add Certification
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
        
        {/* Projects Section */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="projects-content"
            id="projects-header"
          >
            <Typography variant="h6">Projects</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {projects.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                No projects added yet.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {projects.map((project, index) => (
                  <Grid sx={{ width: '100%' }} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {project.name}
                        </Typography>
                        {project.role && (
                          <Typography variant="subtitle1" color="text.secondary">
                            {project.role}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {formatMonthYear(project.startDate)} - {project.endDate ? formatMonthYear(project.endDate) : 'Present'}
                        </Typography>
                        {project.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {project.description}
                          </Typography>
                        )}
                        {project.url && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                              View Project
                            </a>
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <IconButton color="primary" onClick={() => handleOpenProjectDialog(project, index)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteProject(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenProjectDialog()}
              >
                Add Project
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
        
        {/* Awards Section */}
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="awards-content"
            id="awards-header"
          >
            <Typography variant="h6">Awards & Honors</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {awards.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                No awards added yet.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {awards.map((award, index) => (
                  <Grid sx={{ width: '100%' }} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {award.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {award.issuer}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatMonthYear(award.date)}
                        </Typography>
                        {award.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {award.description}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <IconButton color="primary" onClick={() => handleOpenAwardDialog(award, index)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteAward(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenAwardDialog()}
              >
                Add Award
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
      
      {/* Certification Dialog */}
      <Dialog open={certDialogOpen} onClose={handleCloseCertDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Certification' : 'Add Certification'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Certification Name"
                name="name"
                value={certFormData.name}
                onChange={handleCertChange}
                fullWidth
                required
                error={!!certErrors.name}
                helperText={certErrors.name}
                placeholder="e.g., AWS Certified Solutions Architect"
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Issuing Organization"
                name="issuer"
                value={certFormData.issuer}
                onChange={handleCertChange}
                fullWidth
                required
                error={!!certErrors.issuer}
                helperText={certErrors.issuer}
                placeholder="e.g., Amazon Web Services"
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Date Earned"
                name="date"
                type="month"
                value={certFormData.date}
                onChange={handleCertChange}
                fullWidth
                required
                error={!!certErrors.date}
                helperText={certErrors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Certificate URL (optional)"
                name="url"
                value={certFormData.url}
                onChange={handleCertChange}
                fullWidth
                placeholder="e.g., https://www.credential.net/..."
              />
            </Grid>
            <Grid sx={{ width: '100%' }}>
              <TextField
                label="Description (optional)"
                name="description"
                value={certFormData.description}
                onChange={handleCertChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Brief description of the certification or skills validated"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCertDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveCert}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onClose={handleCloseProjectDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Project' : 'Add Project'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Project Name"
                name="name"
                value={projectFormData.name}
                onChange={handleProjectChange}
                fullWidth
                required
                error={!!projectErrors.name}
                helperText={projectErrors.name}
                placeholder="e.g., E-commerce Website"
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Your Role (optional)"
                name="role"
                value={projectFormData.role}
                onChange={handleProjectChange}
                fullWidth
                placeholder="e.g., Lead Developer"
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Start Date"
                name="startDate"
                type="month"
                value={projectFormData.startDate}
                onChange={handleProjectChange}
                fullWidth
                required
                error={!!projectErrors.startDate}
                helperText={projectErrors.startDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={projectFormData.isOngoing}
                    onChange={handleOngoingProjectToggle}
                    color="primary"
                  />
                }
                label="This is an ongoing project"
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="End Date"
                name="endDate"
                type="month"
                value={projectFormData.endDate}
                onChange={handleProjectChange}
                fullWidth
                required={!projectFormData.isOngoing}
                disabled={projectFormData.isOngoing}
                error={!!projectErrors.endDate}
                helperText={projectFormData.isOngoing ? 'Ongoing project' : projectErrors.endDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Project URL (optional)"
                name="url"
                value={projectFormData.url}
                onChange={handleProjectChange}
                fullWidth
                placeholder="e.g., https://github.com/yourusername/project"
              />
            </Grid>
            <Grid sx={{ width: '100%' }}>
              <TextField
                label="Description"
                name="description"
                value={projectFormData.description}
                onChange={handleProjectChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Describe the project, your contributions, technologies used, and outcomes achieved."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProjectDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveProject}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Award Dialog */}
      <Dialog open={awardDialogOpen} onClose={handleCloseAwardDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex >= 0 ? 'Edit Award' : 'Add Award'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Award Name"
                name="name"
                value={awardFormData.name}
                onChange={handleAwardChange}
                fullWidth
                required
                error={!!awardErrors.name}
                helperText={awardErrors.name}
                placeholder="e.g., Employee of the Year"
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Issuing Organization"
                name="issuer"
                value={awardFormData.issuer}
                onChange={handleAwardChange}
                fullWidth
                required
                error={!!awardErrors.issuer}
                helperText={awardErrors.issuer}
                placeholder="e.g., XYZ Corporation"
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Date Received"
                name="date"
                type="month"
                value={awardFormData.date}
                onChange={handleAwardChange}
                fullWidth
                required
                error={!!awardErrors.date}
                helperText={awardErrors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                label="Description (optional)"
                name="description"
                value={awardFormData.description}
                onChange={handleAwardChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Briefly describe the award and why you received it"
              />
            </Grid>
          </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAwardDialog}>Cancel</Button>
         <Button 
           variant="contained" 
           onClick={handleSaveAward}
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
         onClick={handleFinalize}
       >
         Finalize & View CV
       </Button>
     </Box>
   </Box>
 );
};

export default AdditionalSectionsForm;