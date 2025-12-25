import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Field from './models/field.model.js';

dotenv.config();

const defaultEquipment = [
  { name: 'Football', pricePerItem: 100, available: true },
  { name: 'Gloves', pricePerItem: 100, available: true },
  { name: 'Boots', pricePerItem: 100, available: true },
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Add default equipment to all fields that don't have equipment yet
    const fields = await Field.find({ $or: [{ equipment: { $exists: false } }, { equipment: { $size: 0 } }] });
    
    console.log(`Found ${fields.length} fields without equipment`);
    
    for (const field of fields) {
      field.equipment = defaultEquipment;
      await field.save();
      console.log(`Added default equipment to field: ${field.fieldName}`);
    }
    
    console.log('Default equipment added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding equipment:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
