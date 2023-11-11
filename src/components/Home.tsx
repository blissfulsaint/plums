'use client'

import React from 'react';
import Header from '@/components/Header'
import TopicCard from '@/components/Card'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <Header />
      <div className=" p-8">
        <TopicCard  />
      </div>
      <div className=" p-8 flex flex-col items-end">
        <Link to="/add-new">
          <Fab color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </Link>
      </div>
    </>
  );
}







