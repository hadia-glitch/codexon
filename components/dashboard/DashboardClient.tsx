 /*Author:HadiaNoor Purpose:renders dashboard client component Date:27-2-26*/
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';



export default function DashboardClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();


  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, authLoading, router]);

  return (
   
      <div >
  
      </div>
    
  );
}

