import Item from '../models/Item.js';

// @desc    Get all lost/found items
// @route   GET /api/items
// @access  Public
export const getItems = async (req, res, next) => {
  try {
    // Sort by latest first, populate user name
    const items = await Item.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item details
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'name email');

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a lost/found item
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res, next) => {
  try {
    const { title, description, category, location, type, image } = req.body;

    const item = await Item.create({
      title,
      description,
      category,
      location,
      type,
      image: image || '',
      user: req.user._id, // Set by authMiddleware
    });

    const populatedItem = await Item.findById(item._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      item: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lost/found item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req, res, next) => {
  try {
    const { title, description, category, location, type, image, resolved } = req.body;

    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    // Verify requesting user owns this item post
    if (item.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('User not authorized to update this item');
    }

    // Update fields
    item.title = title !== undefined ? title : item.title;
    item.description = description !== undefined ? description : item.description;
    item.category = category !== undefined ? category : item.category;
    item.location = location !== undefined ? location : item.location;
    item.type = type !== undefined ? type : item.type;
    item.image = image !== undefined ? image : item.image;
    item.resolved = resolved !== undefined ? resolved : item.resolved;

    const updatedItem = await item.save();
    const populatedItem = await Item.findById(updatedItem._id).populate('user', 'name');

    res.status(200).json({
      success: true,
      item: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lost/found item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    // Verify requesting user owns this item post
    if (item.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('User not authorized to delete this item');
    }

    await Item.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Item post removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
