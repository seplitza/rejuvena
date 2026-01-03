import { Router, Response } from 'express';
import Tag from '../models/Tag.model';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Get all tags
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create tag
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, color } = req.body;
    
    // Create slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const tag = new Tag({ name, slug, color });
    await tag.save();
    
    res.status(201).json(tag);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Tag already exists' });
    }
    console.error('Create tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete tag
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
