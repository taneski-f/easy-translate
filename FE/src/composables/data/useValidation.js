// Generic rule builders
export const required =
  (label = 'This field') =>
  (v) => {
    const s = v == null ? '' : String(v);
    return s.trim().length > 0 || `${label} is required`;
  };

export const maxLength =
  (n, label = `Must be ${n} characters or fewer`) =>
  (v) => {
    const s = v == null ? '' : String(v);
    return s.trim().length <= n || label;
  };

// Evaluate rules for a value
export const isValid = (rules, value) => rules.every((rule) => rule(value) === true);

// Prebuilt rule sets for current fields
import { ItemTypes } from '@/constants/app.js';

// Build name validation rules based on item type
// - Could be refactored to be more generic, but ok for only two item types
export const buildNameRules = (type = ItemTypes.FOLDER) => {
  const label = type === ItemTypes.PROJECT ? 'Project name' : 'Folder name';
  return [required(label), maxLength(50)];
};
