"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@prisma/client';
import { useAuth } from '@clerk/nextjs';
import { calculateNutrition } from '@/lib/calculateNutrition';

interface ExtendedUser extends User {
  nutritions?: ReturnType<typeof calculateNutrition>; // The nutritions property is optional
}

interface UserContextProps {
  user: ExtendedUser | null;
  setUser: (user: ExtendedUser | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/user?userId=${userId}`);
          const data = await response.json();
          if (data.success) {
            const nutritions = calculateNutrition(data.user);
            
            const updatedUser = {
              ...data.user,
              nutritions
            };

            setUser(updatedUser);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
