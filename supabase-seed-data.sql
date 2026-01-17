-- ChangeLogic Professor Tracker - Seed Data
-- Run this AFTER creating the schema (supabase-schema.sql)

INSERT INTO professors (name, institution, role, core_ip, exec_ed_programs, notes, status, clients, liaison, next_action, contract_signed, engagement_type, links, last_contacted) VALUES

-- 1. Mike Tushman
(
  'Mike Tushman',
  'Harvard Business School',
  'Professor',
  ARRAY['Congruence Model', 'Ambidextrous Organizations', 'Leading Change'],
  ARRAY['LCOR', 'AMP'],
  'Co-founder. Active on all major engagements.',
  'First Client',
  ARRAY['CPP Investments', 'OCP', 'LexisNexis', 'Analog Devices'],
  '',
  '',
  TRUE,
  'Open to be Staffed',
  '{}',
  NOW() - INTERVAL '5 days'
),

-- 2. Charles O'Reilly
(
  'Charles O''Reilly',
  'Stanford GSB',
  'Professor',
  ARRAY['Ambidextrous Organizations', 'Organizational Culture', 'Leadership'],
  ARRAY['Stanford Executive Program', 'LCOR'],
  'Co-founder. Active on Stanford-sourced engagements.',
  'First Client',
  ARRAY[]::TEXT[],
  'MKB',
  '',
  TRUE,
  'Open to be Staffed',
  '{}',
  NOW() - INTERVAL '10 days'
),

-- 3. Bill Barnett
(
  'Bill Barnett',
  'Stanford GSB',
  'Professor',
  ARRAY['Red Queen Competition', 'Competitive Strategy', 'Organizational Learning'],
  ARRAY['Stanford Executive Program', 'Strategy programs'],
  'Active partner. Source of CPP Investments engagement.',
  'First Client',
  ARRAY['CPP Investments'],
  '',
  '',
  TRUE,
  'Open to Work',
  '{}',
  NOW() - INTERVAL '15 days'
),

-- 4. Ryan Rafaelli
(
  'Ryan Rafaelli',
  'Harvard Business School',
  'Professor',
  ARRAY['Technology Reemergence', 'Institutional Change', 'Industry Revival'],
  ARRAY['LCOR (co-chair with Tushman)', 'MBA', 'Executive Education'],
  'Mike made intro. Outstanding young scholar. Need to schedule follow-up.',
  'In Contact',
  ARRAY[]::TEXT[],
  '',
  'Schedule follow-up call',
  FALSE,
  'Unknown',
  '{}',
  NOW() - INTERVAL '45 days'
),

-- 5. Felipe Monteiro
(
  'Felipe Monteiro',
  'INSEAD',
  'Professor',
  ARRAY['Global Open Innovation', 'Boundary Spanning', 'Technology Scouting', 'Sustainability'],
  ARRAY['PGA-Advanced Management Program (Brazil)', 'MBA', 'EMBA'],
  'Mike sent intro email. Co-authors with Mike and Ivanka.',
  'In Contact',
  ARRAY[]::TEXT[],
  '',
  'Follow up on Mike intro',
  FALSE,
  'Unknown',
  '{}',
  NOW() - INTERVAL '35 days'
),

-- 6. Hila Lifshitz-Assaf
(
  'Hila Lifshitz-Assaf',
  'Warwick / Harvard LISH',
  'Professor',
  ARRAY['Open Innovation', 'AI Integration', 'Future of Work', 'R&D Transformation'],
  ARRAY['Executive programs at Warwick', 'visiting faculty at Harvard LISH'],
  'Co-authored with Mike. Already does advisory through Stern Strategy Group.',
  'Identified',
  ARRAY[]::TEXT[],
  '',
  'Research Stern Strategy Group relationship',
  FALSE,
  'Unknown',
  '{}',
  NULL
),

-- 7. Karim Lakhani
(
  'Karim Lakhani',
  'Harvard Business School / LISH / D3',
  'Professor',
  ARRAY['AI/Digital Transformation', 'Open Innovation', 'Competing in Age of AI'],
  ARRAY['Harvard Business Analytics Program', 'AI Strategy programs'],
  'Strong Mike relationship. Also on Stern Strategy Group.',
  'Identified',
  ARRAY[]::TEXT[],
  '',
  'Discuss with Mike about approach',
  FALSE,
  'Unknown',
  '{}',
  NULL
),

-- 8. Marc Ventresca
(
  'Marc Ventresca',
  'Oxford',
  'Professor',
  ARRAY['Exploit/Explore', 'Innovation', 'Global Space Economy', 'Institutional Entrepreneurship'],
  ARRAY['Oxford online programs (17 cohorts)', 'EMBA'],
  'Met Nov 2025. Wants light engagement to start. Has 18-person alumni team.',
  'In Contact',
  ARRAY[]::TEXT[],
  '',
  'Propose light engagement pilot',
  FALSE,
  'Open to Workshops',
  '{}',
  NOW() - INTERVAL '60 days'
),

-- 9. Timo Vuori
(
  'Timo Vuori',
  'Aalto Business School',
  'Professor',
  ARRAY['Scenario-Based Strategy', 'Emotional Management in Strategy', 'Leadership Decision-Making'],
  ARRAY['Aalto Executive Education', 'Nokia case teaching'],
  'Has immediate pilot opportunity. Good European market entry.',
  'In Contact',
  ARRAY[]::TEXT[],
  '',
  'Schedule pilot discussion call',
  FALSE,
  'Open to Work',
  '{}',
  NOW() - INTERVAL '20 days'
),

-- 10. Mitch Weiss
(
  'Mitch Weiss',
  'Harvard Business School',
  'Professor',
  ARRAY['Public Entrepreneurship', 'AI in Institutions', 'Government Innovation'],
  ARRAY['Teaching with AI seminar', 'Bloomberg Harvard City Leadership Initiative'],
  'Strong AI credentials. Could pair with Bill on CPP-type engagements.',
  'In Contact',
  ARRAY[]::TEXT[],
  '',
  'Explore CPP pairing with Bill',
  FALSE,
  'Unknown',
  '{}',
  NOW() - INTERVAL '25 days'
),

-- 11. Wendy Smith
(
  'Wendy Smith',
  'University of Delaware',
  'Professor',
  ARRAY['Paradox Theory', 'Both/And Thinking', 'Leadership Paradoxes'],
  ARRAY['Executive Education programs'],
  'Coaching-based model. Flexible professor involvement preference.',
  'In Contact',
  ARRAY[]::TEXT[],
  '',
  'Discuss engagement model preferences',
  FALSE,
  'Open to Workshops',
  '{}',
  NOW() - INTERVAL '40 days'
),

-- 12. Brian Hall
(
  'Brian Hall',
  'Harvard Business School',
  'Professor',
  ARRAY['Strategy', 'Incentives', 'Tridexterity', 'Executive Compensation'],
  ARRAY['Harvard Executive Education'],
  'Duracell pilot discussed. Potential ownership path interest.',
  'In Contact',
  ARRAY['Duracell (potential pilot)'],
  '',
  'Follow up on Duracell pilot',
  FALSE,
  'Open to Work',
  '{}',
  NOW() - INTERVAL '30 days'
),

-- 13. Ivanka Visnjic
(
  'Ivanka Visnjic',
  'ESADE',
  'Professor',
  ARRAY['Digital Transformation', 'AI', 'Servitization', 'Business Model Innovation'],
  ARRAY['ESADE Executive Education', 'Middle East programs'],
  'Co-authors with Felipe Monteiro and Mike. Quality-focused.',
  'In Contact',
  ARRAY[]::TEXT[],
  '',
  'Connect through Felipe',
  FALSE,
  'Unknown',
  '{}',
  NOW() - INTERVAL '50 days'
),

-- 14. Peter Fisk
(
  'Peter Fisk',
  'IE Business School',
  'Professor',
  ARRAY['Innovation Strategy', 'Growth Strategy', 'Marketing', 'Leadership'],
  ARRAY['Global Advanced Management Program (Academic Director)'],
  'Runs own firm GeniusWorks. Partnership model would need to account for this.',
  'Identified',
  ARRAY[]::TEXT[],
  '',
  'Research GeniusWorks partnership model',
  FALSE,
  'Unknown',
  '{}',
  NULL
),

-- 15. Fabrizio Ferraro
(
  'Fabrizio Ferraro',
  'IESE',
  'Professor',
  ARRAY['ESG', 'Sustainability Leadership', 'Impact Investing', 'Grand Challenges'],
  ARRAY['MBA', 'EMBA', 'Sustainability & ESG programs'],
  'Stanford PhD. Past Chair of UN PRI Academic Advisory.',
  'Identified',
  ARRAY[]::TEXT[],
  '',
  'Initial outreach through Stanford network',
  FALSE,
  'Unknown',
  '{}',
  NULL
),

-- 16. Christoph Zott
(
  'Christoph Zott',
  'IESE',
  'Professor',
  ARRAY['Business Model Innovation', 'Entrepreneurship', 'Value Creation'],
  ARRAY['IESE Entrepreneurship programs', 'MBA'],
  'Most cited researcher in business model innovation field (47K citations).',
  'Identified',
  ARRAY[]::TEXT[],
  '',
  'Initial outreach',
  FALSE,
  'Unknown',
  '{}',
  NULL
),

-- 17. Juan Antonio Enciso
(
  'Juan Antonio Enciso',
  'EGADE Business School (Tec de Monterrey)',
  'Professor',
  ARRAY['Institutional Analysis', 'Global Strategy', 'International Business'],
  ARRAY['Global OneMBA (Director)', 'EGADE MBA'],
  'Strong LATAM/Mexico presence. Could open Tec de Monterrey network.',
  'Identified',
  ARRAY[]::TEXT[],
  '',
  'Explore LATAM market opportunity',
  FALSE,
  'Unknown',
  '{}',
  NULL
);
