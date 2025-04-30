import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { setCurrentCV, deleteCV, generatePDF } from '../../store/slices/cvSlice';
import { showConfirmDialog, showNotification } from '../../store/slices/uiSlice';
import { formatMonthYear } from '../../utils/dateFormatter';

const CVCard = ({ cv }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Initial check for valid CV object
  if (!cv) {
    console.error("Received invalid CV object:", cv);
    return (
      <Card sx={{ height: '100%', p: 2 }}>
        <Typography color="error">
          Invalid CV data
        </Typography>
      </Card>
    );
  }

  // Check if CV has required properties
  const cvId = cv._id || cv.id;
  const hasRequiredProps = cvId && cv.title && cv.template;
  
  if (!hasRequiredProps) {
    console.error("CV is missing required properties:", cv);
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    // Safety check for cv._id
    if (!cvId) {
      dispatch(showNotification({
        message: 'Cannot edit this CV: ID is missing',
        type: 'error',
      }));
      return;
    }
    
    dispatch(setCurrentCV(cv));
    console.log("Navigating to edit CV with ID:", cvId);
    navigate(`/cv/edit/${cvId}`);
    handleMenuClose();
  };

  const handleView = () => {
    // Safety check for cv._id
    if (!cvId) {
      console.error("Cannot view CV - missing ID:", cv);
      dispatch(showNotification({
        message: 'Cannot preview this CV: ID is missing',
        type: 'error',
      }));
      return;
    }
    
    dispatch(setCurrentCV(cv));
    
    // Log the navigation for debugging
    console.log("Navigating to CV preview with ID:", cvId);
    
    // Navigate to the preview page
    navigate(`/cv/preview/${cvId}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    // Safety check for cv._id
    if (!cvId) {
      dispatch(showNotification({
        message: 'Cannot delete this CV: ID is missing',
        type: 'error',
      }));
      return;
    }
    
    handleMenuClose();
    dispatch(
      showConfirmDialog({
        title: 'Delete CV',
        content: `Are you sure you want to delete "${cv.title}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: async () => {
          try {
            await dispatch(deleteCV(cvId)).unwrap();
            dispatch(showNotification({
              message: 'CV deleted successfully',
              type: 'success',
            }));
          } catch (error) {
            dispatch(showNotification({
              message: `Error deleting CV: ${error.message}`,
              type: 'error',
            }));
          }
        },
      })
    );
  };

  const handleDownload = async () => {
    // Safety check for cv._id
    if (!cvId) {
      dispatch(showNotification({
        message: 'Cannot download this CV: ID is missing',
        type: 'error',
      }));
      return;
    }
    
    try {
      await dispatch(generatePDF(cvId)).unwrap();
      dispatch(showNotification({
        message: 'CV downloaded successfully',
        type: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: `Error downloading CV: ${error.message}`,
        type: 'error',
      }));
    }
    handleMenuClose();
  };

  // Safely access nested properties
  const fullName = cv.personalInfo?.fullName || 'Unnamed';
  const jobTitle = cv.personalInfo?.jobTitle || 'No title';
  const templateName = cv.template ? cv.template.charAt(0).toUpperCase() + cv.template.slice(1) : 'Default';
  const lastUpdated = cv.updatedAt ? formatMonthYear(cv.updatedAt) : 'Not available';

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      },
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" noWrap>
            {cv.title || 'Untitled CV'}
          </Typography>
          <IconButton onClick={handleMenuClick} size="small">
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit} disabled={!cvId}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleView} disabled={!cvId}>
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
              Preview
            </MenuItem>
            <MenuItem onClick={handleDownload} disabled={!cvId}>
              <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
              Download PDF
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }} disabled={!cvId}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {fullName} • {jobTitle}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Template: {templateName}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Last updated: {lastUpdated}
        </Typography>
        
        {/* Warning if CV is missing ID */}
        {!cvId && (
          <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
            Warning: This CV has an invalid ID and cannot be edited or previewed.
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<EditIcon />} onClick={handleEdit} disabled={!cvId}>
          Edit
        </Button>
        <Button size="small" startIcon={<VisibilityIcon />} onClick={handleView} disabled={!cvId}>
          Preview
        </Button>
      </CardActions>
    </Card>
  );
};

export default CVCard;