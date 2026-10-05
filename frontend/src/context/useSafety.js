import { useContext } from 'react';
import { SafetyContext } from './SafetyContextDef';

export function useSafety() {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
}
