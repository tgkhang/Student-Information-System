import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Paper,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LinkIcon from '@mui/icons-material/Link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import ConfirmationDialog from '../../components/ConfirmationDialog';
// Custom styles for Moodle-like appearance
const moodleStyles = {
  accordion: {
    marginBottom: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:before': {
      display: 'none',
    },
  },
  accordionSummary: {
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
    borderRadius: '8px 8px 0 0',
    '&.Mui-expanded': {
      minHeight: '64px',
    }
  },
  accordionDetails: {
    padding: 0,
    backgroundColor: '#ffffff',
    borderRadius: '0 0 8px 8px',
  },
  sectionTitle: {
    fontWeight: 600,
    fontSize: '1rem',
  },
  iconBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '4px',
    backgroundColor: '#1e88e5',
    color: 'white',
    marginRight: '16px',
  },
  listItem: {
    borderLeft: '4px solid transparent',
    '&:hover': {
      borderLeft: '4px solid #1e88e5',
      backgroundColor: 'rgba(30, 136, 229, 0.04)',
    },
    padding: '12px 16px',
  },
  addButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#388e3c',
    }
  },
  resourceIcon: {
    marginRight: '8px',
    color: '#757575',
  },
  mainContainer: {
    backgroundColor: '#f9f9f9',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  itemCount: {
    backgroundColor: '#e0e0e0',
    color: '#424242',
    height: '24px',
    marginLeft: '8px',
  },
};

const getResourceIcon = (type) => {
  switch (type) {
    case 'pdf':
      return <InsertDriveFileIcon />;
    case 'video':
      return <YouTubeIcon />;
    case 'assignment':
      return <AssignmentIcon />;
    case 'link':
      return <LinkIcon />;
    case 'notification':
      return <NotificationsIcon />;
    default:
      return <DescriptionIcon />;
  }
}

const CollapsibleSection = ({ title, isTeacherMode, sectionColor}) => {
  const [items, setItems] = useState([
    { id: 1, content: 'Tài liệu giới thiệu khóa học', type: 'pdf' },
    { id: 2, content: 'Video bài giảng tuần 1', type: 'video' },
    { id: 3, content: 'Bài tập thực hành', type: 'assignment' },
    { id: 4, content: 'Liên kết tham khảo', type: 'link' }
  ]);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [newItemText, setNewItemText] = useState('');
  const [newItemType, setNewItemType] = useState('pdf');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    setItems(items.filter(item => item.id !== itemToDelete.id));
    setDeleteDialogOpen(false);
  };
  
  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newId = Math.max(...items.map(item => item.id), 0) + 1;
      setItems([...items, { id: newId, content: newItemText, type: newItemType }]);
      setNewItemText('');
      setAddDialogOpen(false);
    }
  };
  
  return (
    <Accordion 
      expanded={expanded} 
      onChange={() => setExpanded(!expanded)}
      sx={moodleStyles.accordion}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
        sx={{
          ...moodleStyles.accordionSummary,
          backgroundColor: sectionColor || '#f5f5f5'
        }}
      >
        <Box display="flex" alignItems="center" width="100%">
          <Typography sx={moodleStyles.sectionTitle}>{title}</Typography>
          <Box flexGrow={1} />
          <Chip 
            label={`${items.length} items`}
            size="small"
            sx={moodleStyles.itemCount}
          />
        </Box>
      </AccordionSummary>
      
      <AccordionDetails sx={moodleStyles.accordionDetails}>
        <List sx={{ width: '100%', padding: 0 }}>
          {items.map((item, index) => (
            <ListItem 
              key={item.id} 
              divider={index < items.length - 1}
              sx={moodleStyles.listItem}
              button
              component="a"
              
            >
              <ListItemIcon>
                {getResourceIcon(item.type)}
              </ListItemIcon>
              <ListItemText primary={item.content} />
              
              {isTeacherMode && (
                <ListItemSecondaryAction>
                  <Tooltip title="Delete item">
                    <IconButton 
                      edge="end" 
                      size="small" 
                      color="error" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(item);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
        
        {isTeacherMode && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Button 
              startIcon={<AddIcon />} 
              variant="contained" 
              size="small"
              onClick={() => setAddDialogOpen(true)}
              sx={moodleStyles.addButton}
            >
              Thêm tài liệu mới
            </Button>
          </Box>
        )}
      </AccordionDetails>
      
      <ConfirmationDialog title={"Xác nhận xóa"} message={"Bạn có chắc chắn muốn xóa tài liệu này?"} open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleConfirmDelete} />
      {/* Add Item Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Thêm tài liệu mới</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Tên tài liệu"
              fullWidth
              variant="outlined"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
            />
          </Box>
          <Box sx={{ mt: 3, mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Loại tài liệu:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              <Chip 
                icon={<InsertDriveFileIcon />} 
                label="PDF" 
                onClick={() => setNewItemType('pdf')}
                color={newItemType === 'pdf' ? 'primary' : 'default'}
                variant={newItemType === 'pdf' ? 'filled' : 'outlined'}
              />
              <Chip 
                icon={<YouTubeIcon />} 
                label="Video" 
                onClick={() => setNewItemType('video')}
                color={newItemType === 'video' ? 'primary' : 'default'}
                variant={newItemType === 'video' ? 'filled' : 'outlined'}
              />
              <Chip 
                icon={<AssignmentIcon />} 
                label="Bài tập" 
                onClick={() => setNewItemType('assignment')}
                color={newItemType === 'assignment' ? 'primary' : 'default'}
                variant={newItemType === 'assignment' ? 'filled' : 'outlined'}
              />
              <Chip 
                icon={<LinkIcon />} 
                label="Liên kết" 
                onClick={() => setNewItemType('link')}
                color={newItemType === 'link' ? 'primary' : 'default'}
                variant={newItemType === 'link' ? 'filled' : 'outlined'}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleAddItem} color="primary" variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Accordion>
  );
};

const CourseSection = ({isTeacherMode}) => {
  
  console.log('isTeacherMode', isTeacherMode);
  return (
    <Paper elevation={0} sx={moodleStyles.mainContainer}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Nội dung khóa học</Typography>

      </Box>
      
      <CollapsibleSection 
        title="Thông tin chung" 
        icon={<Typography variant="h6">📢</Typography>}
        isTeacherMode={isTeacherMode}
        sectionColor="#e3f2fd" 
      />
      
      <CollapsibleSection 
        title="Bài giảng và tài liệu" 
        icon={<Typography variant="h6">📚</Typography>}
        isTeacherMode={isTeacherMode}
        sectionColor="#e8f5e9" 
      />
      
      <CollapsibleSection 
        title="Bài tập và dự án" 
        icon={<Typography variant="h6">✏️</Typography>}  
        isTeacherMode={isTeacherMode}
        sectionColor="#fff8e1" 
      />
      
      <CollapsibleSection 
        title="Tài liệu tham khảo" 
        icon={<Typography variant="h6">📋</Typography>}
        isTeacherMode={isTeacherMode}
        sectionColor="#f3e5f5" 
      />
    </Paper>
  );
};

export default CourseSection;