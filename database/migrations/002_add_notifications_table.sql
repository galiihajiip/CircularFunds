-- Migration: Add notifications table
-- Purpose: Email/in-app notifications untuk UMKM dan Kreditor
-- Created: January 25, 2026

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification type
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'in_app', 'push')),
    
    -- Notification category
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'submission_scored',
        'kreditor_viewed',
        'bookmark_added',
        'message_received',
        'profile_updated',
        'score_improved',
        'new_recommendation'
    )),
    
    -- Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Additional data (JSON)
    data JSONB,
    
    -- Read status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_category ON notifications(category);

-- Create trigger for updated_at
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO notifications (user_id, type, category, title, message, data) VALUES
-- Sample for UMKM user (assuming user exists)
(
    (SELECT id FROM users WHERE role = 'UMKM' LIMIT 1),
    'in_app',
    'submission_scored',
    'Skor Anda Sudah Tersedia!',
    'Submission Anda telah dinilai. Skor total: 72/100 dengan kategori "Ready".',
    '{"score": 72, "recommendation": "Ready", "submission_id": "uuid-here"}'::jsonb
),
(
    (SELECT id FROM users WHERE role = 'UMKM' LIMIT 1),
    'in_app',
    'kreditor_viewed',
    'Profil Anda Dilihat Kreditor',
    'Seorang kreditor baru saja melihat profil bisnis Anda.',
    '{"kreditor_name": "PT Investasi Hijau", "viewed_at": "2026-01-25T10:30:00Z"}'::jsonb
),
(
    (SELECT id FROM users WHERE role = 'UMKM' LIMIT 1),
    'email',
    'score_improved',
    'Selamat! Skor Anda Meningkat',
    'Skor circular readiness Anda meningkat dari 65 menjadi 72. Terus tingkatkan praktik sirkular Anda!',
    '{"previous_score": 65, "new_score": 72, "improvement": 7}'::jsonb
),
-- Sample for Kreditor user
(
    (SELECT id FROM users WHERE role = 'KREDITOR' LIMIT 1),
    'in_app',
    'new_recommendation',
    'UMKM Baru Sesuai Preferensi Anda',
    '3 UMKM baru dengan skor tinggi di sektor Fashion tersedia untuk Anda.',
    '{"count": 3, "sector": "Fashion", "min_score": 75}'::jsonb
),
(
    (SELECT id FROM users WHERE role = 'KREDITOR' LIMIT 1),
    'in_app',
    'bookmark_added',
    'UMKM Ditambahkan ke Bookmark',
    'Anda berhasil menambahkan "Tas Daur Ulang Ibu Siti" ke daftar bookmark.',
    '{"umkm_name": "Tas Daur Ulang Ibu Siti", "umkm_id": "uuid-here"}'::jsonb
);

-- Create view for unread notifications count per user
CREATE VIEW unread_notifications_count AS
SELECT 
    user_id,
    COUNT(*) as unread_count
FROM notifications
WHERE is_read = FALSE
GROUP BY user_id;

-- Create function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE notifications
    SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
    WHERE id = notification_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    affected_rows INTEGER;
BEGIN
    UPDATE notifications
    SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id AND is_read = FALSE;
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    RETURN affected_rows;
END;
$$ LANGUAGE plpgsql;

-- Create function to delete old read notifications (cleanup)
CREATE OR REPLACE FUNCTION cleanup_old_notifications(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_rows INTEGER;
BEGIN
    DELETE FROM notifications
    WHERE is_read = TRUE 
    AND read_at < CURRENT_TIMESTAMP - (days_old || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_rows = ROW_COUNT;
    RETURN deleted_rows;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE notifications IS 'Stores all notifications for users (email, in-app, push)';
COMMENT ON COLUMN notifications.type IS 'Notification delivery type: email, in_app, or push';
COMMENT ON COLUMN notifications.category IS 'Notification category for grouping and filtering';
COMMENT ON COLUMN notifications.data IS 'Additional JSON data specific to notification type';
COMMENT ON FUNCTION mark_notification_read IS 'Mark a single notification as read';
COMMENT ON FUNCTION mark_all_notifications_read IS 'Mark all unread notifications for a user as read';
COMMENT ON FUNCTION cleanup_old_notifications IS 'Delete old read notifications (default: 90 days)';

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE ON notifications TO app_user;
-- GRANT SELECT ON unread_notifications_count TO app_user;
-- GRANT EXECUTE ON FUNCTION mark_notification_read TO app_user;
-- GRANT EXECUTE ON FUNCTION mark_all_notifications_read TO app_user;
