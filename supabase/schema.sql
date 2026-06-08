-- RAVE HOUSE DATABASE SCHEMA

-- 1. Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    date DATE,
    time TIME,
    venue TEXT,
    maps_link TEXT,
    registration_deadline DATE,
    max_participants INTEGER,
    fee NUMERIC DEFAULT 0,
    payment_type TEXT DEFAULT 'Free', -- 'Free', 'QR Payment', 'Razorpay'
    qr_enabled BOOLEAN DEFAULT FALSE,
    qr_image_url TEXT,
    upi_id TEXT,
    banner_url TEXT,
    status TEXT DEFAULT 'draft', -- 'draft', 'published'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create participants table
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mobile TEXT NOT NULL,
    emergency_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    transaction_id TEXT,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'free'
    registration_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    qr_ticket_url TEXT,
    attendance_status TEXT DEFAULT 'absent', -- 'absent', 'checked-in'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(participant_id, event_id)
);

-- 4. Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    video_url TEXT,
    uploaded_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    participant_email TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    suggestion TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    interest_area TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Create visitor_analytics table
CREATE TABLE IF NOT EXISTS visitor_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT NOT NULL,
    visitor_count INTEGER DEFAULT 1,
    visit_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(page_name, visit_date)
);

-- Enable Row Level Security (RLS) on tables if desired, but for ease of use in MVP, we can keep policies permissive or set public access.
-- Here, we'll create simple policies allowing public read-write for client operations, and restrict write access on sensitive tables like admins.

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Create Public Access Policies (Allow Anon to read/write for frontend, admin to do everything)
CREATE POLICY "Allow public read access to events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to events" ON events FOR ALL USING (true);

CREATE POLICY "Allow public insert to participants" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to participants" ON participants FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to participants" ON participants FOR ALL USING (true);

CREATE POLICY "Allow public insert/select to registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to registrations" ON registrations FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to registrations" ON registrations FOR ALL USING (true);

CREATE POLICY "Allow public read access to admins" ON admins FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to admins" ON admins FOR ALL USING (true);

CREATE POLICY "Allow public read access to gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to gallery" ON gallery FOR ALL USING (true);

CREATE POLICY "Allow public insert/select to feedback" ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to feedback" ON feedback FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to feedback" ON feedback FOR ALL USING (true);

CREATE POLICY "Allow public read access to announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to announcements" ON announcements FOR ALL USING (true);

CREATE POLICY "Allow public insert to suggestions" ON suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access to suggestions" ON suggestions FOR ALL USING (true);

CREATE POLICY "Allow public insert to volunteers" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access to volunteers" ON volunteers FOR ALL USING (true);

CREATE POLICY "Allow public select/insert/update to visitor_analytics" ON visitor_analytics FOR ALL USING (true);
