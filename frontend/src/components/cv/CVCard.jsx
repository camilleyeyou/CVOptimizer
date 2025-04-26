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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    dispatch(setCurrentCV(cv));
    navigate(`/cv/edit/${cv._id}`);
    handleMenuClose();
  };

  const handleView = () => {
    dispatch(setCurrentCV(cv));
    navigate(`/cv/preview/${cv._id}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    handleMenuClose();
    dispatch(
      showConfirmDialog({
        title: 'Delete CV',
        content: `Are you sure you want to delete "${cv.title}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        onConfirm: async () => {
          try {
            await dispatch(deleteCV(cv._id)).unwrap();
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
    try {
      await dispatch(generatePDF(cv._id)).unwrap();
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

  // Format date - using the imported formatMonthYear for consistency
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

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
            {cv.title}
          </Typography>
          <IconButton onClick={handleMenuClick} size="small">
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleView}>
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
              Preview
            </MenuItem>
            <MenuItem onClick={handleDownload}>
              <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
              Download PDF
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {cv.personalInfo?.fullName || 'Unnamed'} • {cv.personalInfo?.jobTitle || 'No title'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Template: {cv.template.charAt(0).toUpperCase() + cv.template.slice(1)}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Last updated: {formatDate(cv.updatedAt)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" startIcon={<EditIcon />} onClick={handleEdit}>
          Edit
        </Button>
        <Button size="small" startIcon={<VisibilityIcon />} onClick={handleView}>
          Preview
        </Button>
      </CardActions>
    </Card>
  );
};

export default CVCard;