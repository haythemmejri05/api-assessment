import mongoose from 'mongoose';
//import Int32 from 'mongoose-int32';
//import Double from '@mongoosejs/double';

const glassesSchema = new mongoose.Schema({
  frameId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'frame'
  },
  lenseId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'lense'
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
  createdAt: {
    type: Date,
    required: false,
    default: (new Date()),
  },
});

export default mongoose.model('glasses', glassesSchema);
