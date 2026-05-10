-- Admin user (password: "password")
INSERT INTO users (id, email, name, password_hash, password_salt) VALUES
  ('user-admin', 'test@example.com', 'Admin',
   '6c835499a9362b8e0e0e02a1f05d3d145314760b2ec030407dce79d7adc59965',
   '0123456789abcdef0123456789abcdef');

-- Organizations
INSERT INTO organizations (id, name, email, phone, city, country) VALUES
  ('org-acme',      'Acme Inc.',            'info@acme.example',     '03-1111-2222',    'Tokyo',        'Japan'),
  ('org-globex',    'Globex Corp.',         'hello@globex.example',  '03-3333-4444',    'Yokohama',     'Japan'),
  ('org-initech',   'Initech',              'contact@initech.example','06-5555-6666',    'Osaka',        'Japan'),
  ('org-umbrella',  'Umbrella Corporation', 'info@umbrella.example', '+1-555-0100',     'Raccoon City', 'USA'),
  ('org-stark',     'Stark Industries',     'press@stark.example',   '+1-212-555-0199', 'New York',     'USA'),
  ('org-wayne',     'Wayne Enterprises',    'ir@wayne.example',      '+1-212-555-0182', 'Gotham',       'USA'),
  ('org-cyberdyne', 'Cyberdyne Systems',    'info@cyberdyne.example','+1-310-555-0123', 'Sunnyvale',    'USA');

-- Contacts
INSERT INTO contacts (id, first_name, last_name, email, phone, city, country, organization_id) VALUES
  ('contact-smith-john',     'John',   'Smith',    'john@acme.example',     '03-1111-1001',    'Tokyo',        'Japan', 'org-acme'),
  ('contact-doe-jane',       'Jane',   'Doe',      'jane@acme.example',     '03-1111-1002',    'Tokyo',        'Japan', 'org-acme'),
  ('contact-scorpio-hank',   'Hank',   'Scorpio',  'hank@globex.example',   '03-3333-2001',    'Yokohama',     'Japan', 'org-globex'),
  ('contact-gibbons-peter',  'Peter',  'Gibbons',  'peter@initech.example', '06-5555-3001',    'Osaka',        'Japan', 'org-initech'),
  ('contact-lumbergh-bill',  'Bill',   'Lumbergh', 'bill@initech.example',  '06-5555-3002',    'Osaka',        'Japan', 'org-initech'),
  ('contact-wesker-albert',  'Albert', 'Wesker',   'wesker@umbrella.example','+1-555-4001',    'Raccoon City', 'USA',   'org-umbrella'),
  ('contact-stark-tony',     'Tony',   'Stark',    'tony@stark.example',    '+1-212-555-5001', 'New York',     'USA',   'org-stark'),
  ('contact-potts-pepper',   'Pepper', 'Potts',    'pepper@stark.example',  '+1-212-555-5002', 'New York',     'USA',   'org-stark'),
  ('contact-wayne-bruce',    'Bruce',  'Wayne',    'bruce@wayne.example',   '+1-212-555-6001', 'Gotham',       'USA',   'org-wayne'),
  ('contact-fox-lucius',     'Lucius', 'Fox',      'lucius@wayne.example',  '+1-212-555-6002', 'Gotham',       'USA',   'org-wayne'),
  ('contact-dyson-miles',    'Miles',  'Dyson',    'miles@cyberdyne.example','+1-310-555-7001','Sunnyvale',    'USA',   'org-cyberdyne');
