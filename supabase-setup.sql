-- WanderWise - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Create the main table for teacher holiday data
CREATE TABLE teacher_holidays (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('home', 'travel')),
    location_name TEXT,
    latitude FLOAT8,
    longitude FLOAT8,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on employee_id for faster lookups
CREATE INDEX idx_teacher_holidays_employee_id ON teacher_holidays(employee_id);

-- Create an index on status for filtering
CREATE INDEX idx_teacher_holidays_status ON teacher_holidays(status);

-- Create an index on created_at for sorting
CREATE INDEX idx_teacher_holidays_created_at ON teacher_holidays(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE teacher_holidays ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for demo purposes)
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all operations" ON teacher_holidays
    FOR ALL USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_teacher_holidays_updated_at 
    BEFORE UPDATE ON teacher_holidays 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO teacher_holidays (name, employee_id, status, location_name, latitude, longitude, country) VALUES
('John Smith', 'EMP001', 'travel', 'Paris, France', 48.8566, 2.3522, 'France'),
('Sarah Johnson', 'EMP002', 'home', NULL, NULL, NULL, NULL),
('Michael Brown', 'EMP003', 'travel', 'Mumbai, India', 19.0760, 72.8777, 'India'),
('Emily Davis', 'EMP004', 'travel', 'New York, USA', 40.7128, -74.0060, 'United States'),
('David Wilson', 'EMP005', 'home', NULL, NULL, NULL, NULL);

-- Create a view for statistics (optional)
CREATE VIEW teacher_holiday_stats AS
SELECT 
    COUNT(*) as total_teachers,
    COUNT(CASE WHEN status = 'home' THEN 1 END) as stayed_home,
    COUNT(CASE WHEN status = 'travel' THEN 1 END) as traveled,
    COUNT(CASE WHEN status = 'travel' AND 
        latitude BETWEEN 6.8 AND 37.6 AND 
        longitude BETWEEN 68.1 AND 97.4 THEN 1 END) as traveled_in_india,
    COUNT(CASE WHEN status = 'travel' AND 
        (latitude < 6.8 OR latitude > 37.6 OR 
         longitude < 68.1 OR longitude > 97.4) THEN 1 END) as traveled_abroad
FROM teacher_holidays;

-- Grant necessary permissions
GRANT ALL ON TABLE teacher_holidays TO authenticated;
GRANT ALL ON TABLE teacher_holidays TO anon;
GRANT USAGE ON SEQUENCE teacher_holidays_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE teacher_holidays_id_seq TO anon; 