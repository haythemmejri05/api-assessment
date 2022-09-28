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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user'
  },
  createdAt: {
    type: Date,
    required: false,
  },
});

export default mongoose.model('glasses', glassesSchema);
