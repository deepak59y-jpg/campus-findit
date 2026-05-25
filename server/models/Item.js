import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Item description is required'],
    },
    category: {
      type: String,
      default: 'Other',
      trim: true,
    },
    location: {
      type: String,
      default: 'Unknown',
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Item type (lost/found) is required'],
      enum: {
        values: ['lost', 'found'],
        message: '{VALUE} is not a valid item type',
      },
    },
    image: {
      type: String,
      default: '',
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User owner link is required'],
    },
  },
  {
    timestamps: true, // Auto handles createdAt and updatedAt
  }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;
