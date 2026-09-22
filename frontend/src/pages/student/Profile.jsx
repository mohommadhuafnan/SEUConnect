import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { Card } from '../../components/StatCard';
import { User, Mail, Phone, MapPin, Award, Upload, Trash2, CheckCircle2 } from 'lucide-react';

export const StudentProfile = () => {
  const { user, profile, updateUserProfile } = useAuth();

  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [specialization, setSpecialization] = useState(profile?.specialization || 'Software Systems');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await authService.updateProfile({ phone, address, specialization });
      if (res.success) {
        updateUserProfile(res.data.user, res.data.profile);
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const res = await authService.uploadProfileImage(file);
      if (res.success) {
        updateUserProfile({ ...user, profileImage: res.data.imageUrl });
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) return;
    try {
      const res = await authService.removeProfileImage();
      if (res.success) {
        updateUserProfile({ ...user, profileImage: '' });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header">
        <h1>Student Academic Profile</h1>
        <p>Institutional identity, contact records, and degree programme enrollment.</p>
      </div>

      {message && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '12px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem'
        }}>
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="seu-card" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '2.5rem',
            overflow: 'hidden',
            border: '3px solid var(--border-color)'
          }}>
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user?.name?.charAt(0) || 'S'
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.name}</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user?.email}</div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-info">Reg No: {profile?.registrationNumber}</span>
            <span className="badge badge-neutral">Index: {profile?.indexNumber}</span>
            <span className="badge badge-success">{profile?.degreeProgramme} (Hons)</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
            <Upload size={14} /> {uploadingImg ? 'Uploading...' : 'Change Photo'}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImg} />
          </label>
          {user?.profileImage && (
            <button onClick={handleRemoveImage} className="btn btn-sm" style={{ color: 'var(--danger)', background: 'none', border: '1px solid var(--border-color)' }}>
              <Trash2 size={14} /> Remove Photo
            </button>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <Card title="Edit Contact & Academic Information">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={user?.name || ''} disabled style={{ backgroundColor: 'var(--bg-surface-hover)' }} />
            </div>
            <div className="form-group">
              <label className="form-label">University Email</label>
              <input type="email" className="form-input" value={user?.email || ''} disabled style={{ backgroundColor: 'var(--bg-surface-hover)' }} />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Faculty</label>
              <input type="text" className="form-input" value={profile?.faculty || 'Faculty of Technology'} disabled style={{ backgroundColor: 'var(--bg-surface-hover)' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input type="text" className="form-input" value={profile?.department || 'Department of ICT'} disabled style={{ backgroundColor: 'var(--bg-surface-hover)' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Degree Programme</label>
              <input type="text" className="form-input" value={`${profile?.degreeProgramme || 'BICT'} (Semester ${profile?.currentSemester || 5})`} disabled style={{ backgroundColor: 'var(--bg-surface-hover)' }} />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Contact Mobile Number</label>
              <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="077xxxxxxx" />
            </div>
            <div className="form-group">
              <label className="form-label">Field of Specialization</label>
              <select className="form-select" value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                <option value="Software Systems">Software Systems</option>
                <option value="Network & Cloud Infrastructure">Network & Cloud Infrastructure</option>
                <option value="Multimedia & Web Technologies">Multimedia & Web Technologies</option>
                <option value="Data Engineering">Data Engineering</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Permanent / Residential Address</label>
            <textarea className="form-textarea" rows="2" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your postal address" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudentProfile;
