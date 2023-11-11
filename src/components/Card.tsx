'use client'

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';

import { Link } from 'react-router-dom';


export default function TopicCard() {

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    
    <Card variant="outlined" sx={{ maxWidth: 345 }}>
      <CardHeader 
        action={
          <>
            <IconButton aria-label="settings">
              <Link className='pb-2' to="/edit">
                <EditIcon />
              </Link>
            </IconButton>
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
            </>
        }
        title="Topic Name"
      />
      <div className="p-8">
        <div className="flex flex-col items-end">
          {expanded ? <KeyboardArrowUpIcon onClick={handleExpandClick} />: <KeyboardArrowDownIcon  onClick={handleExpandClick} />}
        </div>
        {expanded ? <Typography paragraph>Content</Typography>: null}
      </div>
      
    
    </Card>
  );
}
