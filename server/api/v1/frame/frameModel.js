import mongoose from 'mongoose';
//import Int32 from 'mongoose-int32';
//import Double from '@mongoosejs/double';

const frameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
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
});

export default mongoose.model('frame', frameSchema);
