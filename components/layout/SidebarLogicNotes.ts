'use client';
import { clearSession } from '@/lib/auth';

// Add the logout functionality directly in Sidebar component, we'll need to modify it.
// Wait, I can't use node 'cookies' in client component Sidebar. I will replace Sidebar to fetch from API.
