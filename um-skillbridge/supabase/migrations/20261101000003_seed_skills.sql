-- ==============================================================================
-- UM SkillBridge — Migration 00003: Seed Skills Catalog
-- Description: Preloads canonical skill categories and initial skills so real
--              users can immediately select them for teaching and learning.
-- ==============================================================================

INSERT INTO public.skills (id, slug, title, category, description, icon, moderation_status)
VALUES
  ('c0000001-0000-0000-0000-000000000001', 'python-programming', 'Python Programming', 'Programming', 'Learn Python from basics to advanced concepts including data structures, OOP, and automation scripts.', 'Code2', 'Approved'),
  ('c0000001-0000-0000-0000-000000000002', 'java-programming', 'Java Programming', 'Programming', 'Object-oriented programming with Java, covering fundamentals to design patterns.', 'Code2', 'Approved'),
  ('c0000001-0000-0000-0000-000000000003', 'web-development', 'Web Development', 'Programming', 'HTML, CSS, and JavaScript fundamentals for building responsive websites.', 'Globe', 'Approved'),
  ('c0000001-0000-0000-0000-000000000004', 'canva-design', 'Canva Design', 'Graphic Design', 'Create stunning presentations, social media graphics, and marketing materials using Canva.', 'Palette', 'Approved'),
  ('c0000001-0000-0000-0000-000000000005', 'figma-ui-design', 'Figma UI Design', 'Graphic Design', 'Design user interfaces and prototypes using Figma, from wireframes to polished mockups.', 'Figma', 'Approved'),
  ('c0000001-0000-0000-0000-000000000006', 'public-speaking', 'Public Speaking', 'Public Speaking', 'Build confidence in public speaking, learn persuasive presentation techniques.', 'Mic', 'Approved'),
  ('c0000001-0000-0000-0000-000000000007', 'microsoft-excel', 'Microsoft Excel', 'Productivity Tools', 'Master Excel from formulas and pivot tables to data visualization and macros.', 'Table', 'Approved'),
  ('c0000001-0000-0000-0000-000000000008', 'english-conversation', 'English Conversation', 'Language Learning', 'Practice conversational English, improve fluency and pronunciation.', 'Languages', 'Approved'),
  ('c0000001-0000-0000-0000-000000000009', 'mandarin-basics', 'Mandarin Basics', 'Language Learning', 'Learn basic Mandarin Chinese, including pronunciation, characters, and daily phrases.', 'Languages', 'Approved'),
  ('c0000001-0000-0000-0000-000000000010', 'machine-learning', 'Machine Learning', 'AI & Data Science', 'Introduction to ML concepts, supervised/unsupervised learning, and practical projects.', 'Brain', 'Approved'),
  ('c0000001-0000-0000-0000-000000000011', 'data-analysis', 'Data Analysis', 'AI & Data Science', 'Analyze data using Python, pandas, and visualization tools to extract insights.', 'BarChart3', 'Approved'),
  ('c0000001-0000-0000-0000-000000000012', 'calculus', 'Calculus', 'Mathematics', 'Calculus fundamentals including limits, derivatives, integrals, and applications.', 'Calculator', 'Approved'),
  ('c0000001-0000-0000-0000-000000000013', 'presentation-design', 'Presentation Design', 'Graphic Design', 'Create compelling slide decks that communicate ideas effectively.', 'Presentation', 'Approved'),
  ('c0000001-0000-0000-0000-000000000014', 'business-plan-writing', 'Business Plan Writing', 'Business & Entrepreneurship', 'Structure and write compelling business plans for startups and competitions.', 'FileText', 'Approved'),
  ('c0000001-0000-0000-0000-000000000015', 'photography', 'Photography', 'Creative Arts', 'Learn composition, lighting, and editing techniques for stunning photographs.', 'Camera', 'Approved'),
  ('c0000001-0000-0000-0000-000000000016', 'video-editing', 'Video Editing', 'Creative Arts', 'Edit videos using professional tools, learn storytelling through visual media.', 'Film', 'Approved')
ON CONFLICT (slug) DO UPDATE
  SET title = EXCLUDED.title,
      category = EXCLUDED.category,
      description = EXCLUDED.description,
      icon = EXCLUDED.icon;
