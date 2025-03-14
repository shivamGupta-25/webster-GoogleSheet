import { festInfo, registrationStatus } from "@/app/_data/techelonsData";

/**
 * Get the effective registration status for an event, taking into account
 * both the master registrationEnabled flag and the individual event's status
 * 
 * @param {Object} event - The event object
 * @returns {string} - The effective registration status
 */
export const getEffectiveRegistrationStatus = (event) => {
  if (!festInfo.registrationEnabled) return registrationStatus.CLOSED;
  return event.registrationStatus || registrationStatus.CLOSED;
}; 