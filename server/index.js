const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5175;

const supabaseUrl = process.env.SUPABASE_URL || 'https://psfjdkiqjovxxrwppqop.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_vAyf7WQ8y5WqB0FBg1J0zA_kCAm1rA-';
const supabase = createClient(supabaseUrl, supabaseKey);

// Supabase configuration - USING MY ACTUAL CREDENTIALS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://sk-cotton-website-mhrh.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());

// ===== DATABASE ROUTES =====
// Get all collections
app.get('/api/collections', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Add new collection
app.post('/api/collections', async (req, res) => {
  try {
    const { name, tag, description, color, image, is_active, featured } = req.body;
    
    const { data, error } = await supabase
      .from('collections')
      .insert([{ 
        name, 
        tag, 
        description, 
        color, 
        image, 
        is_active: is_active !== undefined ? is_active : true, 
        featured: featured || false 
      }])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error adding collection:', error);
    res.status(500).json({ error: 'Failed to add collection' });
  }
});

// Update collection
app.put('/api/collections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tag, description, color, image, is_active, featured } = req.body;
    
    const { data, error } = await supabase
      .from('collections')
      .update({ name, tag, description, color, image, is_active, featured })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

// Delete collection
app.delete('/api/collections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
});

// Get hero data
app.get('/api/hero', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hero_data')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    // Return default if not found
    res.json(data || {
      images: ['/assets/model1.jpg', '/assets/model2.jpg', '/assets/model3.jpg'],
      title1: 'SK COOL',
      title2: 'COTTON',
      subtitle: 'Sewing confidence into every stitch, crafting comfort that speaks elegance.',
      button1_text: 'View Collections',
      button2_text: 'Contact Us'
    });
  } catch (error) {
    console.error('Error fetching hero:', error);
    res.status(500).json({ error: 'Failed to fetch hero data' });
  }
});

// Update hero data
app.put('/api/hero', async (req, res) => {
  try {
    const { images, title1, title2, subtitle, button1_text, button2_text } = req.body;
    
    const { data, error } = await supabase
      .from('hero_data')
      .upsert({ 
        id: 1, 
        images, 
        title1, 
        title2, 
        subtitle, 
        button1_text, 
        button2_text 
      })
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(500).json({ error: 'Failed to update hero data' });
  }
});

// ===== IMAGE UPLOAD TO SUPABASE STORAGE =====
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload-hero-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExt = path.extname(req.file.originalname);
    const fileName = `hero-${Date.now()}${fileExt}`;
    const filePath = `hero_images/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('hero_images')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600'
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('hero_images')
      .getPublicUrl(filePath);

    return res.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

app.get('/', (req, res) => {
  res.send('SK Cool Cotton server running with Supabase');
});
// ===== CONTACT FORM ROUTES =====
// Save contact form
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, message }])
      .select();
    
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});
// ===== CONTACT FORM ROUTES =====
// Save contact form
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    console.log('Received contact form:', { name, email, message });
    
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ name, email, message }])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Contact saved:', data);
    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to save contact', details: error.message });
  }
});
// Get all contact submissions
app.get('/api/contacts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});
// Get all contact submissions
app.get('/api/contacts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// 🔧 DEBUG: List all tables
// 🔧 DEBUG: Test collections table with different name formats
app.get('/api/test-collections', async (req, res) => {
  try {
    const results = [];
    
    // Test 1: Regular 'collections'
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('count')
        .limit(1);
      results.push({ 
        test: "collections", 
        success: !error, 
        error: error?.message || null 
      });
    } catch (e) {
      results.push({ test: "collections", success: false, error: e.message });
    }
    
    // Test 2: With quotes '"collections"'
    try {
      const { data, error } = await supabase
        .from('"collections"')
        .select('count')
        .limit(1);
      results.push({ 
        test: '"collections"', 
        success: !error, 
        error: error?.message || null 
      });
    } catch (e) {
      results.push({ test: '"collections"', success: false, error: e.message });
    }
    
    // Test 3: Capital C 'Collections'
    try {
      const { data, error } = await supabase
        .from('Collections')
        .select('count')
        .limit(1);
      results.push({ 
        test: "Collections", 
        success: !error, 
        error: error?.message || null 
      });
    } catch (e) {
      results.push({ test: "Collections", success: false, error: e.message });
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// 🔧 DEBUG: See actual collections data
app.get('/api/debug-collections-data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*');
    
    res.json({
      success: !error,
      count: data?.length || 0,
      data: data,
      error: error
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});
// Keep this at the very end
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
