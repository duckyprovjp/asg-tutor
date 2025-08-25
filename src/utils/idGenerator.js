import api from "../services/api";

/**
 * Generates the next sequential ID for a given entity
 * @param {string} entity - The entity name (e.g., 'users', 'tutors', 'students')
 * @returns {Promise<string>} The next sequential ID as a string
 */
export const generateNextId = async (entity) => {
  try {
    // Get all records of the entity
    const response = await api.get(`/${entity}`);
    const records = response.data;

    // Find the highest numeric ID
    let maxId = 0;
    records.forEach((record) => {
      const recordId = parseInt(record.id);
      if (!isNaN(recordId) && recordId > maxId) {
        maxId = recordId;
      }
    });

    // Generate the next sequential ID
    return (maxId + 1).toString();
  } catch (error) {
    console.error(`Error generating ID for ${entity}:`, error);
    throw error;
  }
};

/**
 * Creates a record with a sequential ID
 * @param {string} entity - The entity name
 * @param {object} data - The data to create
 * @returns {Promise<object>} The created record
 */
export const createWithSequentialId = async (entity, data) => {
  try {
    const nextId = await generateNextId(entity);
    const recordWithId = {
      ...data,
      id: nextId,
    };

    return await api.post(`/${entity}`, recordWithId);
  } catch (error) {
    console.error(`Error creating ${entity}:`, error);
    throw error;
  }
};
