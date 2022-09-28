import mongoose from 'mongoose';
//import Int32 from 'mongoose-int32';
//import Double from '@mongoosejs/double';

const lenseSchema = new mongoose.Schema({
  colour: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  prescriptionType: {
    type: String,
    required: true,
  },
  lenseType: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user'
  },
  createdAt: {
    type: Date,
    required: false,
  },
});

export default mongoose.model('lense', lenseSchema);
