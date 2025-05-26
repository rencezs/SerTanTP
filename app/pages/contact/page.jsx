import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = '/static/ContactAllOf.html';
  }, []);

  return null;
} 