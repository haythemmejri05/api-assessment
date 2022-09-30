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
    USD: {
      type: Number,
      required: true,
    },
    GBP: {
      type: Number,
      required: true,
    },
    EUR: {
      type: Number,
      required: true,
    },
    JOD: {
      type: Number,
      required: true,
    },
    JPY: {
      type: Number,
      required: true,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'admin'
  },
  createdAt: {
    type: Date,
    required: false,
    default: (new Date()),
  },
});

export default mongoose.model('frame', frameSchema);
