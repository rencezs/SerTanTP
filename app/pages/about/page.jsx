"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/static/SecondPage.html';
  }, []);

  return null;
} 