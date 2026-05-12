import React, { useState, useEffect } from 'react';
import ProfileDesktop from './ProfileDesktop';
import ProfilePhone from './ProfilePhone';

const Profile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <ProfilePhone /> : <ProfileDesktop />;
};

export default Profile;