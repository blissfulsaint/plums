"use client"; // This is a client component 👈🏽
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Topic from '../../components/Topic';

export default function Topics() {

  return (
    <div>
      <Header />
      <Nav />

      <Footer />
    </div>
  );
}
