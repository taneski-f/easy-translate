/* Application types - item and resource type constants */

// Item Types
export const ItemTypes = Object.freeze({
  FOLDER: 'folder',
  PROJECT: 'project',
});

export const AllowedItemTypes = new Set(Object.values(ItemTypes));

// Resource Types
export const ResourceTypes = Object.freeze({
  PROJECT: 'project',
  PROJECT_FOLDER: 'project-folder',
});
