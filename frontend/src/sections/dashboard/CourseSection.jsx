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
  Tab,
  Tabs,
  Card,
  CardContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LinkIcon from '@mui/icons-material/Link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import QuizIcon from '@mui/icons-material/Quiz';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useNavigate } from 'react-router-dom';

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
    cursor: 'pointer',
    '&:hover': {
      borderLeft: '4px solid #1e88e5',
      backgroundColor: 'rgba(30, 136, 229, 0.04)',
    },
    padding: '12px 16px',
  },
  linkItem: {
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
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
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
  },
  divider: {
    flexGrow: 1,
  },
  dividerText: {
    margin: '0 16px',
    color: '#757575',
  },
  uploadButton: {
    margin: '8px',
    textTransform: 'none',
  },
  actionCard: {
    marginTop: '16px',
    backgroundColor: '#f5f9ff',
    borderRadius: '8px',
  },
  actionButton: {
    textTransform: 'none',
  },
  tabPanel: {
    padding: '16px',
  },
  resourceTypeChip: {
    marginRight: '8px',
    marginBottom: '8px',
  },
  deadlineChip: {
    backgroundColor: '#ff9800',
    color: 'white',
  },
  quizChip: {
    backgroundColor: '#9c27b0',
    color: 'white',
  },
  documentChip: {
    backgroundColor: '#2196f3',
    color: 'white',
  },
  linkChip: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
};

const getResourceIcon = (type) => {
  switch (type) {
    case 'document':
      return <InsertDriveFileIcon />;
    case 'video':
      return <YouTubeIcon />;
    case 'assignment':
      return <AssignmentIcon />;
    case 'link':
      return <LinkIcon />;
    case 'notification':
      return <NotificationsIcon />;
    case 'quiz':
      return <QuizIcon />;
    case 'deadline':
      return <ScheduleIcon />;
    default:
      return <DescriptionIcon />;
  }
};


const CollapsibleSection = ({ title, isTeacherMode, sectionColor, sectionType }) => {
  const navigate = useNavigate();
  
  // Default items based on section type
  const defaultItems = {
    'lectures': [
      { id: 1, content: 'Course Introduction Materials', type: 'document', dueDate: null },
      { id: 2, content: 'Week 1 Lecture Video', type: 'video', dueDate: null },
      { id: 3, content: 'Week 2 Reading Materials', type: 'document', dueDate: null }
    ],
    'assignments': [
      { id: 1, content: 'Midterm Quiz', type: 'quiz', dueDate: '2025-05-15' },
      { id: 2, content: 'Group Project Submission', type: 'deadline', dueDate: '2025-05-20' },
      { id: 3, content: 'Weekly Practice Quiz', type: 'quiz', dueDate: '2025-04-25' }
    ],
    'references': [
      { id: 1, content: 'Additional Learning Resources', type: 'link', url: 'https://example.com/resources' },
      { id: 2, content: 'Recommended Reading List', type: 'link', url: 'https://example.com/reading' },
      { id: 3, content: 'Academic Papers Collection', type: 'link', url: 'https://example.com/papers' }
    ]
  };
  
  const [items, setItems] = useState(defaultItems[sectionType] || []);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  // New item states
  const [newItemText, setNewItemText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [dueDate, setDueDate] = useState('');
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    setItems(items.filter(item => item.id !== itemToDelete.id));
    setDeleteDialogOpen(false);
  };
  
  const handleAddLink = () => {
    if (newItemText.trim() && linkUrl.trim()) {
      const newId = Math.max(...items.map(item => item.id), 0) + 1;
      setItems([...items, { id: newId, content: newItemText, type: 'link', url: linkUrl }]);
      resetForm();
    }
  };
  
  const handleAddDocument = () => {
    if (newItemText.trim()) {
      const newId = Math.max(...items.map(item => item.id), 0) + 1;
      setItems([...items, { id: newId, content: newItemText, type: 'document' }]);
      resetForm();
    }
  };
  
  const handleAddDeadline = () => {
    if (newItemText.trim() && dueDate) {
      const newId = Math.max(...items.map(item => item.id), 0) + 1;
      setItems([...items, { id: newId, content: newItemText, type: 'deadline', dueDate: dueDate }]);
      resetForm();
    }
  };
  
  const resetForm = () => {
    setNewItemText('');
    setLinkUrl('');
    setDueDate('');
    setAddDialogOpen(false);
  };
  
  const navigateToQuizCreation = () => {
    // Navigate to quiz creation page
    navigate('/create-quiz');
  };
  
  const navigateToDeadlineCreation = () => {
    // Navigate to deadline creation page
    navigate('/create-deadline');
  };
  
  // Check if this section should show specific types of content
  const getAddDialog = () => {
    if (sectionType === 'lectures') {
      return (
        <Dialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add New Material</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Document Title"
              fullWidth
              variant="outlined"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
            />
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ mr: 2 }}
                onClick={handleAddDocument}
              >
                Upload Document
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      );
    } else if (sectionType === 'references') {
      return (
        <Dialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add New Reference Link</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Link Title"
              fullWidth
              variant="outlined"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
            />
            
            <TextField
              margin="dense"
              label="URL"
              fullWidth
              variant="outlined"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              InputProps={{
                startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{ mt: 2 }}
            />
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<LinkIcon />}
                onClick={handleAddLink}
                disabled={!newItemText.trim() || !linkUrl.trim()}
              >
                Add Link
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      );
    } else if (sectionType === 'assignments') {
      return (
        <Dialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Add New Assignment</DialogTitle>
          <DialogContent>
            <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
              <Tab label="Quiz" />
              <Tab label="Deadline" />
            </Tabs>
            
            {tabValue === 0 && (
              <Box sx={{ p: 1, textAlign: 'center' }}>
                <Typography variant="body1" gutterBottom>
                  Create a new quiz for your students
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<QuizIcon />}
                  onClick={navigateToQuizCreation}
                  sx={{ mt: 2 }}
                >
                  Go to Quiz Creation
                </Button>
              </Box>
            )}
            
            {tabValue === 1 && (
              <Box sx={{ p: 1 }}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Assignment Title"
                  fullWidth
                  variant="outlined"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                />
                
                <TextField
                  margin="dense"
                  label="Due Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ mt: 2 }}
                />
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="contained"
                    startIcon={<EventNoteIcon />}
                    onClick={handleAddDeadline}
                    disabled={!newItemText.trim() || !dueDate}
                  >
                    Add Simple Deadline
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<NoteAddIcon />}
                    onClick={navigateToDeadlineCreation}
                  >
                    Advanced Deadline Setup
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      );
    }
  };
  
  const formatDueDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
              sx={{
                ...moodleStyles.listItem,
                ...(item.type === 'link' && moodleStyles.linkItem)
              }}
              button
              component={item.type === 'link' ? "a" : "div"}
              href={item.type === 'link' ? item.url : undefined}
              target={item.type === 'link' ? "_blank" : undefined}
            >
              <ListItemIcon>
                {getResourceIcon(item.type)}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      style={item.type === 'link' ? { marginRight: '8px' } : {}}
                    >
                      {item.content}
                    </Typography>
                  </Box>
                }
                secondary={item.dueDate && `Due: ${formatDueDate(item.dueDate)}`}
              />
              
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
        
      </AccordionDetails>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog 
        title={"Confirm Delete"} 
        message={"Are you sure you want to delete this item?"} 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)} 
        onConfirm={handleConfirmDelete} 
      />
      
      {/* Add Different Types of Content Based on Section */}
      {getAddDialog()}
    </Accordion>
  );
};

const CourseSection = ({isTeacherMode, course}) => {
  return (
    <Paper elevation={0} sx={moodleStyles.mainContainer}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Course Content</Typography>
      </Box>
      
      {isTeacherMode && (
        <Card sx={moodleStyles.actionCard}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Manage your course materials, assignments, and references
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<QuizIcon />}
                sx={moodleStyles.actionButton}
                onClick={() => window.location.href = `/teacher/createQuiz/${course?.MaKhoaHoc}`}
              >
                Create New Quiz
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<ScheduleIcon />}
                sx={moodleStyles.actionButton}
                onClick={() => window.location.href = `/teacher/deadline/${course?._id}`}
              >
                Set New Deadline
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<CloudUploadIcon />}
                sx={moodleStyles.actionButton}
                onClick={() => window.location.href = `/teacher/upload/${course?.MaKhoaHoc}`}
              >
                Upload Document
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<LinkIcon />}
                sx={moodleStyles.actionButton}
                onClick={() => window.location.href = '/add-reference'}
              >
                Add Reference Link
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<LinkIcon />}
                sx={moodleStyles.actionButton}
                onClick={() => window.location.href = `/teacher/create-notification/${course?.MaKhoaHoc}`}
              >
                Add Reference Link
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      
      <Box sx={{ mt: 3 }}>
        <CollapsibleSection 
          title="Lectures and Materials" 
          isTeacherMode={isTeacherMode}
          sectionColor="#e8f5e9"
          sectionType="lectures"
        />
        
        <CollapsibleSection 
          title="Assignments and Projects" 
          isTeacherMode={isTeacherMode}
          sectionColor="#fff8e1"
          sectionType="assignments"
        />
        
        <CollapsibleSection 
          title="Reference Materials" 
          isTeacherMode={isTeacherMode}
          sectionColor="#f3e5f5"
          sectionType="references" 
        />
      </Box>
    </Paper>
  );
};

export default CourseSection;