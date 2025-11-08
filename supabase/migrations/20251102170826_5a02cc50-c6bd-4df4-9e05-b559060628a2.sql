-- Make user_id nullable in doctors table to allow seeding demo data
ALTER TABLE doctors ALTER COLUMN user_id DROP NOT NULL;

-- Add a demo_account flag to differentiate seeded doctors from real user accounts
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS demo_account BOOLEAN DEFAULT false;

-- Insert verified doctors with realistic data (demo accounts)
INSERT INTO doctors (specialization, license_number, years_experience, hospital_affiliation, bio, rating, verified, available, demo_account)
VALUES
  ('Cardiologist', 'MED-CARD-2015-8721', 8, 'Apollo Hospital', 'Specialized in interventional cardiology and preventive heart care. Committed to providing comprehensive cardiac care to all patients.', 4.8, true, true, true),
  ('Neurologist', 'MED-NEUR-2013-5643', 10, 'Fortis Hospital', 'Expert in treating neurological disorders including epilepsy, stroke, and Parkinson''s disease. Published researcher in neurodegenerative diseases.', 4.9, true, true, true),
  ('General Physician', 'MED-GP-2017-3421', 6, 'MedStar Clinic', 'Experienced in family medicine and primary care. Focus on preventive medicine and chronic disease management.', 4.7, true, true, true),
  ('Pediatrician', 'MED-PED-2016-9845', 7, 'Rainbow Children Hospital', 'Passionate about child health and development. Specialized in pediatric infectious diseases and immunization.', 4.9, true, true, true),
  ('Orthopedic Surgeon', 'MED-ORTH-2012-2134', 11, 'Max Hospital', 'Expert in joint replacement and sports medicine. Performed over 500 successful knee and hip replacement surgeries.', 4.8, true, true, true),
  ('Dermatologist', 'MED-DERM-2018-6789', 5, 'SkinCare Institute', 'Specialized in cosmetic and medical dermatology. Expert in treating acne, eczema, and skin cancer screening.', 4.6, true, true, true),
  ('Gynecologist', 'MED-GYN-2014-4567', 9, 'Women''s Health Center', 'Comprehensive women''s health care including pregnancy care, fertility treatments, and menopause management.', 4.8, true, true, true),
  ('Psychiatrist', 'MED-PSY-2015-7890', 8, 'Mind Wellness Clinic', 'Specialized in anxiety disorders, depression, and cognitive behavioral therapy. Holistic approach to mental health.', 4.7, true, true, true),
  ('Ophthalmologist', 'MED-OPH-2016-3456', 7, 'Vision Care Hospital', 'Expert in cataract surgery and LASIK procedures. Specialized in treating diabetic retinopathy and glaucoma.', 4.9, true, true, true),
  ('ENT Specialist', 'MED-ENT-2017-8901', 6, 'ENT Specialty Center', 'Experienced in treating ear, nose, and throat disorders. Specialist in sinus surgery and hearing restoration.', 4.7, true, true, true);

-- Create a helper view to get doctor names by specialization
CREATE OR REPLACE VIEW doctor_directory AS
SELECT 
  d.id,
  d.specialization,
  d.hospital_affiliation,
  d.years_experience,
  d.rating,
  d.bio,
  d.verified,
  d.available,
  CASE 
    WHEN d.specialization = 'Cardiologist' THEN 'Dr. Riya Mehta'
    WHEN d.specialization = 'Neurologist' THEN 'Dr. Aarav Patel'
    WHEN d.specialization = 'General Physician' THEN 'Dr. Neha Roy'
    WHEN d.specialization = 'Pediatrician' THEN 'Dr. Vikram Singh'
    WHEN d.specialization = 'Orthopedic Surgeon' THEN 'Dr. Priya Sharma'
    WHEN d.specialization = 'Dermatologist' THEN 'Dr. Arjun Malhotra'
    WHEN d.specialization = 'Gynecologist' THEN 'Dr. Anjali Gupta'
    WHEN d.specialization = 'Psychiatrist' THEN 'Dr. Rohan Desai'
    WHEN d.specialization = 'Ophthalmologist' THEN 'Dr. Kavya Reddy'
    WHEN d.specialization = 'ENT Specialist' THEN 'Dr. Sanjay Kumar'
    ELSE 'Dr. Unknown'
  END as full_name
FROM doctors d
WHERE d.demo_account = true OR d.user_id IS NOT NULL;

-- Grant access to the view
GRANT SELECT ON doctor_directory TO authenticated, anon;